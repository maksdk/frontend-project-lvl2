// @ts-check
import _ from 'lodash';

const defaultMargin = ' '.repeat(4);
const lineBreaker = '\n';

const supportedTypes = ['added', 'deleted', 'changed', 'unchanged', 'complex'];

const prefixes = {
  added: '+ ',
  deleted: '- ',
  default: '  ',
};

const generateMargin = (depth, margin, prefix = '') => {
  const fullMargin = margin.repeat(depth);
  const splitedMargin = fullMargin.split('');
  splitedMargin.splice(splitedMargin.length - prefix.length, prefix.length, prefix);
  return splitedMargin.join('');
};

const wrapValues = (values, depth) => {
  const joinedValues = values.join(lineBreaker);
  return `{${lineBreaker}${joinedValues}${lineBreaker}${defaultMargin.repeat(depth - 1)}}`;
};

const stringifyValue = (value, depth = 0) => {
  if (_.isString(value)) return value;
  if (_.isPlainObject(value)) {
    const values = Object.entries(value)
      .map(([k, v]) => `${generateMargin(depth, defaultMargin, '')}${k}: ${stringifyValue(v, depth + 1)}`);

    return wrapValues(values, depth);
  }
  return value;
};

const stringifiedGenerators = {
  complex: (diff, depth, stringifyDiffs) => {
    const { key, children } = diff;
    const prefix = prefixes.default;
    const margin = generateMargin(depth, defaultMargin, prefix);
    return [
      `${margin}${key}: ${stringifyDiffs(children, depth + 1)}`];
  },

  changed: (diff, depth) => {
    const { key, value, oldValue } = diff;
    const prefix1 = prefixes.added;
    const prefix2 = prefixes.deleted;
    const margin1 = generateMargin(depth, defaultMargin, prefix1);
    const margin2 = generateMargin(depth, defaultMargin, prefix2);
    return [
      `${margin1}${key}: ${stringifyValue(value, depth + 1)}`,
      `${margin2}${key}: ${stringifyValue(oldValue, depth + 1)}`];
  },

  default: (diff, depth) => {
    const { type, key, value } = diff;
    const prefix = prefixes[type] || prefixes.default;
    const margin = generateMargin(depth, defaultMargin, prefix);
    return [
      `${margin}${key}: ${stringifyValue(value, depth + 1)}`];
  },
};

const stringifyDifferences = (differences, depth) => {
  const values = differences.reduce((acc, diff) => {
    const { type } = diff;

    if (!supportedTypes.includes(type)) {
      throw new Error(`Such type: ${type} is not supported!`);
    }

    const generate = stringifiedGenerators[type] || stringifiedGenerators.default;

    return [...acc, ...generate(diff, depth, stringifyDifferences)];
  }, []);

  return wrapValues(values, depth);
};

export default (differences) => {
  if (differences.length === 0) return '{}';

  return stringifyDifferences(differences, 1);
};
