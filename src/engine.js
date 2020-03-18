// @ts-check
import _ from 'lodash';

const mapProperiesStates = {
  new: (key, value) => [`+ ${key}: ${value}`],
  modified: (key, value, prevVelue) => [`+ ${key}: ${value}`, `- ${key}: ${prevVelue}`],
  deleted: (key, value) => [`- ${key}: ${value}`],
  old: (key, value) => [`  ${key}: ${value}`],
};

const isOldProperty = (obj1, obj2, key) => (
  _.isEqual(_.pick(obj1, [key]), _.pick(obj2, [key]))
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

const compare = (firstConfig, secondConfig) => {
  const mergedConfigs = { ...firstConfig, ...secondConfig };

  return Object.entries(mergedConfigs).reduce((acc, [key, value]) => {
    if (isOldProperty(firstConfig, secondConfig, key)) {
      return [...acc, { state: 'old', key, value }];
    }

    if (isModifiedProperty(firstConfig, secondConfig, key)) {
      return [...acc, {
        state: 'modified', key, value, prevValue: firstConfig[key],
      }];
    }

    if (isDeletedProperty(firstConfig, secondConfig, key)) {
      return [...acc, { state: 'deleted', key, value }];
    }

    if (isNewProperty(firstConfig, secondConfig, key)) {
      return [...acc, { state: 'new', key, value }];
    }

    throw new Error('Such state is not registered!');
  }, []);
};

const stringify = (differences) => {
  const stringifiedDiffs = differences
    .reduce((acc, diff) => {
      const {
        state,
        key,
        value,
        prevValue,
      } = diff;

      const result = mapProperiesStates[state](key, value, prevValue);

      return [...acc, ...result];
    }, [])
    .map((val) => `  ${val}`)
    .join('\n');

  return `{\n${stringifiedDiffs}\n}`;
};

export { compare, stringify };
