import { readFileSync } from 'fs';
import { join } from 'path';
import { load } from 'js-yaml';
import _ from 'lodash';

export default function configuration(): Record<string, any> {
  return _.merge(
    load(
      readFileSync(
        join(
          __dirname,
          `../config/config.${process.env.NODE_ENV || 'development'}.yaml`,
        ),
        'utf8',
      ),
    ) as Record<string, any>,
    load(
      readFileSync(join(__dirname, '../config/config.yaml'), 'utf8'),
    ) as Record<string, any>,
  );
}
