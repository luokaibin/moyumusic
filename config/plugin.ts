require('module-alias/register');
import {EggPlugin} from 'egg';
import {join} from 'path';

const plugin: EggPlugin = {
  // static: true,
  // nunjucks: {
  //   enable: true,
  //   package: 'egg-view-nunjucks',
  // },
  snowflake: {
    enable: true,
    path: join(__dirname, '../lib/egg-snowflake')
  },
  sequelize: {
    enable: true,
    package: 'egg-sequelize'
  },
  redis: {
    enable: true,
    package: 'egg-redis'
  }
};

export default plugin;
