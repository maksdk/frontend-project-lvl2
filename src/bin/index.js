#!/usr/bin/env node

// @ts-check
import fs from 'fs';
import path from 'path';
import { program } from 'commander';
import generate from '../main';
import parse from '../parsers';
// @ts-ignore
import packageConfig from '../../package.json';

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
    const config1 = parse(readConfig(fixPath(firstConfig)), ext1);

    const ext2 = path.extname(secondConfig);
    const config2 = parse(readConfig(fixPath(secondConfig)), ext2);

    console.log(generate(config1, config2));
  });

program.parse(process.argv);
