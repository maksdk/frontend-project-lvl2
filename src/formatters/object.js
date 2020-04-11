// @ts-check
import _ from 'lodash';

const defaultMargin = ' '.repeat(4);
const lineBreaker = '\n';

const generateMargin = (depth, margin, prefix = '') => {
  const fullMargin = margin.repeat(depth);
  const splitedMargin = fullMargin.split('');
  splitedMargin.splice(splitedMargin.length - prefix.length, prefix.length, prefix);
  return splitedMargin.join('');
};

const wrapStringifiedDiffs = (diffs, depth) => {
  const joinedDiffs = diffs.join(lineBreaker);
  return `{${lineBreaker}${joinedDiffs}${lineBreaker}${defaultMargin.repeat(depth - 1)}}`;
};

const stringifyValue = (value, depth = 0) => {
  if (_.isString(value)) return value;
  if (_.isPlainObject(value)) {
    const values = Object.entries(value)
      .map(([k, v]) => `${generateMargin(depth, defaultMargin, '')}${k}: ${stringifyValue(v, depth + 1)}`);

    return wrapStringifiedDiffs(values, depth);
  }
  return value;
};

const getPrefixFromType = (type) => {
  switch (type) {
    case 'added':
      return '+ ';
    case 'deleted':
      return '- ';
    case 'complex':
    case 'changed':
    case 'unchanged':
      return '  ';
    default:
      throw new Error(`Such type: ${type} is not supported!`);
  }
};

const stringifyComplexDiff = (diff, depth, formDiffs) => {
  const { key, children } = diff;
  const prefix = getPrefixFromType('complex');
  const margin = generateMargin(depth, defaultMargin, prefix);
  return [
    `${margin}${key}: ${formDiffs(children, depth + 1)}`];
};

const stringifyChangedDiff = (diff, depth) => {
  const { key, value, oldValue } = diff;
  const prefix1 = getPrefixFromType('added');
  const prefix2 = getPrefixFromType('deleted');
  const margin1 = generateMargin(depth, defaultMargin, prefix1);
  const margin2 = generateMargin(depth, defaultMargin, prefix2);
  return [
    `${margin1}${key}: ${stringifyValue(value, depth + 1)}`,
    `${margin2}${key}: ${stringifyValue(oldValue, depth + 1)}`];
};

const stringifyDiff = (diff, depth) => {
  const { type, key, value } = diff;
  const prefix = getPrefixFromType(type);
  const margin = generateMargin(depth, defaultMargin, prefix);
  return [
    `${margin}${key}: ${stringifyValue(value, depth + 1)}`];
};

const formDiffs = (diffs, depth) => {
  const stringifiedDiffs = diffs.map((diff) => {
    const { type } = diff;

    switch (type) {
      case 'complex':
        return stringifyComplexDiff(diff, depth, formDiffs);
      case 'changed':
        return stringifyChangedDiff(diff, depth);
      case 'added':
      case 'deleted':
      case 'unchanged':
        return stringifyDiff(diff, depth);
      default:
        throw new Error(`Such type: ${type} is not supported!`);
    }
  }, []).flat();

  return wrapStringifiedDiffs(stringifiedDiffs, depth);
};

export default (diffs) => formDiffs(diffs, 1);
