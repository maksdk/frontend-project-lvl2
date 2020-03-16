// @ts-check
import fs from 'fs';
import path from 'path';
import parse from './parsers';
import { compare, stringify } from './engine.js';

const readConfig = (configPath) => {
  const result = fs.readFileSync(configPath, 'utf-8');
  return result;
};

const fixPath = (str) => path.resolve(process.cwd(), str);

const getExtension = (filename) => {
  const ext = path.extname(filename).split('.');
  return ext[ext.length - 1];
};

export default (firstConfig, secondConfig) => {
  const ext1 = getExtension(firstConfig);
  const config1 = parse(readConfig(fixPath(firstConfig)), ext1);

  const ext2 = getExtension(secondConfig);
  const config2 = parse(readConfig(fixPath(secondConfig)), ext2);

  const differences = compare(config1, config2);
  const stringified = stringify(differences);
  return stringified;
};
