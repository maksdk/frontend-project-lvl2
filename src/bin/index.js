#!/usr/bin/env node

// @ts-check
import fs from 'fs';
import path from 'path';
import { program } from 'commander';
import generate from '../main';
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
    const config1 = readConfig(fixPath(firstConfig));
    const parsedConfig1 = JSON.parse(config1);

    const config2 = readConfig(fixPath(secondConfig));
    const parsedConfig2 = JSON.parse(config2);

    console.log(generate(parsedConfig1, parsedConfig2));
  });

program.parse(process.argv);
