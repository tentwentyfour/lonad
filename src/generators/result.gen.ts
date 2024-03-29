import ts from 'typescript';
import _ from 'lodash';
import merge from 'deepmerge';

import {
  createComment,
  createTypeOverload,
  TypeOverloadByParametersObjToStr,
} from './utils/utils.js';

import { MethodDefinition, getAllMethodsByFileAndName } from './utils/utils.method.js';

const srcDirectoryPath = './src'
const generatedDirectoryPath = `${srcDirectoryPath}/generated`;

const filePathToInterface = srcDirectoryPath + '/result.types.ts';
const interfaceName = 'IResult';

const syncFileName = generatedDirectoryPath + '/syncResult.generated.ts'
const syncClassName = 'SyncResult'

const asyncFileName = generatedDirectoryPath + '/asyncResult.generated.ts'
const asyncClassName = 'AsyncResult'


const generatedFileName = 'result.generated.ts';
const generatedClassName = 'Result';

const instanceParam: [string, string, string[]] = [
  'optional',
  'Result<T>',
  ['T'],
];
const instance = 'Result.Ok()';

const warning = `
// ========================================================
// This file is generated by result.gen.ts
// Do not edit this file directly
// ========================================================
`;

const importStatments = `
/* eslint-disable @typescript-eslint/ban-types */
import { IResult, IResultCallbacks, createOkType, createErrorType, createAbortedType, createPendingType } from '@src/result.types';
import { doTry, expect, fromPromise, tryAsync, when, isResult, isSyncResult, isAsyncResult } from '@result/result.utils';
import { Optional } from '@optional/index';
import { AsyncResult } from './asyncResult.generated';
import { SyncResult } from './syncResult.generated';
import { IfAnyOrUnknown, IfAny } from '@utils/types';
`;

const baseFunctions = `
isResultInstance = true as const;
isAsynchronous: boolean = false;
isOk: boolean = false;
isError: boolean = false;
isAborted: boolean = false;

static Ok: createOkType;
static Error: createErrorType;
static Aborted: createAbortedType;
static Pending: createPendingType;
static fromPromise = fromPromise;
static when = when;
static expect = expect;
static try = doTry;
static tryAsync = tryAsync;

static isResult = isResult;
static isSyncResult = isSyncResult;
static isAsyncResult = isAsyncResult;
`;

const classComment = `
/**
 * The base class for all results.
 * The Result class is a combination of both the SyncResult
 * and AsyncResult classes. As such it can be used as a base.
 * @example
 * const syncResult = Result.Ok(1); // SyncResult<number>
 * const result = syncResult as Result<number>; // Result<number>
 * const returnedResult = result.get(); // number | Promise<number>
 *
 * // result is now a Result<number> which can be a SyncResult<number> or an
 * //   AsyncResult<number>. It is not known which one it is. Thus when
 * //   calling functions on it, the return type will be a union of both.
 */
`;

const instanceParameterComment = `The instance parameter to use as a base to call the functions with.`;

const classTemplate = (name: string, content: string) => {
  return `export abstract class ${name}<T = any> implements ${interfaceName}<T> {
        ${content}
    }`;
};

const templatefuncImplementation = (
  name: string,
  type: string,
  maxParams: number,
  comment?: string
) => {
  const commentFormated = createComment(comment);

  return `
        ${commentFormated}
        static ${name}: ${type} = <T>(...params: any[]): any => {
            if(params.length < ${maxParams}) {
                return (...subParams: any[]) => (${generatedClassName}.${name} as any)(...[...params, ...subParams]);
            }

            const instance = params.splice(${maxParams - 1}, 1)[0];
            return (instance ?? ${instance}).${name}(...params);
        }
    `.trimEnd();
};

const program = ts.createProgram([filePathToInterface, asyncFileName], {});
const checker = program.getTypeChecker();

const sourceFile = program.getSourceFile(filePathToInterface);
const asyncSourceFile = program.getSourceFile(asyncFileName);
const syncSourceFile = program.getSourceFile(syncFileName);

function getAllMethodsAndAddOrigin(file: ts.SourceFile, name: string, isInterface = false){
  return getAllMethodsByFileAndName(file, checker, name, isInterface)
    .map((node) =>
      ({
        ...node,
        origin: (interfaceName !== name) ? name : generatedClassName
      }));
}

const asyncMethods = getAllMethodsAndAddOrigin(asyncSourceFile!, asyncClassName).filter((e) => !e.hasImplementation);
const syncMethods = getAllMethodsAndAddOrigin(syncSourceFile!, syncClassName).filter((e) => !e.hasImplementation);
const resultMethods = getAllMethodsAndAddOrigin(sourceFile!, interfaceName, true);

const abstractMethods = resultMethods.map(e => `${e.documentation.raw?.fullRaw ?? ''}\nabstract ${e.content}`).join('\n')

const signatures = [
  ...asyncMethods,
  ...syncMethods,
  ...resultMethods
]

const signaturesGrouped = mergeFunctionOverloadDocumentation(_.groupBy(signatures, 'name'));

const funcs = _.map(signaturesGrouped, (value, name) => {
  let paramsCount = 0;
  let types: Record<string, any> = {}
  let comment: string | undefined;
  _.forEach(value, (signature) => {
    const { generics, parameters, returnType, origin } = signature;
    paramsCount = Math.max(paramsCount, parameters.length);
    comment = signature.documentation.method;

    signature.documentation.fields = {
      ...signature.documentation.fields,
      ...{ [instanceParam[0]]: instanceParameterComment },
    };

    const newOverload = createTypeOverload(
      [
        ...parameters,
        {
          name: instanceParam[0],
          type: `${origin}<T>`,
          consumedTypes: instanceParam[2],
          documentation: instanceParameterComment,
          isOptional: false,
        },
      ],
      [
        { name: 'T', fullValue: 'T = any' },
        ...generics,
      ],
      returnType.type,
      signature.documentation
    );

    types = merge(types, newOverload);
  });

  return templatefuncImplementation(
    name,
    TypeOverloadByParametersObjToStr(types),
    paramsCount + 1,
    comment
  );
}).join('');

const fileContents = `
    ${warning}
    ${importStatments}
    ${classComment}
    ${classTemplate(generatedClassName, `${baseFunctions}\n${funcs}\n${abstractMethods}`)}
`;

const resultFile = ts.createSourceFile(
  generatedFileName,
  fileContents,
  ts.ScriptTarget.ESNext,
  false,
  ts.ScriptKind.TS
);
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

ts.sys.writeFile(
  `${generatedDirectoryPath}/${resultFile.fileName}`,
  printer.printFile(resultFile)
);

function mergeFunctionOverloadDocumentation(groupedFunctions: _.Dictionary<(MethodDefinition & { origin: string })[]>){
  _.forEach(groupedFunctions, (value, name) => {
    const docToUse =
      value.find(overload => overload.documentation.raw?.fullRaw)

    if (!docToUse)
      return;

    value.forEach(overload => {
      if (!overload.documentation.raw?.fullRaw){
        overload.documentation = docToUse!.documentation;
      }
    });
  });

  return groupedFunctions;
}
