import ts from 'typescript';

export class ClassVisitorByType {
  private foundNodes: ts.ClassDeclaration[] = [];
  private constructor(
      private sourceFile: ts.SourceFile,
      private type: string
  ) {}
  
  static getAll(
    sourceFile: ts.SourceFile,
    type: string
  ): ts.ClassDeclaration[] {
    const instance = new ClassVisitorByType(sourceFile, type);
    instance.visit(sourceFile);
    return instance.foundNodes;
  }
  
  visit(node: ts.Node) {
    if (ts.isClassDeclaration(node)) {
      if (node.name?.getText(this.sourceFile) === this.type) {
        this.foundNodes.push(node);
        return;
      }
    }
    ts.forEachChild(node, (child) => this.visit(child));
  }
}
