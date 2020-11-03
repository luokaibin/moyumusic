import {Service} from 'egg';
import {IGetUrlsServiceParams} from '@types';
import {ChannelNameMap, PlayDomain, numberReg, MIToneFlag, Domains} from '@const';

export default class GetUrlService extends Service {
  get URL(): {} {
    return {
      [ChannelNameMap.MI]: () => 'http://app.c.nf.migu.cn/MIGUM2.0/v2.0/content/listen-url',
      [ChannelNameMap.NETEASE]: () => 'https://interface3.music.163.com/eapi/song/enhance/player/url',
      [ChannelNameMap.QQ]: (uin: string, songmid: string) => {
        return `https://u.y.qq.com/cgi-bin/musicu.fcg?-=getplaysongvkey2682247447678878&g_tk=5381&loginUin=${uin}&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0&data=%7B"req_0"%3A%7B"module"%3A"vkey.GetVkeyServer"%2C"method"%3A"CgiGetVkey"%2C"param"%3A%7B"guid"%3A"2796982635"%2C"songmid"%3A%5B${songmid}%5D%2C"songtype"%3A%5B0%5D%2C"uin"%3A"${uin}"%2C"loginflag"%3A1%2C"platform"%3A"20"%7D%7D%2C"comm"%3A%7B"uin"%3A${uin}%2C"format"%3A"json"%2C"ct"%3A24%2C"cv"%3A0%7D%7D`;
      }
    };
  }
  public async [`Geturls${ChannelNameMap.QQ}`]({ids}: IGetUrlsServiceParams) {
    const {app} = this;
    try {
      const {QQ: cookie} = await app.helper.getCookie(app.COOKIEFILE, app.DATAPATH);
      if (!cookie) return Promise.reject(new Error('获取播放链接前，请先设置cookie'));
      const {uin} = cookie;
      const songmid = ids.map((id) => `"${id}"`).join(',');
      const {
        body: {
          req_0: {
            data: {midurlinfo}
          }
        }
      } = await app.RequestQQ({url: this.URL[ChannelNameMap.QQ](uin, songmid)});
      const result = {};
      midurlinfo.forEach((item) => {
        if (item.purl) {
          result[item.songmid] = `${PlayDomain[ChannelNameMap.QQ]}${item.purl}`;
        }
      });
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  public async [`Geturls${ChannelNameMap.NETEASE}`]({ids}: IGetUrlsServiceParams) {
    try {
      if (!ids.every((id) => numberReg.test(id))) {
        return Promise.reject(new Error('id不合法'));
      }
      const data = {
        ids: JSON.stringify(ids.map((id) => Number(id))),
        br: 128000
      };
      const {
        body: {data: result}
      } = await this.app.RequestNETEASE<{ids: string; br: number}>({
        url: this.URL[ChannelNameMap.NETEASE](),
        data,
        crypto: 'Eapi',
        path: '/api/song/enhance/player/url'
      });
      const urlMap = {};
      result.forEach((item) => {
        urlMap[item.id] = item.url;
      });
      return urlMap;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  public async [`Geturls${ChannelNameMap.MI}`]({ids}: IGetUrlsServiceParams) {
    const {app} = this;
    try {
      const res = await Promise.allSettled(
        ids.map(async (id) => {
          return app.RequestMI({
            url: this.URL[ChannelNameMap.MI](),
            data: {
              netType: '01',
              resourceType: 'E',
              songId: id,
              toneFlag: MIToneFlag[128],
              dataType: 2
            },
            headers: {
              referer: 'http://music.migu.cn/v3/music/player/audio',
              channel: '0146951',
              uid: '1234'
            }
          });
        })
      );
      const urlMap = {};
      res.forEach((item) => {
        const {value} = {value: {}, ...item};
        const {
          body: {
            data: {songItem, url}
          }
        } = <{body: any}>value;
        urlMap[songItem?.songId] = url;
      });
      this.logger.info(urlMap);
      return urlMap;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  public async [`Geturls${ChannelNameMap.XIA}`]({ids}: IGetUrlsServiceParams) {
    const {app} = this;
    try {
      const data = {songIds: ids};
      const {
        body: {
          result: {
            data: {songPlayInfos}
          }
        }
      } = await app.RequestXIA({
        url: `${Domains.XIA}/api/song/getPlayInfo`,
        data: JSON.stringify(data)
      });
      const urlMap = {};
      songPlayInfos.forEach((song) => {
        const {
          songId,
          playInfos: [{listenFile = ''}]
        } = song;
        urlMap[songId] = listenFile;
      });
      return urlMap;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  public async [`Geturls${ChannelNameMap.KU}`]({ids}: IGetUrlsServiceParams) {
    const {app} = this;
    try {
      const res = await Promise.allSettled(
        ids.map(async (id) => {
          return app.RequestKU({
            url: `${Domains.KU}/url`,
            data: {
              response: 'url',
              type: 'convert_url3',
              rid: id,
              br: '128kmp3'
            }
          });
        })
      );
      const urlMap = {};
      res.forEach((item, index) => {
        const {value} = {value: {}, ...item};
        const {
          body: {url}
        } = <{body: any}>value;
        urlMap[ids[index]] = url;
      });
      return urlMap;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  public async [`Geturls${ChannelNameMap.SI}`](query: IGetUrlsServiceParams) {
    return query;
  }
}
