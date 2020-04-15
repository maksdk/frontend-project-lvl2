// @ts-check
import _ from 'lodash';

const defaultMarginLeft = ' '.repeat(4);

const generateMargin = (depth, prefix = '') => {
  const fullMargin = defaultMarginLeft.repeat(depth);
  const splitedMargin = fullMargin.split('');
  splitedMargin.splice(splitedMargin.length - prefix.length, prefix.length, prefix);
  return splitedMargin.join('');
};

const wrapStringifiedDiffs = (diffs, depth) => {
  const joinedDiffs = diffs.join('\n');
  return `{${'\n'}${joinedDiffs}${'\n'}${defaultMarginLeft.repeat(depth - 1)}}`;
};

const stringifyValue = (value, depth = 0) => {
  if (_.isString(value)) return value;
  if (_.isPlainObject(value)) {
    const values = Object.entries(value)
      .map(([k, v]) => `${generateMargin(depth, '')}${k}: ${stringifyValue(v, depth + 1)}`);

    return wrapStringifiedDiffs(values, depth);
  }
  return value;
};

const formDiffs = (diffs, depth) => {
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
        return [
          `${generateMargin(depth, '  ')}${key}: ${formDiffs(children, depth + 1)}`];
      case 'changed':
        return [
          `${generateMargin(depth, '+ ')}${key}: ${stringifyValue(newValue, depth + 1)}`,
          `${generateMargin(depth, '- ')}${key}: ${stringifyValue(oldValue, depth + 1)}`];
      case 'added':
        return [
          `${generateMargin(depth, '+ ')}${key}: ${stringifyValue(value, depth + 1)}`];
      case 'deleted':
        return [
          `${generateMargin(depth, '- ')}${key}: ${stringifyValue(value, depth + 1)}`];
      case 'unchanged':
        return [
          `${generateMargin(depth, '  ')}${key}: ${stringifyValue(value, depth + 1)}`];
      default:
        throw new Error(`Such type: ${type} is not supported!`);
    }
  }, []).flat();

  return wrapStringifiedDiffs(stringifiedDiffs, depth);
};

export default (diffs) => formDiffs(diffs, 1);
