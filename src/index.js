// @ts-check
import { program } from 'commander';
// @ts-ignore
import packageConfig from '../package.json';

const { version } = packageConfig;

program
  .version(version)
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig) => {
    console.log('firstConfig: ', firstConfig);
    console.log('secondConfig: ', secondConfig);
  });

const run = () => {
  program.parse(process.argv);
};

export default run;
