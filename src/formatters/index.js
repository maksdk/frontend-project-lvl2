// @ts-check
import formToObject from './object';
import formToPlain from './plain';
import fromToJson from './json';

const mapTypes = {
  object: formToObject,
  plain: formToPlain,
  json: fromToJson,
};

export default (diffs, type) => {
  if (!mapTypes[type]) {
    throw new Error(`Such formatter type: '${type}' is not supported!`);
  }

  return mapTypes[type](diffs);
};
