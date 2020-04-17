// @ts-check
import _ from 'lodash';

const stringifyValue = (value) => {
  if (_.isString(value)) return `'${value}'`;
  if (_.isObject(value)) return '[complex value]';
  return value;
};

const buildDiffs = (diffs, path) => (
  diffs.map((diff) => {
    const {
      type,
      value,
      oldValue,
      newValue,
      children,
      key,
    } = diff;

    const nestedPath = [...path, key];

    switch (type) {
      case 'changed':
        return `Property '${nestedPath.join('.')}' was changed from ${stringifyValue(oldValue)} to ${stringifyValue(newValue)}`;
      case 'deleted':
        return `Property '${nestedPath.join('.')}' was deleted`;
      case 'added':
        return `Property '${nestedPath.join('.')}' was added with value: ${stringifyValue(value)}`;
      case 'unchanged':
        return '';
      case 'complex':
        return buildDiffs(children, nestedPath);
      default:
        throw new Error(`Such type: ${type} is not supported!`);
    }
  }).flat().filter((v) => v !== '')
);

export default (diffs) => {
  const result = buildDiffs(diffs, []);
  return result.join('\n');
};
