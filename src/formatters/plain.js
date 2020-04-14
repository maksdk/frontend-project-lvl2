// @ts-check
import _ from 'lodash';

const stringifyValue = (value) => {
  if (_.isString(value)) return `'${value}'`;
  if (_.isObject(value)) return '[complex value]';
  return value;
};

const stringifyDiff = (diff) => {
  const {
    type,
    value,
    oldValue,
    newValue,
    keys,
  } = diff;

  switch (type) {
    case 'changed':
      return `Property '${keys.join('.')}' was changed from ${stringifyValue(oldValue)} to ${stringifyValue(newValue)}`;
    case 'deleted':
      return `Property '${keys.join('.')}' was deleted`;
    case 'added':
      return `Property '${keys.join('.')}' was added with value: ${stringifyValue(value)}`;
    case 'complex':
    case 'unchanged':
      return '';
    default:
      throw new Error(`Such type: ${type} is not supported!`);
  }
};

const stringifyDiffs = (diffs) => {
  const iter = (diff, diffsAcc, keysAcc) => {
    const { children, key, type } = diff;

    if (type === 'unchanged') return diffsAcc;

    const newKeysAcc = [...keysAcc, key];

    if (children) {
      return children.reduce((acc, child) => iter(child, acc, newKeysAcc), diffsAcc);
    }

    return [...diffsAcc, stringifyDiff({ ...diff, keys: newKeysAcc })];
  };

  return diffs.reduce((diffsAcc, diff) => iter(diff, diffsAcc, []), []).join('\n');
};

export default (diffs) => stringifyDiffs(diffs);
