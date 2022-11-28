import ts from 'typescript';

export class MethodPropertyUsedTypesVisitor {
  private foundNodes: ts.TypeReferenceNode[] = [];

  private constructor(private type: ts.ParameterDeclaration) {}

  static getAll(type: ts.ParameterDeclaration): ts.TypeReferenceNode[] {
    const instance = new MethodPropertyUsedTypesVisitor(type);
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
