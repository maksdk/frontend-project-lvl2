// @ts-check
import _ from 'lodash';

const supportedTypes = ['added', 'deleted', 'changed', 'unchanged', 'complex'];

const stringifyValue = (value) => {
  if (_.isString(value)) return `'${value}'`;
  if (_.isObject(value)) return '[complex value]';
  return value;
};

const mapTextsGenerators = {
  changed: (key, newValue, oldValue) => (
    `Property '${key}' was changed from ${stringifyValue(oldValue)} to ${stringifyValue(newValue)}`
  ),
  deleted: (key) => `Property '${key}' was deleted`,
  added: (key, newValue) => `Property '${key}' was added with value: ${stringifyValue(newValue)}`,
  default: () => '',
};

const removeUnchangedProperties = (differences) => (
  differences.reduce((acc, diff) => {
    const { children, type } = diff;

    if (type === 'unchanged') {
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
      type,
      value,
      oldValue,
      fullPath,
    } = diff;

    if (!supportedTypes.includes(type)) {
      throw new Error(`Such type: ${type} is not supported!`);
    }

    const generate = mapTextsGenerators[type] || mapTextsGenerators.default;
    const joinedFullPath = fullPath.join('.');

    return generate(joinedFullPath, value, oldValue);
  }).join('\n')
);

export default (differences) => {
  const clearedFromUnchanged = removeUnchangedProperties(differences);
  const flattenFullPaths = generateFlattenFullPaths(clearedFromUnchanged);
  const stringifiedDiffs = stringifyDifferences(flattenFullPaths);
  return stringifiedDiffs;
};
