import {Service} from 'egg';
import {Prefixs, ExpireTimes} from '@const';
import {IVerifyCode} from '@types';

export default class MessageService extends Service {
  /** 发送验证码 */
  public async sendCode({phone}: IVerifyCode) {
    const {app, ctx} = this;
    try {
      let code;
      code = await app.redis.get(`${Prefixs.redis_code}${phone}`);
      if (code) {
        return Promise.reject(new Error('请不要重复发送验证码'));
      }
      code = ctx.helper.createRandom();
      ctx.helper.sendMessage({
        mobile: phone,
        parameters: {
          code,
          time: '30'
        }
      });
      await app.redis.set(`${Prefixs.redis_code}${phone}`, code, 'EX', ExpireTimes.code);
      return code;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  /** 校验验证码 */
  public async verifyCode({phone, code}: IVerifyCode) {
    const {app} = this;
    try {
      const value = await app.redis.get(`${Prefixs.redis_code}${phone}`);
      if (value !== code) {
        return Promise.reject(new Error('无效验证码'));
      }
      await app.redis.del(`${Prefixs.redis_code}${phone}`);
      return 'success';
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
