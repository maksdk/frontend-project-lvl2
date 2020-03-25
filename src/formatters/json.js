// @ts-check
import _ from 'lodash';

const stringifyValue = (value) => {
  if (_.isBoolean(value)) return value;
  if (_.isNull(value)) return value;
  if (_.isNumber(value)) return value;
  if (_.isString(value)) return `"${value}"`;
  if (_.isPlainObject(value)) {
    return `{${Object.entries(value)
      .map(([key, val]) => `"${key}":${stringifyValue(val)}`)
      .join(',')}}`;
  }
  throw new Error(`Such value type: ${value} is not supported!`);
};

const mapStringifiedGenerators = {
  added: (key, value) => `{"state":"added","key":"${key}","value":${stringifyValue(value)}}`,
  deleted: (key, value) => `{"state":"deleted","key":"${key}","value":${stringifyValue(value)}}`,
  unchanged: (key, value) => `{"state":"unchanged","key":"${key}","value":${stringifyValue(value)}}`,
  changed: (key, value, oldValue) => `{"state":"changed","key":"${key}","value":${stringifyValue(value)},"oldValue":${stringifyValue(oldValue)}}`,
};

const form = (differences) => {
  const result = differences.map((diff) => {
    const {
      key,
      state,
      value,
      oldValue,
      children,
    } = diff;

    if (children) {
      return `{"key":"${key}","children":${form(children)}}`;
    }

    if (!mapStringifiedGenerators[state]) {
      throw new Error(`Such state: ${state} is not registered!`);
    }

    const stringifiedGenerator = mapStringifiedGenerators[state];
    return stringifiedGenerator(key, value, oldValue);
  });
  return `[${result.join(',')}]`;
};

export default form;
