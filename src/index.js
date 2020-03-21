// @ts-check
import fs from 'fs';
import path from 'path';
import parse from './parsers';
import findDiff from './findDiff.js';
import formDiff from './formatters/index';

const readFile = (filePath) => fs.readFileSync(filePath, 'utf-8');

const fixPath = (str) => path.resolve(process.cwd(), str);

const getExtension = (filename) => {
  const ext = path.extname(filename).split('.');
  return ext[ext.length - 1];
};

export default (path1, path2, format) => {
  const extention1 = getExtension(path1);
  const extention2 = getExtension(path2);

  const config1 = parse(readFile(fixPath(path1)), extention1);
  const config2 = parse(readFile(fixPath(path2)), extention2);

  const differences = findDiff(config1, config2);
  const formedDifferences = formDiff(differences, format);

  return formedDifferences;
};
