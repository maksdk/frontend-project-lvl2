// @ts-check
import _ from 'lodash';

const isObjectsProperty = (obj1, obj2, key) => (
  _.isPlainObject(obj1[key]) && _.isPlainObject(obj2[key])
);

const isChangedProperty = (obj1, obj2, key) => (
  _.has(obj1, key) && _.has(obj2, key) && !_.isEqual(_.pick(obj1, [key]), _.pick(obj2, [key]))
);

const isDeletedProperty = (obj1, obj2, key) => (
  _.has(obj1, key) && !_.has(obj2, key)
);

const isAddedProperty = (obj1, obj2, key) => (
  !_.has(obj1, key) && _.has(obj2, key)
);

const isUnchangedProperty = (obj1, obj2, key) => (
  _.isEqual(_.pick(obj1, [key]), _.pick(obj2, [key]))
);

const generateDifferences = (obj1, obj2) => {
  const keys = _.union(_.keys(obj1), _.keys(obj2));

  return keys.map((key) => {
    if (isObjectsProperty(obj1, obj2, key)) {
      return {
        key,
        type: 'complex',
        children: generateDifferences(obj1[key], obj2[key]),
      };
    }

    if (isUnchangedProperty(obj1, obj2, key)) {
      return { value: obj1[key], key, type: 'unchanged' };
    }

    if (isChangedProperty(obj1, obj2, key)) {
      return {
        key,
        value: obj2[key],
        oldValue: obj1[key],
        type: 'changed',
      };
    }

    if (isDeletedProperty(obj1, obj2, key)) {
      return { value: obj1[key], key, type: 'deleted' };
    }

    if (isAddedProperty(obj1, obj2, key)) {
      return { value: obj2[key], key, type: 'added' };
    }

    throw new Error('Unrecognized type of the difference');
  }, []);
};

export default generateDifferences;
