import { ISearchType, IChannelNameMap, IType, INETEASECONF } from '@types';
/**
 * 渠道
 * 1: QQ 2: 网易 3: 虾米 4: 咪咕 5: 酷我 6: 自建
 */
export enum ChannelMap {
  /** 渠道 QQ音乐 */
  'QQ' = 1,
  /** 渠道 网易云 */
  'NETEASE' = 2,
  /** 渠道 虾米 */
  'XIA' = 3,
  /** 渠道 咪咕 */
  'MI' = 4,
  /** 渠道 酷我 */
  'KU' = 5,
  /** 渠道 自建 */
  'SI' = 6
}
export const ChannelNameMap: IChannelNameMap = {
  /** 渠道 QQ音乐 */
  QQ: 'QQ',
  /** 渠道 网易云 */
  NETEASE: 'NETEASE',
  /** 渠道 虾米 */
  XIA: 'XIA',
  /** 渠道 咪咕 */
  MI: 'MI',
  /** 渠道 酷我 */
  KU: 'KU',
  /** 渠道 自建 */
  SI: 'SI'
};

export const SearchQQType: ISearchType<IType> = {
  SONG: '0',
  SONGLIST: '2',
  LYRIC: '7',
  ALBUM: '8',
  SINGER: '9',
  MV: '12'
};

export const SearchNETEASEType: ISearchType<IType> = {
  SONG: 1,
  SONGLIST: 1000,
  LYRIC: 1006,
  ALBUM: 10,
  SINGER: 100,
  MV: 1004
};

export const SearchMIType: ISearchType<IType> = {
  SONG: 2,
  SONGLIST: 6,
  LYRIC: 7,
  ALBUM: 4,
  SINGER: 1,
  MV: 5
};

export const SearchXIAType: ISearchType<IType> = {
  SONG: 'SONG',
  SONGLIST: 'SONGLIST',
  LYRIC: 'LYRIC',
  ALBUM: 'ALBUM',
  SINGER: 'SINGER',
  MV: 'MV'
};

/**
 * 搜索类型
 */
export const SearchType: ISearchType = {
  /** 单曲 */
  SONG: {
    QQ: SearchQQType.SONG,
    NETEASE: SearchNETEASEType.SONG,
    XIA: SearchXIAType.SONG, // 还未修改
    MI: SearchMIType.SONG,
    KU: 1, // 还未修改
    SI: 1 // 还未修改
  },
  /** 歌单 */
  SONGLIST: {
    QQ: SearchQQType.SONGLIST,
    NETEASE: SearchNETEASEType.SONGLIST,
    XIA: SearchXIAType.LYRIC, // 还未修改
    MI: SearchMIType.SONGLIST,
    KU: 1, // 还未修改
    SI: 1 // 还未修改
  },
  /** 歌词 */
  LYRIC: {
    QQ: SearchQQType.LYRIC,
    NETEASE: SearchNETEASEType.LYRIC,
    XIA: SearchXIAType.LYRIC, // 还未修改
    MI: SearchMIType.LYRIC,
    KU: 1, // 还未修改
    SI: 1 // 还未修改
  },
  /** 专辑 */
  ALBUM: {
    QQ: SearchQQType.ALBUM,
    NETEASE: SearchNETEASEType.ALBUM,
    XIA: SearchXIAType.ALBUM, // 还未修改
    MI: SearchMIType.ALBUM,
    KU: 1, // 还未修改
    SI: 1 // 还未修改
  },
  /** 歌手 */
  SINGER: {
    QQ: SearchQQType.SINGER,
    NETEASE: SearchNETEASEType.SINGER,
    XIA: SearchXIAType.SINGER, // 还未修改
    MI: SearchMIType.SINGER,
    KU: 1, // 还未修改
    SI: 1 // 还未修改
  },
  /** MV */
  MV: {
    QQ: SearchQQType.MV,
    NETEASE: SearchNETEASEType.MV,
    XIA: SearchXIAType.MV, // 还未修改
    MI: SearchMIType.MV,
    KU: 1, // 还未修改
    SI: 1 // 还未修改
  }
};

/**
 * QQ音乐搜索接口
 * SONG：单曲，SONGLIST：歌单，LYRIC：歌词，ALBUM：专辑，SINGER：歌手，MV：mv
 */
export const URLQQMAP = {
  [SearchQQType.SONG]: 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp',
  [SearchQQType.SONGLIST]: 'https://c.y.qq.com/soso/fcgi-bin/client_music_search_songlist',
  [SearchQQType.LYRIC]: 'http://c.y.qq.com/soso/fcgi-bin/client_search_cp',
  [SearchQQType.ALBUM]: 'http://c.y.qq.com/soso/fcgi-bin/client_search_cp',
  [SearchQQType.SINGER]: 'http://c.y.qq.com/soso/fcgi-bin/client_search_cp',
  [SearchQQType.MV]: 'http://c.y.qq.com/soso/fcgi-bin/client_search_cp'
};

/**
 * 虾米音乐搜索接口
 * SONG：单曲，SONGLIST：歌单，ALBUM：专辑，SINGER：歌手，MV：mv
 */
export const XIADomain = 'https://www.xiami.com';
export const URLXIAMAP = {
  [SearchXIAType.SONG]: `${XIADomain}/api/search/searchSongs`,
  [SearchXIAType.SONGLIST]: `${XIADomain}/api/search/searchCollects`,
  [SearchXIAType.ALBUM]: `${XIADomain}/api/search/searchAlbums`,
  [SearchXIAType.SINGER]: `${XIADomain}/api/search/searchArtists`,
  [SearchXIAType.MV]: `${XIADomain}/api/search/searchMvs`
};
/**
 * 拼接播放的URL
 */
export const PlayDomain = {
  [ChannelNameMap.QQ]: 'http://122.226.161.16/amobile.music.tc.qq.com/'
};

export const NETEASECONF: Required<INETEASECONF> = {
  BASE62: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  PRESETKEY: Buffer.from('0CoJUm6Qyw8W8jud'),
  IV: Buffer.from('0102030405060708'),
  EAPIKEY: 'e82ckenh8dichen8',
  PUBLICKEY:
    '-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDgtQn2JZ34ZC28NWYpAUd98iZ37BUrX/aKzmFbt7clFSs6sXqHauqKWqdtLkF2KexO40H1YTX8z2lSgBBOAxLsvaklV8k4cBFK9snQXE9/DDaFt6Rr7iVZMldczhC0JNgTz+SHXT6CBHuX3e9SdB1Ua44oncaTWz7OBGLbCiK45wIDAQAB\n-----END PUBLIC KEY-----'
};

export const numberReg = /^\d*$/;

// 咪咕的音频质量
export const MIToneFlag = {
  128: 'PQ',
  320: 'HQ',
  flac: 'SQ'
};
