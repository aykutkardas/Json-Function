// Inspired by https://github.com/burakcan/mb
// var mb=p=>o=>p.map(c=>o=(o||{})[c])&&o

type Getter = (o: any) => any;

const EMPTY = {} as Record<string, any>;
const MAX_CACHE_SIZE = 1000;
const cache = new Map<string, Getter>();

// Splitting the path and allocating a closure for every item was the main
// cost in where/orderBy/search/schema, so getters are built once per path.
// One and two segment paths, the common case, get a dedicated function.
const compile = (path: string): Getter => {
  const keys = path.split(".");

  if (keys.length === 1) {
    const [a] = keys;
    return o => (o || EMPTY)[a];
  }

  if (keys.length === 2) {
    const [a, b] = keys;
    return o => ((o || EMPTY)[a] || EMPTY)[b];
  }

  return o => {
    for (let i = 0; i < keys.length; i++) {
      o = (o || EMPTY)[keys[i]];
    }
    return o;
  };
};

const getObjDeepProp = (path: string): Getter => {
  let getter = cache.get(path);

  if (!getter) {
    // Paths built from user input could grow the cache without limit.
    if (cache.size >= MAX_CACHE_SIZE) {
      cache.clear();
    }
    getter = compile(path);
    cache.set(path, getter);
  }

  return getter;
};

export default getObjDeepProp;
