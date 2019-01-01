type SchemaFunction = (data: Object[], schema: Object) => Object[];

const schema: SchemaFunction = (data = [], schema = {}) => {
  const indexes: number[] = [];
  let deleteFields: string[] = [];

  data.map((item, index) => {
    Object.keys(schema).forEach((oldFieldName: string) => {

      const newFieldNameArr: string[] = schema[oldFieldName].split(".").reverse();
      const oldFieldNameArr: string[] = oldFieldName.split(".");

      
      let [ parentOldFieldName ] = oldFieldNameArr;
      
      let activeValue: any;
      let activeStep = item;
      
      oldFieldNameArr.forEach((activeOldFieldName) => {
        if (activeStep) {
          activeStep = activeStep[activeOldFieldName];
          activeValue = activeStep;
        }
      });

      let activeName: string;
      let temp: Object = {};
      
      newFieldNameArr.forEach((activeNewFieldName: string, index: number) => {
      
        let previousNewFieldName = newFieldNameArr[index -1];
        
        if (previousNewFieldName) {
          temp[activeNewFieldName] = {...temp};
          delete temp[previousNewFieldName];
        } else {
          temp[activeNewFieldName] = activeValue;
        }

        activeName = activeNewFieldName;
      
      });
      
      if (item[activeName]) {
        item[activeName] = {...item[activeName], ...temp[activeName]};
      } else {
        item[activeName] = temp[activeName];
      }
      
      deleteFields.push(parentOldFieldName);
    });
    
    deleteFields.forEach(fieldName => {
      delete item[fieldName];
    })


    if (indexes.indexOf(index) === -1) {
      indexes.push(index);
      return item;
    }

  });

  return data;
};

export default schema;
