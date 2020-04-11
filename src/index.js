// @ts-check
import fs from 'fs';
import path from 'path';
import parse from './parsers';
import generateDifferences from './generateDifferences';
import formDifferences from './formatters';

const getExtension = (filename) => path.extname(filename).slice(1);

const getFilePath = (filename) => path.resolve(process.cwd(), filename);
const readFile = (filename) => fs.readFileSync(getFilePath(filename), 'utf-8');

export default (path1, path2, format) => {
  const config1 = readFile(path1);
  const config2 = readFile(path2);

  const extention1 = getExtension(path1);
  const extention2 = getExtension(path2);

  const parsedConfig1 = parse(config1, extention1);
  const parsedConfig2 = parse(config2, extention2);

  const differences = generateDifferences(parsedConfig1, parsedConfig2);
  const formedResult = formDifferences(differences, format);

  return formedResult;
};
