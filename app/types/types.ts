import { Stats } from 'fs';

export type ISearchQQSongT = 'SONG' | 'SONGLIST' | 'LYRIC' | 'ALBUM' | 'SINGER' | 'MV';
export type IChannel = 'QQ' | 'NETEASE' | 'XIA' | 'MI' | 'KU' | 'SI';
export type IType = number | string;
export type IChannelNameMap = {
  [key in IChannel]: IChannel;
};
export type IChannelSearchType = {
  [key in IChannel]: IType;
};
export type ISearchType<T = IChannelSearchType> = {
  [key in ISearchQQSongT]: T;
};

export interface ISearchReq {
  /** 搜索关键字 */
  KeyWord: string;
  /** 每页多少条信息 */
  Limit: number;
  /** 第几页 */
  PageIndex: number;
  /** 搜索类型 */
  Type: ISearchQQSongT;
  /** 渠道 */
  Channel: IChannel;
}
export interface ISearchServiceParams extends Omit<ISearchReq, 'Channel' | 'Type'> {
  Type: string | number;
}
export interface IGetUrlsServiceParams {
  ids: string[];
}

export interface SearchQQSong {
  /** 返回数据格式 */
  foramt: 'json';
  /** 每页多少条信息 */
  n: number;
  /** 第几页 */
  p: number;
  /** 搜索关键字 */
  w: string;
  /** 不知道这个参数什么意思，但是加上这个参数你会对搜索结果更满意的 */
  cr: 1;
  g_tk: '5381';
  /** 0：单曲，2：歌单，7：歌词，8：专辑，9：歌手，12：mv */
  t: IType;
}

export interface SearchQQSongList {
  remoteplace: 'txt.yqq.playlist';
  /** 第几页 */
  page_no: number;
  /** 每页多少条信息 */
  num_per_page: number;
  /** 搜索关键字 */
  query: string;
}

export type SearchQQReq = SearchQQSong | SearchQQSongList;

export interface SearchNETEASEReq {
  s: string;
  type: IType;
  limit: number;
  offset: number;
}

export interface SearchMIReq {
  keyword: string;
  pgc: number;
  rows: number;
  type: IType;
}

export interface IRouterPaths {
  path: string;
  method: 'get' | 'post';
  controller: string;
}

export interface IRequestQQOptions<T> {
  /** 请求地址 */
  url: string;
  /** 请求参数 */
  data?: T;
  /** 请求方式 */
}

export interface IAppRequestRes<B, C> {
  body?: B;
  cookie?: C;
}
export interface IRequestNETEASEOptions<T> extends IRequestQQOptions<T> {
  /** 加密方式 */
  crypto?: 'Weapi' | 'Eapi';
  path?: string;
}

export interface IRequestMIOptions<T> extends IRequestQQOptions<T> {
  /** 加密方式 */
  headers?: {
    referer?: string;
    channel?: '0146951';
    uid?: string;
  };
}

export interface IGetStat {
  status: boolean;
  stat?: Stats;
}

export interface IMkdir {
  status: boolean;
  message?: NodeJS.ErrnoException;
}

export interface ICookie {
  [key: string]: any;
}

export interface IBody<T = any> {
  code?: number;
  messge?: string;
  data?: T;
}

export interface INETEASECONF {
  BASE62?: string;
  PRESETKEY?: Buffer;
  IV?: Buffer;
  PUBLICKEY?: string;
  EAPIKEY?: string;
}

export interface ICryptoApi {
  NETEASECONF: Required<INETEASECONF>;
  url: string;
  path: string;
  data: any;
}
