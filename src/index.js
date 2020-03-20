// @ts-check
import fs from 'fs';
import path from 'path';
import parse from './parsers';
import findDiff from './findDiff.js';
import formDiff from './formatters/index';

const readConfig = (configPath) => {
  const result = fs.readFileSync(configPath, 'utf-8');
  return result;
};

const fixPath = (str) => path.resolve(process.cwd(), str);

const getExtension = (filename) => {
  const ext = path.extname(filename).split('.');
  return ext[ext.length - 1];
};

export default (firstConfig, secondConfig, format) => {
  const ext1 = getExtension(firstConfig);
  const config1 = parse(readConfig(fixPath(firstConfig)), ext1);

  const ext2 = getExtension(secondConfig);
  const config2 = parse(readConfig(fixPath(secondConfig)), ext2);

  const differences = findDiff(config1, config2);
  const stringified = formDiff(differences, format);
  return stringified;
};
