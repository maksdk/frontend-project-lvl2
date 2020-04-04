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
  const mergedObjs = { ...obj1, ...obj2 };

  return Object.entries(mergedObjs).reduce((acc, [key, value]) => {
    if (isObjectsProperty(obj1, obj2, key)) {
      return [
        ...acc,
        {
          key,
          type: 'complex',
          children: generateDifferences(obj1[key], obj2[key]),
        }];
    }

    if (isUnchangedProperty(obj1, obj2, key)) {
      return [...acc, { value, key, type: 'unchanged' }];
    }

    if (isChangedProperty(obj1, obj2, key)) {
      return [...acc, {
        key,
        value,
        oldValue: obj1[key],
        type: 'changed',
      }];
    }

    if (isDeletedProperty(obj1, obj2, key)) {
      return [...acc, { value, key, type: 'deleted' }];
    }

    if (isAddedProperty(obj1, obj2, key)) {
      return [...acc, { value, key, type: 'added' }];
    }

    throw new Error('Unrecognized type of the difference');
  }, []);
};

export default generateDifferences;
