// @ts-check
import _ from 'lodash';

const generateDifferences = (obj1, obj2) => {
  const keys = _.union(_.keys(obj1), _.keys(obj2));

  return keys.map((key) => {
    if (_.has(obj1, key) && !_.has(obj2, key)) {
      return { value: obj1[key], key, type: 'deleted' };
    }

    if (!_.has(obj1, key) && _.has(obj2, key)) {
      return { value: obj2[key], key, type: 'added' };
    }

    if (_.isPlainObject(obj1[key]) && _.isPlainObject(obj2[key])) {
      return {
        key,
        type: 'complex',
        children: generateDifferences(obj1[key], obj2[key]),
      };
    }

    if (obj1[key] === obj2[key]) {
      return { value: obj1[key], key, type: 'unchanged' };
    }

    if (obj1[key] !== obj2[key]) {
      return {
        key,
        newValue: obj2[key],
        oldValue: obj1[key],
        type: 'changed',
      };
    }

    throw new Error(`Failed to detect the type of difference between two configs.
      Config 1: ${obj1 ? JSON.stringify(obj1) : `"${obj1}"`}
      Config 2: ${obj2 ? JSON.stringify(obj2) : `"${obj2}"`}`);
  });
};

export default generateDifferences;
