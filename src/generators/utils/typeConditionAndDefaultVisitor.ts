import _ from 'lodash';
import ts from 'typescript';

export class TypeConditionAndDefaultVisitor {
  private foundNodes: ts.TypeReferenceNode[] = [];

  private constructor() {}

  static getAll(type: ts.TypeParameterDeclaration): ts.TypeReferenceNode[] {
    const instance = new TypeConditionAndDefaultVisitor();
    const condition = ts.getEffectiveConstraintOfTypeParameter(type);
    const defaultType = type.default;

    if (condition) {
      instance.visit(condition);
    }

    // if (defaultType) {
    //   instance.visit(defaultType);
    // }

    return _.uniq(instance.foundNodes);
  }

  visit(node: ts.Node) {
    if (ts.isTypeReferenceNode(node)) {
      this.foundNodes.push(node);
    }

    ts.forEachChild(node, (child) => this.visit(child));
  }
}
