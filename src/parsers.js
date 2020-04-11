// @ts-check
import _ from 'lodash';
import yaml from 'js-yaml';
import ini from 'ini';

const isStringyfiedNumber = (value) => _.isString(value) && !Number.isNaN(Number(value));

const convertNumbers = (obj) => (
  Object.entries(obj)
    .reduce((acc, [key, value]) => {
      if (_.isPlainObject(value)) {
        return { ...acc, [key]: convertNumbers(value) };
      }

      if (isStringyfiedNumber(value)) {
        return { ...acc, [key]: Number(value) };
      }

      return { ...acc, [key]: value };
    }, {})
);

const parsers = {
  json: JSON.parse,
  yaml: yaml.safeLoad,
  ini: (config) => {
    const parsedResult = ini.parse(config);
    const convertedResult = convertNumbers(parsedResult);
    return convertedResult;
  },
};

export default (config, type) => {
  if (!parsers[type]) {
    throw new Error(`Such config type: '${type}' is not supported.`);
  }

  const parse = parsers[type];
  const result = parse(config);

  return result;
};
