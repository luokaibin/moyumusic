import {EggAppConfig, PowerPartial} from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};
  return {
    ...config,
    sequelize: {
      dialect: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      database: 'moyu_music',
      username: 'username',
      password: 'username'
    }
  };
};
