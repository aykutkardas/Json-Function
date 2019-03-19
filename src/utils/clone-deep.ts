// https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript
function cloneDeep(obj) {
  if (obj === null || typeof (obj) !== 'object' || 'isActiveClone' in obj)
      return obj;

  var temp = obj.constructor();

  for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
          obj['isActiveClone'] = null;
          temp[key] = cloneDeep(obj[key]);
          delete obj['isActiveClone'];
      }
  }
  return temp;
}

export default cloneDeep;