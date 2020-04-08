// @ts-check
import fs from 'fs';
import path from 'path';
import parse from './parsers';
import generateDifferences from './generateDifferences';
import formDifferences from './formatters';

const getExtension = (filename) => {
  const ext = path.extname(filename).split('.');
  return ext[ext.length - 1];
};

const getFilePath = (filename) => path.resolve(process.cwd(), filename);
const readFile = (filename) => fs.readFileSync(getFilePath(filename), 'utf-8');

export default (path1, path2, format) => {
  const file1 = readFile(path1);
  const file2 = readFile(path2);

  const extention1 = getExtension(path1);
  const extention2 = getExtension(path2);

  const config1 = parse(file1, extention1);
  const config2 = parse(file2, extention2);

  const differences = generateDifferences(config1, config2);
  const formedResult = formDifferences(differences, format);

  return formedResult;
};
