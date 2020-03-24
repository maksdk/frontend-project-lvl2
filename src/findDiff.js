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

const findDiff = (obj1, obj2) => {
  const mergedObjs = { ...obj1, ...obj2 };

  return Object.entries(mergedObjs).reduce((acc, [key, value]) => {
    if (isObjectsProperty(obj1, obj2, key)) {
      return [...acc, { key, children: findDiff(obj1[key], obj2[key]) }];
    }

    if (isUnchangedProperty(obj1, obj2, key)) {
      return [...acc, { value, key, state: 'unchanged' }];
    }

    if (isChangedProperty(obj1, obj2, key)) {
      return [...acc, {
        key,
        value,
        oldValue: obj1[key],
        state: 'changed',
      }];
    }

    if (isDeletedProperty(obj1, obj2, key)) {
      return [...acc, { value, key, state: 'deleted' }];
    }

    if (isAddedProperty(obj1, obj2, key)) {
      return [...acc, { value, key, state: 'added' }];
    }

    throw new Error('Such state is not registered!');
  }, []);
};

export default findDiff;
