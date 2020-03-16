#!/usr/bin/env node

// @ts-check
import { program } from 'commander';
import generate from '../main';
// @ts-ignore
import packageConfig from '../../package.json';

const { version } = packageConfig;

program
  .version(version)
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig) => {
    console.log(generate(firstConfig, secondConfig));
  });

program.parse(process.argv);
