import {EggAppConfig, EggAppInfo, PowerPartial, Context} from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1600267225610_2696';

  // add your egg config in here
  config.middleware = [];

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
    middleware: ['inspectBody'],
    security: {
      csrf: {
        enable: false // 关闭框架默认得csrf插件
      }
    },
    onerror: {
      json(err, ctx: Context) {
        ctx.logger.error('json 错误', new Error(err));
        ctx.body = {
          message: 'message'
        };
        ctx.status = 500;
      },
      html(err, ctx: Context) {
        ctx.logger.error('html 错误', new Error(err));
        ctx.body = '<h3>error</h3>';
        ctx.status = 500;
      },
      text(err, ctx: Context) {
        ctx.logger.error('text 错误', new Error(err));
        ctx.body = '内部错误';
        ctx.status = 500;
      }
    }
  };
};
