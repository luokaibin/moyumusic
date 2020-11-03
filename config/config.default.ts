import {EggAppConfig, EggAppInfo, PowerPartial, Context} from 'egg';
import {sms} from 'tencentcloud-sdk-nodejs';

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
  // 生成腾讯云 sms 客户端实例配置
  const clientConfig = {
    credential: {
      secretId: 'secretId',
      secretKey: 'secretKey'
    },
    region: '',
    profile: {
      httpProfile: {
        endpoint: 'sms.tencentcloudapi.com'
      }
    }
  };
  // 发送短信相关配置
  const SMSCONFIG = {
    QN_TemplateId: 'QN_TemplateId',
    QN_Host: 'https://sms.qiniuapi.com',
    /** 腾讯云短信 SDKAppId */
    TEN_SMSSDKAppId: 'TEN_SMSSDKAppId',
    /** 腾讯云短信模版ID */
    TEN_Template: 'TEN_Template',
    /** 腾讯云短信签名名称 */
    TEN_Sign: 'TEN_Sign'
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
    TENSMSClient: new sms.v20190711.Client(clientConfig),
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
    },
    SMSCONFIG,
    redis: {
      client: {
        port: 6666,
        host: '127.0.0.1',
        password: 'password',
        db: 0
      }
    }
  };
};
