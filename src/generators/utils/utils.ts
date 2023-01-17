import _ from 'lodash';

import { MethodProperty, GenericDefinition, DocumentationSignature } from './utils.method.js';

type MethodOverloads = {
  [id: string]: MethodOverload
}

type MethodOverload = {
  keyValue: string,
  children?: MethodOverloads
}


export function TypeOverloadByParametersObjToStr(obj: Record<string, any>): string{
  const keys = Object.keys(obj);
  const result: string[] = [];

  
  keys.forEach((key) => {
    const content = obj[key];
    const keyValue = content.keyValue
    const value = (content.children) 
      ? `: ${TypeOverloadByParametersObjToStr(content.children)}` 
      : '';

    result.push(`${keyValue}${value}`)
  })

  return `{ ${result.join(',\n')} }`
}

function createTypeOverloadNode(generics: GenericDefinition[], parameters: MethodProperty[], returnType: string, children?: MethodOverloads, comment = ''): MethodOverloads {
  const genericsStr = getGenericString(generics);
  const paramsStr = getParametersString(parameters);

  const paramsComments = createComment(comment + createParameterComments(parameters));
  const returnStr = (!children) ? `: ${returnType}` : '';
  const func = `${genericsStr}(${paramsStr})${returnStr}`

  return {
    [func]: {
      keyValue: `${paramsComments}${func}`,
      children
    }
  };
}

/**
 * @note: It Is necessary to create a type instead of function overloads because typescript
 *      does not understand them very well, while types work fine!
 */
export function createTypeOverload(
  params: MethodProperty[],
  generics: GenericDefinition[],
  returnType: string,
  comments?: DocumentationSignature
): MethodOverloads {
  if (params.length === 1) {
    return createTypeOverloadNode(generics, params, returnType);
  }

  let results: MethodOverloads = {};
  const previousParameters: MethodProperty[] = [];

  for (let i = 0; i < params.length-1; i++) {
    const subParameters = [...previousParameters, params[i]];
    previousParameters.push(params[i]);

    const allConsumedGenerics = _.uniq(subParameters.flatMap((param) => param.consumedTypes));

    const node = createTypeOverloadNode(
      generics, subParameters, returnType, 
      createTypeOverload(
        params.filter((e) => !previousParameters.find((r) => r.name === e.name)),
        generics.filter((generic) => !allConsumedGenerics.includes(generic.name)),
        returnType,
        comments
      )
    );

    results = {
      ...results,
      ...node
    }
  }

  return {
    ...results,
    ...createTypeOverloadNode(generics, params, returnType)
  }
}


/**
 * Creates and formats a string containing the given generics
 * @param generics The generics to create the string with
 * @returns The string
 * @example
 * getGenericString([{name: "T", value: "string"}])
 *
 * // Output: "<T>"
 */
function getGenericString(generics: GenericDefinition[]): string {
  return generics && generics.length > 0 
    ? `<${generics.map(e => e.fullValue).join(', ')}>` 
    : '';
}

/**
 * Creates and formats a string containing the given parameters
 * @param params The parameters to create the string with
 * @returns The string
 * @example
 * getParametersString([{name: "param1", type: "string"}])
 * 
 * // Output: "param1: string"
 */
function getParametersString(params: MethodProperty[]): string {
  return params && params.length > 0 
    ? params.map((param) => `${param.name}: ${param.type}`).join(', ') 
    : '';
}

/**
 * Create a comment for a method
 * @param trimmedText  The text to create the comment
 * @returns   The comment
 */
export function createComment(text?: string) {
  const trimmedText = text?.trim();
  return trimmedText && trimmedText.length > 0
    ? `
    /**
     * ${trimmedText
    .split('\n')
    .map((e) => e.trim())
    .join('\n * ')}
     */ 
    `
    : '';
}

function createParameterComments (params: MethodProperty[]) {
  return params
    .filter((param) => param.documentation)
    .map((param) => createParameterComment(param.name, param.documentation))
    .join('\n');
}

export function createParameterComment(param: string, parameterText?: string) {
  const trimmedParameterText = parameterText?.trim();
  return param && trimmedParameterText ? `@param ${param} ${trimmedParameterText}` : '';
}
