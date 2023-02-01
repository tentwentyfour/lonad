import ts from 'typescript';

export class SignatureVisitorByClassOrInterface {
  private foundNodes: (ts.MethodSignature | ts.MethodDeclaration)[] = [];
  private constructor(private type: ts.InterfaceDeclaration | ts.ClassDeclaration) {}

  static getAll(type: ts.ClassDeclaration): ts.MethodDeclaration[]
  static getAll(type: ts.InterfaceDeclaration): ts.MethodSignature[]
  static getAll(type: ts.InterfaceDeclaration | ts.ClassDeclaration): (ts.MethodSignature | ts.MethodDeclaration)[] {
    const instance = new SignatureVisitorByClassOrInterface(type);
    instance.visit(instance.type);
    return instance.foundNodes;
  }

  visit(node: ts.Node) {
    if (ts.isMethodSignature(node) || ts.isMethodDeclaration(node)) {
      this.foundNodes.push(node);
      return;
    } 

    ts.forEachChild(node, (child) => this.visit(child));
  }
}
