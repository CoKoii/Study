import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import * as _ from 'lodash';
const YAML_CONFIG_COMMON_FILENAME = 'config.yaml';
const filePath = join(process.cwd(), 'src/config', YAML_CONFIG_COMMON_FILENAME);
const envPath = join(
  process.cwd(),
  'src/config',
  `config.${process.env.NODE_ENV || 'development'}.yaml`,
);
const commonConfig = yaml.load(readFileSync(filePath, 'utf8'));
const envConfig = yaml.load(readFileSync(envPath, 'utf8'));
export default () => {
  return _.merge(commonConfig, envConfig);
};
