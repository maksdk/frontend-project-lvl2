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
  .option('-f, --format [type]', 'output format', 'object')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig, arg) => {
    const { format } = arg;
    console.log(generate(firstConfig, secondConfig, format));
  });

program.parse(process.argv);
