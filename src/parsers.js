// @ts-check
import jsYaml from 'js-yaml';

const parsers = {
  json: JSON.parse,
  yaml: jsYaml.safeLoad,
};

export default (config, type) => {
  if (!parsers[type]) {
    throw new Error('Such parser type is not registered!');
  }

  const parse = parsers[type];
  return parse(config);
};
