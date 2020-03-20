// @ts-check
import formToObject from './object';
import formToPlain from './plain';

const mapTypes = {
  object: formToObject,
  plain: formToPlain,
};

export default (diffs, type) => {
  if (!mapTypes[type]) {
    throw new Error(`Such formatter type: '${type}' is not registered!`);
  }

  return mapTypes[type](diffs);
};
