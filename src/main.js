// @ts-check
import fs from 'fs';
import path from 'path';
import parse from './parsers';
import generateDifferences from './generateDifferences';
import formDifferences from './formatters';

const readFile = (filePath) => fs.readFileSync(filePath, 'utf-8');

const fixPath = (str) => path.resolve(process.cwd(), str);

const getExtension = (filename) => {
  const ext = path.extname(filename).split('.');
  return ext[ext.length - 1];
};

export default (path1, path2, format) => {
  const extention1 = getExtension(path1);
  const extention2 = getExtension(path2);

  const fixedPath1 = fixPath(path1);
  const fixedPath2 = fixPath(path2);

  const file1 = readFile(fixedPath1);
  const file2 = readFile(fixedPath2);

  const config1 = parse(file1, extention1);
  const config2 = parse(file2, extention2);

  const differences = generateDifferences(config1, config2);
  const formedDifferences = formDifferences(differences, format);

  return formedDifferences;
};
