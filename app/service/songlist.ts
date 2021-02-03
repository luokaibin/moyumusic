import {Service} from 'egg';
import {omit, pick} from 'lodash';
import {ISonglistInfo} from '@types';

export default class SonglistService extends Service {
  public async createUserSonglist(songlistInfo: ISonglistInfo) {
    const {ctx} = this;
    try {
      ctx.logger.info(songlistInfo);
      const songlist = await ctx.model.Songlist.create(songlistInfo);
      return songlist.toJSON();
    } catch (error) {
      return Promise.reject(error);
    }
  }
  public async updateUserSonglist(songlistInfo: ISonglistInfo) {
    const {ctx} = this;
    try {
      const songlistModel = await ctx.model.Songlist.update(omit(songlistInfo, ['id']), {
        where: pick(songlistInfo, ['id'])
      });
      if (songlistModel.toString() !== '1') {
        return Promise.reject(new Error('更新信息失败，请检查 id 或其他信息是否正确'));
      }
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
