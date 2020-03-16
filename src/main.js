// @ts-check
import fs from 'fs';
import path from 'path';
import { compare, stringify } from './engine.js';

const readConfig = (configPath) => {
  const result = fs.readFileSync(configPath, 'utf-8');
  return result;
};

const fixPath = (str) => path.resolve(process.cwd(), str);

export default (firstConfig, secondConfig) => {
  const config1 = readConfig(fixPath(firstConfig));
  const parsedConfig1 = JSON.parse(config1);

  const config2 = readConfig(fixPath(secondConfig));
  const parsedConfig2 = JSON.parse(config2);

  const differences = compare(parsedConfig1, parsedConfig2);
  const stringified = stringify(differences);
  return stringified;
};
