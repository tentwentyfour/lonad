import ts from 'typescript';

export class CommentVisitorByNode {
  private foundComment?: string = undefined;
  private constructor(
    private sourceFile: ts.SourceFile,
    private type: ts.Node
  ) {}

  static getAll(sourceFile: ts.SourceFile, node: ts.Node): string | undefined {
    const instance = new CommentVisitorByNode(sourceFile, node);
    instance.visit(instance.type);
    return instance.foundComment;
  }

  visit(node: ts.Node) {
    const commentRanges = ts.getLeadingCommentRanges(
      this.sourceFile.getFullText(),
      node.getFullStart()
    );

    this.foundComment = commentRanges
      ?.map((r) => this.sourceFile.getFullText().slice(r.pos, r.end))
      .pop() ?? '';
  }
}
