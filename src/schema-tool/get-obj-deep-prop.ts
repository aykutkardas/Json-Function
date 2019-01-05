type GetObjDeepPropFunction = (obj: Object, props: string, defaultValue?: any) => any;

const getObjDeepProp: GetObjDeepPropFunction = (obj, props, defaultValue) => {
  if (!obj) return false;
  if (typeof obj !== 'object') return false;
  if (!props) return obj;
  if (typeof props !== 'string') return false;

  const propsArr = props.split('.');
  let rootObj: any = obj;

  propsArr.forEach((prop) => {
    if (typeof rootObj[prop] !== 'undefined' || rootObj[prop] !== null || !isNaN(rootObj[prop])) {
      rootObj = rootObj[prop];
    } else {
      rootObj = false;
    }
  });

  return rootObj !== false ? rootObj : defaultValue || false;
};

export default getObjDeepProp;
