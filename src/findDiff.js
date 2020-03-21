// @ts-check
import _ from 'lodash';

const states = {
  unchanged: 'unchanged',
  new: 'new',
  deleted: 'deleted',
  modified: 'modified',
};

const isObjectsProperty = (obj1, obj2, key) => (
  _.isPlainObject(obj1[key]) && _.isPlainObject(obj2[key])
);

const isModifiedProperty = (obj1, obj2, key) => (
  _.has(obj1, key) && _.has(obj2, key) && !_.isEqual(_.pick(obj1, [key]), _.pick(obj2, [key]))
);

const isDeletedProperty = (obj1, obj2, key) => (
  _.has(obj1, key) && !_.has(obj2, key)
);

const isNewProperty = (obj1, obj2, key) => (
  !_.has(obj1, key) && _.has(obj2, key)
);

const isUnchangedProperty = (obj1, obj2, key) => (
  _.isEqual(_.pick(obj1, [key]), _.pick(obj2, [key]))
);

const generateChildren = (obj) => (
  Object.entries(obj).reduce((acc, [key, value]) => {
    if (_.isPlainObject(value)) {
      return [...acc, { key, children: generateChildren(value) }];
    }
    return [...acc, { key, value }];
  }, [])
);

const generateSimpleProperty = (value, key, state) => {
  if (_.isPlainObject(value)) {
    return { state, key, children: generateChildren(value) };
  }
  return { state, key, value };
};

const generateModifiedProperty = (obj1, obj2, key) => {
  const oldValue = obj1[key];
  const newValue = obj2[key];

  if (_.isPlainObject(oldValue) && _.isPlainObject(newValue)) {
    return {
      state: states.modified,
      key,
      children: generateChildren(newValue),
      oldValue: generateChildren(oldValue),
    };
  }

  if (_.isPlainObject(oldValue)) {
    return {
      state: states.modified,
      key,
      value: newValue,
      oldValue: generateChildren(oldValue),
    };
  }

  if (_.isPlainObject(newValue)) {
    return {
      state: states.modified,
      key,
      children: generateChildren(newValue),
      oldValue,
    };
  }

  return {
    state: states.modified,
    value: newValue,
    key,
    oldValue,
  };
};

const findDiff = (obj1, obj2) => {
  const mergedObjs = { ...obj1, ...obj2 };

  return Object.entries(mergedObjs).reduce((acc, [key, value]) => {
    if (isObjectsProperty(obj1, obj2, key)) {
      return [...acc, { state: states.unchanged, key, children: findDiff(obj1[key], obj2[key]) }];
    }

    if (isUnchangedProperty(obj1, obj2, key)) {
      return [...acc, generateSimpleProperty(value, key, states.unchanged)];
    }

    if (isModifiedProperty(obj1, obj2, key)) {
      return [...acc, generateModifiedProperty(obj1, obj2, key)];
    }

    if (isDeletedProperty(obj1, obj2, key)) {
      return [...acc, generateSimpleProperty(value, key, states.deleted)];
    }

    if (isNewProperty(obj1, obj2, key)) {
      return [...acc, generateSimpleProperty(value, key, states.new)];
    }

    throw new Error('Such state is not registered!');
  }, []);
};

export default findDiff;
