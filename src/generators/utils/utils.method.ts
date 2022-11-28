import _ from 'lodash';
import ts from 'typescript';
import { ClassVisitorByType } from './classVisitorByType.js';
import { InterfaceVisitorByType } from './interfaceVisitorByType.js';
import { MethodPropertyUsedTypesVisitor } from './methodPropertyUsedGenericVisitor.js';
import { SignatureVisitorByClassOrInterface } from './signatureVisitorByInterface.js';
import { TypeVisitorByType } from './typeVisitorByType.js';
import { CommentVisitorByNode } from './commentVisitorByNode.js';

const COMMENT_REGEX = /@(?:(\w+)[ |\n]+((?:[\s\S](?!\*\/|@))*))/gm;
// eslint-disable-next-line no-useless-escape
const COMMENT_REGEX_STAR = /[\*|\*\/]/gm

export type DocumentationSignature = {
  method: string;
  fields: {
    [x: string]: string;
  };
  raw?: RawDocumentationSignature;
};

export type RawDocumentationSignature = {
  fullRaw: string;
  members: {
    [x: string]: string[];
  }
};

export type MethodProperty = {
  name: string;
  type: string;
  isOptional: boolean;
  consumedTypes: string[];
  documentation?: string;
};

export type GenericDefinition = {
  name: string;
  fullValue: string;
};

export type ReturnType = {
  type: string;
  subTypes: string[];
};

export type MethodDefinition = {
  name: string;
  generics: GenericDefinition[];
  parameters: MethodProperty[];
  returnType: ReturnType;
  content: string;
  documentation: DocumentationSignature;
  hasImplementation: boolean;
};

/**
 * Get all the methods of a class or interface.
 * @param file The file to get the methods from
 * @param checker The type checker
 * @param name The name of the class or interface
 * @param isInterface If the methods are contained is an interface or not
 * @returns The methods of the class or interface
 */
export function getAllMethodsByFileAndName(
  file: ts.SourceFile,
  checker: ts.TypeChecker,
  name: string,
  isInterface = false
) {
  const nodes = isInterface
    ? InterfaceVisitorByType.getAll(file, name)
    : ClassVisitorByType.getAll(file, name);
  
  return SignatureVisitorByClassOrInterface
    .getAll(nodes[0] as any)
    .map((node) => retriveInfoOnMethod(checker, file, node));
}

/**
 * Get the information of a method signature or declaration.
 * @param checker The type checker
 * @param sourceFile The source file of the method
 * @param method The method to get the information from
 * @returns The information of the method
 * @example
 * // The method
 * function test<T, U = T>(a: T, b: Promise<U>): Promise<T> | T {
 *  return a;
 * }
 *
 * // The information
 * const info = retriveInfoOnMethod(checker, sourceFile, method);
 *
 * // The result
 * info = {
 *  name: "test",
 *  generics: [
 *    { name: "T", fullValue: "T" },
 *    { name: "U", fullValue: "U = T" }
 *  ],
 *  parameters: [
 *    { name: "a", type: "T", consumedTypes: ["T"] },
 *    { name: "b", type: "Promise<U>", consumedTypes: ["U"] }
 *  ],
 *  returnType: { type: "Promise<T> | T", subTypes: ["Promise<T>", "T"] },
 *  content: "function test<T, U = T>(a: T, b: Promise<U>): Promise<T> | T { return a; }",
 *  documentation: { method: "", fields: {} }
 *  hasImplementation: true,
 * }
 */
export function retriveInfoOnMethod(
  checker: ts.TypeChecker,
  sourceFile: ts.SourceFile,
  method: ts.MethodSignature | ts.MethodDeclaration
): MethodDefinition {
  const documentation = getMethodDocumentation(method, checker, sourceFile);

  return {
    name: method.name.getText(sourceFile!),
    generics: getMethodGenerics(method),
    parameters: getMethodParameters(method, sourceFile, checker, documentation),
    returnType: getMethodReturnType(method, checker),
    content: method.getText(sourceFile!),
    documentation,
    hasImplementation: method.getLastToken(sourceFile!)?.kind === ts.SyntaxKind.CloseBraceToken
  };
}

/**
 * Get the return type of a method signature or declaration.
 * @param method The method to get the return type from
 * @param checker The type checker
 * @returns The return type of the method
 * @example
 * // The method
 * function test<T>(a: T | Promise<T>): T | Promise<T> {
 *  return a;
 * }
 *
 * // The return type
 * const returnType = getMethodReturnType(method, checker);
 *
 * // The result
 * returnType = {
 *  type: "T | Promise<T>",
 *  subTypes: ["T", "Promise<T>"]
 * }
 */
