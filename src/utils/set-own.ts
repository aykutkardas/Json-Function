// `target["__proto__"] = value` replaces the prototype of target instead of
// creating a key, which lets data such as a JSON key change what an object
// inherits. Use this whenever the key can come from data or user input.
const setOwn = (target: Record<string, any>, key: string, value: unknown) => {
  if (key === "__proto__") {
    Object.defineProperty(target, key, {
      value,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  } else {
    target[key] = value;
  }
};

export default setOwn;
