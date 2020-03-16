#!/usr/bin/env node

// @ts-check
import jsYaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import { program } from 'commander';
import generate from '../main';
// @ts-ignore
import packageConfig from '../../package.json';

const parsers = {
  json: JSON.parse,
  yaml: jsYaml.safeLoad,
};

const { version } = packageConfig;

const readConfig = (configPath) => {
  const result = fs.readFileSync(configPath, 'utf-8');
  return result;
};

const fixPath = (str) => path.resolve(process.cwd(), str);

program
  .version(version)
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig) => {
    const ext1 = path.extname(firstConfig);
    const parse1 = parsers[ext1];
    const config1 = parse1(readConfig(fixPath(firstConfig)));

    const ext2 = path.extname(secondConfig);
    const parse2 = parsers[ext2];
    const config2 = parse2(readConfig(fixPath(secondConfig)));

    console.log(generate(config1, config2));
  });

program.parse(process.argv);
