import { Controller } from 'egg';
import { FAIL, SUCCESS } from '@const';

export default class UserController extends Controller {
  private async checkReq({ data }) {
    try {
      if (typeof data !== 'string') return Promise.reject(new Error('请传入data'));
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }
  public async setCookie() {
    const { ctx, app } = this;
    try {
      const userCookie = {};
      const {
        request: {
          body: { data }
        }
      } = ctx;
      await this.checkReq({ data });
      data.split('; ').forEach((c) => {
        const arr = c.split('=');
        userCookie[arr[0]] = arr[1];
      });
      const cookie = await app.helper.getCookie(app.COOKIEFILE, app.DATAPATH);
      cookie.QQ = userCookie;
      app.helper.writeFileToData(app.COOKIEFILE, JSON.stringify(cookie, null, 2), app.DATAPATH);
      ctx.body = {
        code: SUCCESS,
        message: '成功'
      };
    } catch (error) {
      ctx.logger.error(error);
      ctx.body = {
        code: FAIL,
        message: error?.message
      };
    }
  }
}
