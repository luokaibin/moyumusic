import {Controller} from 'egg';
import {pick} from 'lodash';
import {FAIL, SUCCESS, ZhCNReg, UrlReg} from '@const';
import {ISonglistInfo} from '@types';

export default class SonglistController extends Controller {
  public async checkCreateUserSonglistReq({name, userId}: ISonglistInfo) {
    try {
      if (!userId || typeof userId !== 'number')
        return Promise.reject(new Error('userId 不能为空 且需要是 nember 类型'));
      if (!name || typeof name !== 'string' || Buffer.byteLength(name, 'utf8') > 96)
        return Promise.reject(new Error('name 不能为空 且不能超过 96 个字节'));
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }
  public async checkUpdateUserSonglistReq(req: ISonglistInfo) {
    try {
      if (!req.id || typeof req.id !== 'number') return Promise.reject(new Error('id 不能为空 且需要是 nember 类型'));
      if (req.name && (typeof req.name !== 'string' || Buffer.byteLength(req.name, 'utf8') > 96))
        return Promise.reject(new Error('name 需要是 string 类型 且不能超过 96 个字节'));
      if (req.public && typeof req.public !== 'boolean') return Promise.reject(new Error('public 需要是 boolean 类型'));
      if (req.cover_bg && (typeof req.cover_bg !== 'string' || !UrlReg.test(req.cover_bg)))
        return Promise.reject(new Error('cover_bg 需要是 string 类型，且符合 url 规则'));
      if (req.desc && (typeof req.desc !== 'string' || Buffer.byteLength(req.desc, 'utf8') > 420))
        return Promise.reject(new Error('desc 需要是 string 类型，且长度不能超过420个字节'));
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }
  // 创建歌单
  public async createUserSonglist() {
    const {ctx} = this;
    try {
      const {body} = ctx.request;
      const songlist = pick(body, ['userId', 'name']);
      await this.checkCreateUserSonglistReq(songlist);
      const Instance = await ctx.service.songlist.createUserSonglist(songlist);
      ctx.body = {code: SUCCESS, data: Instance};
    } catch (error) {
      !ZhCNReg.test(error.message) && ctx.logger.error(error);
      ctx.body = {
        code: FAIL,
        message: error?.message
      };
    }
  }
  // 获取歌单
  public async getUserSonglist() {
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
  // 修改歌单信息
  public async updateUserSonglist() {
    const {ctx} = this;
    try {
      const {body} = ctx.request;
      const songlist = pick(body, ['name', 'id', 'public', 'cover_bg', 'desc']);
      await this.checkUpdateUserSonglistReq(songlist);
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
