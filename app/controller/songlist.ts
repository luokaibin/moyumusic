import {Controller} from 'egg';
import {FAIL, SUCCESS, ZhCNReg} from '@const';

export default class SonglistController extends Controller {
  // 创建歌单
  public async createSonglist() {
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
  // 获取歌单
  public async getSonglist() {
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
}
