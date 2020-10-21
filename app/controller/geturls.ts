import { Controller } from 'egg';
import { FAIL, SUCCESS, ChannelNameMap } from '@const';

export default class GeturlsController extends Controller {
  private async checkReq({ Channel, id }) {
    try {
      const { validate } = this.ctx.helper;
      await validate.checkChannel(Channel);
      if (typeof id !== 'string') return Promise.reject(new Error('请传入音乐ID'));
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }
  public async index() {
    const { ctx } = this;
    try {
      const {
        query: { id, Channel = ChannelNameMap.QQ }
      } = ctx;
      await this.checkReq({ id, Channel });
      const res = await ctx.service.geturls[`Geturls${ChannelNameMap[Channel]}`]({
        ids: id.split(',')
      });
      ctx.body = { code: SUCCESS, data: res };
    } catch (error) {
      ctx.logger.error(error);
      ctx.body = {
        code: FAIL,
        message: error?.message
      };
    }
  }
}
