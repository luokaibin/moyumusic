import {ISendSmsMessage} from '@types';
import {ChannelNameMap, phoneReg} from '@const';

export default {
  validate: {
    /** 验证渠道是否合法 */
    async checkChannel(Channel) {
      if (typeof Channel !== 'string') return Promise.reject(new Error('Channel类型不合法'));
      if (!ChannelNameMap[Channel]) return Promise.reject(new Error('不存在这个Channel'));
      return Promise.resolve();
    },
    /** 验证是正整数或可以转成整数 */
    async checkInteger(num, key = 'num') {
      if (!['string', 'number'].includes(typeof num)) Promise.reject(new Error(`1${key}类型不合法`));
      if (typeof num === 'string') {
        const reg = /^[1-9]\d*$/g;
        if (!reg.test(num)) Promise.reject(new Error(`2${key}类型不合法`));
        return Promise.resolve();
      }
      if (!Number.isInteger(num) || num < 1) Promise.reject(new Error(`3${key}需要时正整数`));
      return Promise.resolve();
    },
    /** 验证手机号 */
    async checkPhone(phone) {
      try {
        if (!phoneReg.test(phone)) return Promise.reject(new Error('请传入正确的手机号码'));
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(new Error('请传入正确的手机号码'));
      }
    }
  },
  /** 腾讯发送短信 */
  async _tencentSMS({mobile, parameters}: ISendSmsMessage): Promise<boolean> {
    const {app} = this as any;
    const {SendStatusSet} = await app.config.TENSMSClient.SendSms({
      PhoneNumberSet: [`+86${mobile}`],
      TemplateParamSet: [`${parameters.code}`, parameters.time],
      TemplateID: app.config.SMSCONFIG.TEN_Template,
      Sign: app.config.SMSCONFIG.TEN_Sign,
      SmsSdkAppid: app.config.SMSCONFIG.TEN_SMSSDKAppId
    });
    return SendStatusSet?.every(({Code}) => Code === 'Ok');
  },
  /** 七牛发送短信 */
  async _qiniuSMS({mobile, parameters}: ISendSmsMessage) {
    const {logger, app} = this as any;
    logger.info(app.helper);
    const {data} = await app.httpclient.request(`${app.config.SMSCONFIG.QN_Host}/v1/message`, {
      method: 'POST',
      data: {
        template_id: app.config.SMSCONFIG.QN_TemplateId,
        mobiles: [mobile],
        parameters
      },
      dataType: 'text'
    });
    logger.info(data);
  },
  createRandom(length = 6) {
    return Math.floor((Math.random() + Math.floor(Math.random() * 9 + 1)) * Math.pow(10, length - 1));
  },
  /** 发送短信 */
  async sendMessage(params: ISendSmsMessage) {
    const status = await this._tencentSMS(params);
    if (status) {
      return Promise.resolve('发送成功');
    }
    return Promise.reject(new Error('发送失败'));
  }
};
