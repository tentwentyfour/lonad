async function absorbRejectedPromises(value: Promise<any>) {
  try {
    await value;
  } catch (_) {
    // Nothing to do here.
  }
}


export default {
  nullary: function nullaryReturnThis() {
    return this;
  },

  unary: function unaryReturnThis(unusedArgument: any) {
    absorbRejectedPromises(unusedArgument);

    return this;
  },

  binary: function unaryReturnThis(unusedArgument: any, secondUnusedArgument: any) {
    absorbRejectedPromises(unusedArgument);
    absorbRejectedPromises(secondUnusedArgument);

    return this;
  },

  any: function anyReturnThis(...unusedArguments: any[]) {
    unusedArguments.forEach(absorbRejectedPromises);

    return this;
  }
}
