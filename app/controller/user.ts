import {Controller} from 'egg';
import {FAIL, SUCCESS, numberReg, UrlReg, phoneReg, ZhCNReg} from '@const';
import {IVerifyCode, IUserInfo} from '@types';
import {pick} from 'lodash';

export default class UserController extends Controller {
  /** 验证码登录校验 */
  public async checkLoginCodeReq({phone, code}: IVerifyCode) {
    const {ctx} = this;
    try {
      if (!phone) return Promise.reject(new Error('请传入手机号'));
      if (typeof phone !== 'string') return Promise.reject(new Error('手机号类型需要 string 类型'));
      if (!code) return Promise.reject(new Error('请传入验证码'));
      if (typeof code !== 'string') return Promise.reject(new Error('验证码需要 string 类型'));
      await ctx.helper.validate.checkPhone(phone);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }
  /** 修改用户信息校验 */
  public async checkUpdateUserInfoReq(userInfo: IUserInfo) {
    try {
      if (!userInfo.id && !userInfo.view_id) return Promise.reject(new Error('id 和 view_id 不能同时为空'));
      if (userInfo.id && typeof userInfo.id !== 'number') return Promise.reject(new Error('id 需要是 nember 类型'));
      if (userInfo.view_id && (typeof userInfo.view_id !== 'string' || !numberReg.test(userInfo.view_id)))
        return Promise.reject(new Error('view_id 需要是 string 类型，且为纯数字'));
      if (userInfo.phone && (typeof userInfo.phone !== 'string' || !phoneReg.test(userInfo.phone)))
        return Promise.reject(new Error('phone 类型错误'));
      if (userInfo.gender && (typeof userInfo.gender !== 'string' || !['1', '2'].includes(userInfo.gender)))
        return Promise.reject(new Error('gender 需要是 string 类型，且值为 1，2'));
      if (
        userInfo.nickname &&
        (typeof userInfo.nickname !== 'string' || Buffer.byteLength(userInfo.nickname, 'utf8') > 96)
      )
        return Promise.reject(new Error('nickname 需要是 string 类型，且长度不能超过96个字节'));
      if (userInfo.cover_bg && (typeof userInfo.cover_bg !== 'string' || !UrlReg.test(userInfo.cover_bg)))
        return Promise.reject(new Error('cover_bg 需要是 string 类型，且符合 url 规则'));
      // eslint-disable-next-line prettier/prettier
      if (userInfo.portrait_image && (typeof userInfo.portrait_image !== 'string' || !UrlReg.test(userInfo.portrait_image)))
        return Promise.reject(new Error('portrait_image 需要是 string 类型，且符合 url 规则'));
      if (
        userInfo.autograph &&
        (typeof userInfo.autograph !== 'string' || Buffer.byteLength(userInfo.autograph, 'utf8') > 420)
      )
        return Promise.reject(new Error('autograph 需要是 string 类型，且长度不能超过420个字节'));
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }
  /** 注册用户 */
  public async register() {
    const {ctx} = this;
    try {
      ctx.body = {code: SUCCESS, data: 'demo'};
    } catch (error) {
      !ZhCNReg.test(error.message) && ctx.logger.error(error);
      ctx.body = {
        code: FAIL,
        message: error?.message
      };
    }
  }
  /** 用户登录 */
  public async login() {
    const {ctx} = this;
    try {
      ctx.body = {code: SUCCESS, data: 'demo'};
    } catch (error) {
      !ZhCNReg.test(error.message) && ctx.logger.error(error);
      ctx.body = {
        code: FAIL,
        message: error?.message
      };
    }
  }
  /** 验证码登录 */
  public async loginCode() {
    const {ctx} = this;
    try {
      const {body} = ctx.request;
      await this.checkLoginCodeReq(body);
      await ctx.service.message.verifyCode(body);
      const res = await ctx.service.user.loginCode({phone: body.phone});
      ctx.body = {code: SUCCESS, data: res};
    } catch (error) {
      !ZhCNReg.test(error.message) && ctx.logger.error(error);
      ctx.body = {
        code: FAIL,
        message: error?.message
      };
    }
  }
  /** 修改用户信息 */
  public async updateUserInfo() {
    const {ctx} = this;
    try {
      const {body} = ctx.request;
      const userInfo = pick(body, [
        'id',
        'view_id',
        'phone',
        'gender',
        'nickname',
        'cover_bg',
        'portrait_image',
        'autograph',
        'birthday',
        'region'
      ]);
      await this.checkUpdateUserInfoReq(userInfo);
      await ctx.service.user.updateUserInfo(userInfo);
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
