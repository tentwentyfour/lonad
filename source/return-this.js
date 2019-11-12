async function absorbRejectedPromises(value) {
  try {
    await value;
  } catch (_) {
    // Nothing to do here.
  }
}

module.exports = {
  nullary: function nullaryReturnThis() {
    return this;
  },

  unary: function unaryReturnThis(unusedArgument) {
    absorbRejectedPromises(unusedArgument);

    return this;
  },

  binary: function unaryReturnThis(unusedArgument, secondUnusedArgument) {
    absorbRejectedPromises(unusedArgument);
    absorbRejectedPromises(secondUnusedArgument);

    return this;
  }
};
