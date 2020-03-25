// @ts-check
import _ from 'lodash';

const stringifyValue = (value) => {
  if (_.isObject(value)) return '[complex value]';
  if (_.isNumber(value)) return value;
  return `'${value}'`;
};

const mapTexts = {
  changed: (key, newValue, oldValue) => (`Property '${key}' was changed from ${stringifyValue(oldValue)} to ${stringifyValue(newValue)}`),
  deleted: (key) => `Property '${key}' was deleted`,
  added: (key, newValue) => `Property '${key}' was added with value: ${stringifyValue(newValue)}`,
};

const removeUnchangedProperties = (differences) => (
  differences.reduce((acc, diff) => {
    const { children, state } = diff;

    if (state === 'unchanged') {
      return acc;
    }

    if (Array.isArray(children)) {
      return [...acc, { ...diff, children: removeUnchangedProperties(children) }];
    }

    return [...acc, diff];
  }, [])
);

const generateFlattenFullPaths = (differences) => {
  const iter = (diff, pathAcc, acc) => {
    const { key, children } = diff;
    const newPath = [...pathAcc, key];

    if (Array.isArray(children)) {
      return children.reduce((newAcc, newDiff) => iter(newDiff, newPath, newAcc), acc);
    }

    return [...acc, { ...diff, fullPath: newPath }];
  };

  return differences.reduce((acc, diff) => [...acc, ...iter(diff, [], [])], []);
};

const stringifyDifferences = (differences) => (
  differences.map((diff) => {
    const {
      state,
      value,
      oldValue,
      fullPath,
    } = diff;
    return mapTexts[state](fullPath.join('.'), value, oldValue);
  }).join('\n')
);

export default (differences) => {
  const clearedFromUnchanged = removeUnchangedProperties(differences);
  const flattenFullPaths = generateFlattenFullPaths(clearedFromUnchanged);
  const stringifiedDiffs = stringifyDifferences(flattenFullPaths);
  return stringifiedDiffs;
};
