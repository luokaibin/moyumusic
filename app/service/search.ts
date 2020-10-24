import { Service } from 'egg';
import { ISearchServiceParams, SearchQQReq, SearchNETEASEReq, SearchMIReq } from '@types';
import {
  URLQQMAP,
  ChannelNameMap,
  SearchQQType,
  SearchNETEASEType,
  SearchMIType,
  URLXIAMAP,
  SearchXIAType
} from '@const';

export default class Search extends Service {
  private CreateSearchQQReq({ KeyWord, Limit, PageIndex, Type }: ISearchServiceParams): SearchQQReq {
    return Type === '2'
      ? { remoteplace: 'txt.yqq.playlist', page_no: PageIndex - 1, num_per_page: Limit, query: KeyWord }
      : { foramt: 'json', n: Limit, p: PageIndex, w: KeyWord, cr: 1, g_tk: '5381', t: Type };
  }
  public async [`Search${ChannelNameMap.QQ}`](params: ISearchServiceParams) {
    const { app, CreateSearchQQReq } = this;
    try {
      const data: SearchQQReq = CreateSearchQQReq(params);
      const {
        body: { data: res }
      } = await app.RequestQQ<SearchQQReq>({
        url: URLQQMAP[params.Type],
        data
      });
      if (params.Type === SearchQQType.SONG) {
        const {
          song: { totalnum: total, list }
        } = res;
        return {
          total,
          list: list?.map((item) => ({
            songmid: item.songmid,
            songname: item.songname,
            albumname: item.albumname,
            singer: item?.singer?.map((s) => ({ id: s?.id, name: s?.name }))
          }))
        };
      }
      return res;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  public async [`Search${ChannelNameMap.NETEASE}`]({ KeyWord, Limit, PageIndex, Type }: ISearchServiceParams) {
    const { app } = this;
    try {
      const req: SearchNETEASEReq = {
        s: KeyWord,
        type: Type,
        limit: Limit,
        offset: (PageIndex - 1) * Limit
      };
      const { body: res } = await app.RequestNETEASE<SearchNETEASEReq>({
        url: 'https://music.163.com/weapi/search/get',
        data: req
      });
      if (Type === SearchNETEASEType.SONG) {
        const {
          result: { songCount: total, songs: list }
        } = res;
        return {
          total,
          list: list?.map((item) => ({
            songmid: item.id,
            songname: item.name,
            albumname: item?.album?.name,
            singer: item?.artists?.map((s) => ({ id: s?.id, name: s?.name }))
          }))
        };
      }
      return res;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  public async [`Search${ChannelNameMap.MI}`]({ KeyWord, Limit, PageIndex, Type }: ISearchServiceParams) {
    const { app } = this;
    try {
      const data: SearchMIReq = {
        keyword: KeyWord,
        pgc: PageIndex,
        rows: Limit,
        type: Type
      };
      const { body: res } = await app.RequestMI<SearchMIReq>({
        url: 'https://m.music.migu.cn/migu/remoting/scr_search_tag',
        data
      });
      if (Type === SearchMIType.SONG) {
        const { musics: list, pgt: total } = res;
        return {
          total,
          list: list?.map((item) => ({
            songmid: item.id,
            songname: item.songName,
            albumname: item.albumName,
            mp3: item.mp3,
            cover: item.cover,
            singer: [{ id: item.singerId, name: item.singerName }]
          }))
        };
      }
      return res;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  public async [`Search${ChannelNameMap.XIA}`]({ KeyWord, Limit, PageIndex, Type }: ISearchServiceParams) {
    const { app } = this;
    try {
      const data = {
        key: KeyWord,
        pagingVO: {
          page: PageIndex,
          pageSize: Limit
        }
      };
      const { body: res } = await app.RequestXIA({
        url: URLXIAMAP[Type],
        data: JSON.stringify(data)
      });
      if (Type === SearchXIAType.SONG) {
        const {
          result: {
            data: {
              pagingVO: { count: total },
              songs: list
            }
          }
        } = res;
        return {
          total,
          list: list?.map((item) => ({
            songmid: item.songId,
            songname: item.songName,
            albumname: item.albumName,
            singer: item?.singerVOs?.map((s) => ({ id: s.artistId, name: s.artistName }))
          }))
        };
      }
      return res;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  public async [`Search${ChannelNameMap.KU}`](query: ISearchServiceParams) {
    return query;
  }
  public async [`Search${ChannelNameMap.SI}`](query: ISearchServiceParams) {
    return query;
  }
}
