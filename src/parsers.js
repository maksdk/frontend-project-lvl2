// @ts-check
import yaml from 'js-yaml';
import ini from 'ini';

const parsers = {
  json: JSON.parse,
  yaml: yaml.safeLoad,
  ini: ini.parse,
};

const fixNumberTypes = (obj) => {
  const result = Object.entries(obj)
    .reduce((acc, [key, value]) => {
      if (typeof value === 'string' && !Number.isNaN(Number(value))) {
        return { ...acc, [key]: Number(value) };
      }
      return { ...acc, [key]: value };
    }, {});
  return result;
};

export default (config, type) => {
  if (!parsers[type]) {
    throw new Error(`Such file type: '${type}' is not supported.`);
  }

  const parse = parsers[type];
  const parsedResult = parse(config);
  const fixedNumberTypesResult = fixNumberTypes(parsedResult);

  return fixedNumberTypesResult;
};
