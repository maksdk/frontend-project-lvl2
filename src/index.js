// @ts-check
import { program } from 'commander';
// @ts-ignore
import packageConfig from '../package.json';

const { version } = packageConfig;

program
  .version(version)
  .description('Compares two configuration files and shows a difference.');

const run = () => {
  program.parse(process.argv);
};

export default run;
