// @ts-check
import _ from 'lodash';

const stringifyValue = (value) => {
  if (_.isString(value)) return `'${value}'`;
  if (_.isObject(value)) return '[complex value]';
  return value;
};

const formDiffs = (diffs) => {
  const iter = (diff, diffsAcc, keysAcc) => {
    const {
      type,
      value,
      oldValue,
      newValue,
      children,
      key,
    } = diff;

    const keys = [...keysAcc, key];

    switch (type) {
      case 'changed':
        return [...diffsAcc,
          `Property '${keys.join('.')}' was changed from ${stringifyValue(oldValue)} to ${stringifyValue(newValue)}`];
      case 'deleted':
        return [...diffsAcc, `Property '${keys.join('.')}' was deleted`];
      case 'added':
        return [...diffsAcc, `Property '${keys.join('.')}' was added with value: ${stringifyValue(value)}`];
      case 'complex':
        return children.reduce((acc, child) => iter(child, acc, keys), diffsAcc);
      case 'unchanged':
        return diffsAcc;
      default:
        throw new Error(`Such type: ${type} is not supported!`);
    }
  };

  return diffs.reduce((diffsAcc, diff) => iter(diff, diffsAcc, []), []).join('\n');
};

export default (diffs) => formDiffs(diffs);
