import ts from 'typescript';
import type { GenericDefinition } from './utils.method';

export class MethodPropertyUsedTypesVisitor {
  private foundNodes: ts.TypeReferenceNode[] = [];
  private generics: GenericDefinition[] = [];

  private constructor(private type: ts.ParameterDeclaration) {}

  static getAll(type: ts.ParameterDeclaration, availableGenerics: GenericDefinition[]): ts.TypeReferenceNode[] {
    const instance = new MethodPropertyUsedTypesVisitor(type);
    instance.generics = availableGenerics;
    instance.visit(instance.type);
    return instance.foundNodes;
  }

  visit(node: ts.Node) {
    if (ts.isTypeReferenceNode(node)) {
      this.foundNodes.push(node);
    }

    ts.forEachChild(node, (child) => this.visit(child));
  }
}
