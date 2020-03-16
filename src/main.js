// @ts-check
import jsYaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import { compare, stringify } from './engine.js';

const parsers = {
  json: JSON.parse,
  yaml: jsYaml.safeLoad,
};

const readConfig = (configPath) => {
  const result = fs.readFileSync(configPath, 'utf-8');
  return result;
};

const fixPath = (str) => path.resolve(process.cwd(), str);

export default (firstConfig, secondConfig) => {
  const ext1 = path.extname(firstConfig);
  const parse1 = parsers[ext1];
  const config1 = parse1(readConfig(fixPath(firstConfig)));

  const ext2 = path.extname(secondConfig);
  const parse2 = parsers[ext2];
  const config2 = parse2(readConfig(fixPath(secondConfig)));

  const differences = compare(config1, config2);
  const stringified = stringify(differences);
  return stringified;
};
