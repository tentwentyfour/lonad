import { NoneClass } from './none';
import { SomeClass } from './some';
export declare const Some: <T>(value?: T | undefined) => SomeClass<T>;
export declare const None: () => NoneClass;
