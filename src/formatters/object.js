// @ts-check
import _ from 'lodash';

const defaultIndent = ' '.repeat(4);

const generateIndent = (depth, prefix = '') => {
  const fullMargin = defaultIndent.repeat(depth);
  const splitedMargin = fullMargin.split('');
  splitedMargin.splice(splitedMargin.length - prefix.length, prefix.length, prefix);
  return splitedMargin.join('');
};

const wrapStringifiedDiffs = (diffs, depth) => {
  const joinedDiffs = diffs.join('\n');
  return `{${'\n'}${joinedDiffs}${'\n'}${defaultIndent.repeat(depth - 1)}}`;
};

const stringifyValue = (value, depth = 0) => {
  if (_.isString(value)) return value;
  if (_.isPlainObject(value)) {
    const values = Object.entries(value)
      .map(([k, v]) => `${generateIndent(depth, '')}${k}: ${stringifyValue(v, depth + 1)}`);

    return wrapStringifiedDiffs(values, depth);
  }
  return value;
};

const buildDiffs = (diffs, depth) => {
  const stringifiedDiffs = diffs.map((diff) => {
    const {
      type,
      value,
      key,
      newValue,
      oldValue,
      children,
    } = diff;

    switch (type) {
      case 'complex':
        return `${generateIndent(depth, '  ')}${key}: ${buildDiffs(children, depth + 1)}`;
      case 'changed':
        return `${generateIndent(depth, '+ ')}${key}: ${stringifyValue(newValue, depth + 1)}\n${generateIndent(depth, '- ')}${key}: ${stringifyValue(oldValue, depth + 1)}`;
      case 'added':
        return `${generateIndent(depth, '+ ')}${key}: ${stringifyValue(value, depth + 1)}`;
      case 'deleted':
        return `${generateIndent(depth, '- ')}${key}: ${stringifyValue(value, depth + 1)}`;
      case 'unchanged':
        return `${generateIndent(depth, '  ')}${key}: ${stringifyValue(value, depth + 1)}`;
      default:
        throw new Error(`Such type: ${type} is not supported!`);
    }
  });

  return wrapStringifiedDiffs(stringifiedDiffs, depth);
};

export default (diffs) => buildDiffs(diffs, 1);
