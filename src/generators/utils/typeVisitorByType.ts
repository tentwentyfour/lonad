import ts from 'typescript';

export class TypeVisitorByType {
  private foundNodes: ts.TypeNode[] = [];
  private constructor(private type: ts.TypeNode) {}
  
  static getAll(type: ts.TypeNode): ts.TypeNode[] {
    const instance = new TypeVisitorByType(type);
    instance.visit(type);
    return instance.foundNodes;
  }
  
  visit(node: ts.Node) {
    if (ts.isUnionTypeNode(node)){
      ts.forEachChild(node, (child) => this.visit(child));
      return;
    }
  
    if (ts.isTypeNode(node)){
      this.foundNodes.push(node);
      return;
    }
  }
}
