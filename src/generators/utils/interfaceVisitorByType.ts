import ts from 'typescript';

export class InterfaceVisitorByType {
  private foundNodes: ts.InterfaceDeclaration[] = [];
  private constructor(
    private sourceFile: ts.SourceFile,
    private type: string
  ) {}

  static getAll(
    sourceFile: ts.SourceFile,
    type: string
  ): ts.InterfaceDeclaration[] {
    const instance = new InterfaceVisitorByType(sourceFile, type);
    instance.visit(sourceFile);
    return instance.foundNodes;
  }

  visit(node: ts.Node) {
    if (ts.isInterfaceDeclaration(node)) {
      if (node.name?.getText(this.sourceFile) === this.type) {
        this.foundNodes.push(node);
        return;
      }
    }
    ts.forEachChild(node, (child) => this.visit(child));
  }
}
