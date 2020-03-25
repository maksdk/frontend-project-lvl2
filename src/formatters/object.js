// @ts-check
import _ from 'lodash';

const defaultMargin = ' '.repeat(3);

const generateMargin = (depth, margin, prefix = '') => {
  const fullMargin = margin.repeat(depth);
  const splitedMargin = fullMargin.split('');
  splitedMargin.splice(splitedMargin.length - prefix.length, prefix.length, prefix);
  return splitedMargin.join('');
};

const wrapValues = (values, depth) => {
  const joinedValues = values.join('\n');
  return `{\n${joinedValues}\n${defaultMargin.repeat(depth - 1)}}`;
};

const stringifyValue = (value, depth = 0) => {
  if (_.isBoolean(value)) return value;
  if (_.isNull(value)) return value;
  if (_.isNumber(value)) return value;
  if (_.isString(value)) return `'${value}'`;
  if (_.isPlainObject(value)) {
    const values = Object.entries(value)
      .map(([k, v]) => `${generateMargin(depth, defaultMargin, '')}${k}: ${stringifyValue(v, depth + 1)}`);

    return wrapValues(values, depth);
  }
  throw new Error(`Such value type: ${value} is not supported!`);
};

const stringifyDifferences = (differences, depth) => {
  const values = differences.reduce((acc, diff) => {
    const {
      state,
      children,
      key,
      value,
      oldValue,
    } = diff;

    if (children) {
      const prefix = '  ';
      const margin = generateMargin(depth, defaultMargin, prefix);
      return [...acc, `${margin}${key}: ${stringifyDifferences(children, depth + 1)}`];
    }

    if (state === 'added') {
      const prefix = '+ ';
      const margin = generateMargin(depth, defaultMargin, prefix);
      return [...acc, `${margin}${key}: ${stringifyValue(value, depth + 1)}`];
    }

    if (state === 'deleted') {
      const prefix = '- ';
      const margin = generateMargin(depth, defaultMargin, prefix);
      return [...acc, `${margin}${key}: ${stringifyValue(value, depth + 1)}`];
    }

    if (state === 'changed') {
      const prefix1 = '+ ';
      const prefix2 = '- ';
      const margin1 = generateMargin(depth, defaultMargin, prefix1);
      const margin2 = generateMargin(depth, defaultMargin, prefix2);
      return [
        ...acc,
        `${margin1}${key}: ${stringifyValue(value, depth + 1)}`,
        `${margin2}${key}: ${stringifyValue(oldValue, depth + 1)}`];
    }

    if (state === 'unchanged') {
      const prefix = '  ';
      const margin = generateMargin(depth, defaultMargin, prefix);
      return [...acc, `${margin}${key}: ${stringifyValue(value, depth + 1)}`];
    }

    throw new Error(`Such state: ${state} is not registered!`);
  }, []);

  return wrapValues(values, depth);
};

export default (differences) => {
  if (differences.length === 0) return '{}';
  return stringifyDifferences(differences, 1);
};
