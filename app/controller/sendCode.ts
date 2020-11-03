import {Controller} from 'egg';
import {FAIL, SUCCESS, ZhCNReg} from '@const';

export default class SendCodeController extends Controller {
  /** 发送验证码 */
  public async index() {
    const {ctx} = this;
    try {
      const {phone} = ctx.request.body;
      await ctx.helper.validate.checkPhone(phone);
      await ctx.service.message.sendCode({phone});
      ctx.body = {code: SUCCESS};
    } catch (error) {
      !ZhCNReg.test(error.message) && ctx.logger.error(error);
      ctx.body = {
        code: FAIL,
        message: error?.message
      };
    }
  }
}
