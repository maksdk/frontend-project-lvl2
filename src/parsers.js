// @ts-check
import _ from 'lodash';
import yaml from 'js-yaml';
import ini from 'ini';

const parsers = {
  json: JSON.parse,
  yaml: yaml.safeLoad,
  ini: ini.parse,
};

const isStringyfiedNumber = (value) => !Number.isNaN(Number(value));

const fixNumberTypes = (obj) => (
  Object.entries(obj)
    .reduce((acc, [key, value]) => {
      if (_.isPlainObject(value)) {
        return { ...acc, [key]: fixNumberTypes(value) };
      }

      if (typeof value === 'string' && isStringyfiedNumber(value)) {
        return { ...acc, [key]: Number(value) };
      }

      return { ...acc, [key]: value };
    }, {})
);

export default (config, type) => {
  if (!parsers[type]) {
    throw new Error(`Such file type: '${type}' is not supported.`);
  }

  const parse = parsers[type];
  const parsedResult = parse(config);
  const fixedNumberTypesResult = fixNumberTypes(parsedResult);

  return fixedNumberTypesResult;
};