function getMethodReturnType(
  method: ts.MethodSignature | ts.MethodDeclaration,
  checker: ts.TypeChecker
): ReturnType {
  return {
    type: checker.typeToString(checker.getTypeAtLocation(method.type!)),
    subTypes: TypeVisitorByType.getAll(method.type!).map((w) =>
      checker.typeToString(checker.getTypeAtLocation(w))),
  };
}

/**
 * Get the documentation of a method signature.
 * @param signature The signature of the method
 * @param checker The type checker
 * @returns The documentation of the method
 */
function getMethodDocumentation(
  method: ts.MethodSignature | ts.MethodDeclaration,
  checker: ts.TypeChecker,
  sourceFile: ts.SourceFile
): DocumentationSignature {
  const signature = checker.getSignatureFromDeclaration(method);
  const raw = formatRawComment(CommentVisitorByNode.getAll(sourceFile, method));

  return {
    method: ts.displayPartsToString(signature?.getDocumentationComment(checker)),
    fields: getMethodDocumentationForFields(signature, checker),
    raw
  };
}

/**
 * Get the documentation of the parameters of a method signature.
 * @param signature The signature of the method
 * @param checker The type checker
 * @returns The documentation of the method parameters
 */
function getMethodDocumentationForFields(
  signature: ts.Signature | undefined,
  checker: ts.TypeChecker
): { [x: string]: string } {
  return (
    signature?.parameters
      .map((e) => ({
        [e.getName()]: ts.displayPartsToString(e.getDocumentationComment(checker)),
      }))
      .reduce((acc, next) => ({ ...acc, ...next }), {}) ?? {}
  );
}

/**
 *  Get the parameters of a method signature or declaration.
 * @param method The method to get the parameters from
 * @param sourceFile The source file of the method
 * @param checker The type checker
 * @returns The parameters of the method
 * @example
 * // The method
 * function test<T, U, Y>(a: T, b: U | Y): T {
 *  return a;
 * }
 *
 * // The parameters
 * const parameters = getMethodParameters(method, sourceFile, checker);
 *
 * // The result
 * parameters = [
 *  { name: "a", type: "T", consumedTypes: ["T"] },
 *  { name: "b", type: "U | Y", consumedTypes: ["U", "Y"] }
 * ]
 */
function getMethodParameters(
  method: ts.MethodSignature | ts.MethodDeclaration,
  sourceFile: ts.SourceFile,
  checker: ts.TypeChecker,
  documentation: DocumentationSignature
): MethodProperty[] {
  return method.parameters.map((param) => ({
    name: param.name.getText(sourceFile!),
    type: checker.typeToString(checker.getTypeAtLocation(param)),
    isOptional: param.getText().includes('?'),
    consumedTypes: _.uniq(MethodPropertyUsedTypesVisitor.getAll(param).map((type) =>
      type.getText(sourceFile))),
    documentation: documentation.fields[param.name.getText(sourceFile!)],
  }));
}

/**
 * Get the generics of a method signature or declaration.
 * @param method The method to get the generics from
 * @returns The generics of the method
 * @example
 * // The method
 * function test<T, U = T>(a: T, b: U): T {
 *  return a;
 * }
 *
 * // The generics
 * const generics = getMethodGenerics(method);
 *
 * // The result
 * generics = [
 *  { name: "T", fullValue: "T" },
 *  { name: "U", fullValue: "U = T" }
 * ]
 */
function getMethodGenerics(method: ts.MethodSignature | ts.MethodDeclaration): GenericDefinition[] {
  return (
    method.typeParameters?.map((node) => ({
      name: node.name.text,
      fullValue: node.getText(),
    })) ?? []
  );
}


function formatRawComment(comment?: string): RawDocumentationSignature | undefined{
  const match: RegExpExecArray | null = null;
  const matches: Record<string, any> = {};

  if (!comment || comment.trim().length <= 0) {
    return undefined;
  }

  do {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-shadow
    const [_, key, value] = COMMENT_REGEX.exec(comment) ?? [];

    if (!key || !value) {
      continue;
    }

    const commentKey = key.trim();
    const commentValue = value.replace(COMMENT_REGEX_STAR, '').trim();

    matches[commentKey] = (matches[commentKey]) ? [...matches[commentKey], commentValue] : [commentValue];
  }
  while (match != null);

  return {
    fullRaw: comment,
    members: matches
  };
}
