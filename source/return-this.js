module.exports = {
  nullary: function nullaryReturnThis() {
    return this;
  },

  unary: function unaryReturnThis(unusedArgument) {
    return this;
  },

  binary: function binaryReturnThis(unusedArgument, secondUnusedArgument) {
    return this;
  }
};
