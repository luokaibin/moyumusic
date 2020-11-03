import {Controller} from 'egg';
import {ISearchReq} from '@types';
import {ChannelNameMap, FAIL, SUCCESS, SearchType, ZhCNReg} from '@const';

export default class SearchController extends Controller {
  private async checkReq({Channel, KeyWord, Limit, PageIndex, Type}) {
    try {
      const {validate} = this.ctx.helper;
      await validate.checkChannel(Channel);
      if (typeof KeyWord !== 'string') return Promise.reject(new Error('请传入搜索内容'));
      await validate.checkInteger(Limit, 'Limit');
      await validate.checkInteger(PageIndex, 'PageIndex');
      if (typeof Type !== 'string') return Promise.reject(new Error('Type类型不合法'));
      if (!SearchType[Type]) return Promise.reject(new Error('不存在这个Type'));
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }
  public async index() {
    const {ctx} = this;
    try {
      const {query, service} = ctx;
      const {Channel = ChannelNameMap.QQ, KeyWord, Limit = 20, PageIndex = 1, Type = 'SONG'} = <ISearchReq>query;
      await this.checkReq({Channel, KeyWord, Limit, PageIndex, Type});
      const res = await service.search[`Search${ChannelNameMap[Channel]}`]({
        KeyWord,
        Limit,
        PageIndex,
        Type: SearchType[Type][Channel]
      });
      ctx.body = {code: SUCCESS, data: res};
    } catch (error) {
      !ZhCNReg.test(error.message) && ctx.logger.error(error);
      ctx.body = {
        code: FAIL,
        message: error?.message
      };
    }
  }
}
