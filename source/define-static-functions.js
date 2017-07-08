const curryMonadMethod = (anyConstructor, methodName) => {
  const method = anyConstructor.prototype[methodName];

  const staticVersionArity = method.length + 1;

  const recurry = (...parameters) => {
    if (parameters.length < staticVersionArity) {
      return (...additionalParameters) => {
        return recurry(...parameters.concat(additionalParameters));
      };
    }

    const instance = parameters[staticVersionArity - 1];

    parameters.splice(staticVersionArity - 1, 1);

    return instance[methodName].call(instance, ...parameters);
  };

  return recurry;
};

// Omit Pending from the constructors, please.
module.exports = (Monad, constructors) => {
  const anyConstructor = Object.values(constructors)[0];

  Object
  .keys(anyConstructor.prototype)
  .forEach(methodName => {
    Monad[methodName] = curryMonadMethod(anyConstructor, methodName);
  });
};
