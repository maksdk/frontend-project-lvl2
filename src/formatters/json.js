// @ts-check
import _ from 'lodash';

const supportedTypes = ['added', 'deleted', 'changed', 'unchanged', 'complex'];

const stringifyValue = (value) => {
  if (_.isString(value)) return `"${value}"`;
  if (_.isPlainObject(value)) {
    return `{${Object.entries(value)
      .map(([key, val]) => `"${key}":${stringifyValue(val)}`)
      .join(',')}}`;
  }
  return value;
};

const stringifiedGenerators = {
  complex: ({ children, key }, stringifyDiffs) => (
    `{"type":"complex","key":"${key}","children":${stringifyDiffs(children)}}`
  ),
  changed: ({ key, value, oldValue }) => (
    `{"type":"changed","key":"${key}","value":${stringifyValue(value)},"oldValue":${stringifyValue(oldValue)}}`
  ),
  default: ({ type, key, value }) => (
    `{"type":"${type}","key":"${key}","value":${stringifyValue(value)}}`
  ),
};

const stringify = (differences) => {
  const result = differences.map((diff) => {
    const { type } = diff;

    if (!supportedTypes.includes(type)) {
      throw new Error(`Such type: ${type} is not supported!`);
    }

    const generate = stringifiedGenerators[type] || stringifiedGenerators.default;

    return generate(diff, stringify);
  });
  return `[${result.join(',')}]`;
};

const pretyfyJson = (json) => JSON.stringify(JSON.parse(json), null, 2);

export default (differences) => {
  const stringifiedDiffs = stringify(differences);
  return pretyfyJson(stringifiedDiffs);
};
