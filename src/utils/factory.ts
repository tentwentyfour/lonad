interface IPrototype { prototype: any; }

type Constructor<T = any> = new (...args: any[]) => T;

/**
 * Function assigns the prototype of the patch to the target object.
 * @param objectToPatch The object to patch
 * @param patch The prototype patch to apply
 */
export function patchPrototype<T extends IPrototype, Y extends Constructor>(objectToPatch: T, patch: Y): void {
  const oldPrototype = objectToPatch.prototype;
  objectToPatch.prototype = Object.create(patch.prototype);
  return Object.assign(objectToPatch.prototype, oldPrototype);
}

/**
 * Function instantiates an object and assigns the prototype of the factory to the new object.
 * @param constructor The constructor to instantiate
 * @param factory The factory function to use
 * @param args The arguments to pass to the constructor
 * @returns An instance of the constructor
 */
export function instantiateWithFactory<T extends Constructor>(
  constructor: T,
  factory: IPrototype,
  ...args: ConstructorParameters<T>
): InstanceType<T> {
  const newInstance = new constructor(...args);
  Object.setPrototypeOf(newInstance, factory.prototype);
  return newInstance;
}
