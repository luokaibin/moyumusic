import { Application } from 'egg';
import {
  IRequestQQOptions,
  IGetStat,
  IMkdir,
  ICookie,
  IRequestNETEASEOptions,
  ICryptoApi,
  IRequestMIOptions
} from '@types';
import { mkdir, readFile, stat, writeFile } from 'fs';
import { resolve } from 'path';
import { createCipheriv, createHash, publicEncrypt, randomBytes } from 'crypto';
import { RSA_NO_PADDING } from 'constants';

export default {
  get DATAPATH() {
    return './app/data';
  },
  /** COOKIE文件 */
  get COOKIEFILE() {
    return 'cookie.json';
  },
  helper: {
    /** UA 设备 */
    get UserAgent() {
      return [
        'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.',
        // iOS with qq micromsg
        'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/602.1.50 (KHTML like Gecko) Mobile/14A456 QQ/6.5.7.408 V1_IPH_SQ_6.5.7_1_APP_A Pixel/750 Core/UIWebView NetType/4G Mem/103',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.15(0x17000f27) NetType/WIFI Language/zh',
        // Android -> Huawei Xiaomi
        'Mozilla/5.0 (Linux; Android 9; PCT-AL10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.64 HuaweiBrowser/10.0.3.311 Mobile Safari/537.36',
        'Mozilla/5.0 (Linux; U; Android 9; zh-cn; Redmi Note 8 Build/PKQ1.190616.001) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/71.0.3578.141 Mobile Safari/537.36 XiaoMi/MiuiBrowser/12.5.22',
        // Android + qq micromsg
        'Mozilla/5.0 (Linux; Android 10; YAL-AL00 Build/HUAWEIYAL-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/78.0.3904.62 XWEB/2581 MMWEBSDK/200801 Mobile Safari/537.36 MMWEBID/3027 MicroMessenger/7.0.18.1740(0x27001235) Process/toolsmp WeChat/arm64 NetType/WIFI Language/zh_CN ABI/arm64',
        'Mozilla/5.0 (Linux; U; Android 8.1.0; zh-cn; BKK-AL10 Build/HONORBKK-AL10) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/10.6 Mobile Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:80.0) Gecko/20100101 Firefox/80.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.30 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.2 Safari/605.1.15',
        // Windows 10 Firefox / Chrome / Edge
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:80.0) Gecko/20100101 Firefox/80.0',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.30 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/13.10586'
      ];
    },
    /**
     * 网易云参数加密用的
     */
    _aesEncrypt(buffer: Buffer, mode: string, key, iv): Buffer {
      const cipher = createCipheriv('aes-128-' + mode, key, iv);
      return Buffer.concat([cipher.update(buffer), cipher.final()]);
    },
    /**
     * 网易云参数加密用的
     */
    _rsaEncrypt(buffer: Buffer, key: string): Buffer {
      buffer = Buffer.concat([Buffer.alloc(128 - buffer.length), buffer]);
      return publicEncrypt({ key, padding: RSA_NO_PADDING }, buffer);
    },
    /**
     * 网易云参数加密用的
     * NETEASECONF 常量 NETEASECONF
     */
    _weapi({ data, NETEASECONF }: ICryptoApi): { params: string; encSecKey: string } {
      const text = JSON.stringify(data);
      const secretKey = randomBytes(16).map((n) => NETEASECONF.BASE62.charAt(n % 62).charCodeAt(0));
      return {
        params: this._aesEncrypt(
          Buffer.from(
            this._aesEncrypt(Buffer.from(text), 'cbc', NETEASECONF.PRESETKEY, NETEASECONF.IV).toString('base64')
          ),
          'cbc',
          secretKey,
          NETEASECONF.IV
        ).toString('base64'),
        encSecKey: this._rsaEncrypt(secretKey.reverse() as any, NETEASECONF.PUBLICKEY).toString('hex')
      };
    },
    /**
     * 网易云参数加密用的
     */
    _eapi({ url, data, NETEASECONF }: ICryptoApi) {
      const text = typeof data === 'object' ? JSON.stringify(data) : data;
      const message = `nobody${url}use${text}md5forencrypt`;
      const digest = createHash('md5').update(message).digest('hex');
      const dataStr = `${url}-36cd479b6b5-${text}-36cd479b6b5-${digest}`;
      return {
        params: this._aesEncrypt(Buffer.from(dataStr), 'ecb', NETEASECONF.EAPIKEY, '').toString('hex').toUpperCase()
      };
    },
    _formatCookie<T>(cookie: T): string | undefined {
      if (!cookie) return undefined;
      return Object.keys(cookie)
        .map((k) => `${k}=${encodeURI(cookie[k])}`)
        .join('; ');
    },
    /**
     * querystring.stringify 方法，做参数格式化的
     */
    _stringifyPrimitive<S = string>(v: S) {
      switch (typeof v) {
        case 'string':
          return v;

        case 'boolean':
          return v ? 'true' : 'false';

        case 'number':
          return isFinite(v) ? v : '';

        default:
          return '';
      }
    },
    /**
     * 网易云 weapi 加密方式数据处理
     */
    _cryptoWeapi(params: ICryptoApi) {
      return { data: this._weapi(params) };
    },
    /**
     * 网易云 eapi 加密方式数据处理
     */
    _cryptoEapi({ data, NETEASECONF, path }: ICryptoApi) {
      const header = {
        appver: '6.1.1', // app 版本
        versioncode: '140', // 版本号
        buildver: Date.now().toString().substr(0, 10),
        resolution: '1920x1080',
        __csrf: '',
        os: 'pc',
        requestId: `${Date.now()}_${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(4, '0')}`
      };
      data.header = header;
      return { data: this._eapi({ data, NETEASECONF, url: path, path }), cookie: header };
    },
    /**
     * querystring.stringify 方法，做参数格式化的
     * @param obj 要格式化的参数
     */
    stringify<T = {}>(obj: T) {
      const sep = '&';
      const eq = '=';

      if (typeof obj === 'object') {
        return Object.keys(obj)
          .map((k) => {
            const ks = encodeURIComponent(this._stringifyPrimitive(k)) + eq;
            if (Array.isArray(obj[k])) {
              return obj[k]
                .map((v) => {
                  return ks + encodeURIComponent(this._stringifyPrimitive(v));
                })
                .join(sep);
            }
            return ks + encodeURIComponent(this._stringifyPrimitive(obj[k]));
          })
          .filter(Boolean)
          .join(sep);
      }
      return '';
    },
    getUA() {
      return this.UserAgent[Math.floor(Math.random() * this.UserAgent.length)];
    },
    /**
     * 获取路径信息
     * @param path string
     */
    async getStat(path: string): Promise<IGetStat> {
      return new Promise((resolve) => {
        stat(path, (err, stats) => {
          if (err) {
            resolve({ status: false });
          } else {
            resolve({ status: true, stat: stats });
          }
        });
      });
    },
    /**
     * 创建路径
     * @param path string
     */
    async mkdir(path: string): Promise<IMkdir> {
      return new Promise((resolve) => {
        mkdir(path, (err) => {
          if (!err) {
            resolve({ status: true });
          } else {
            resolve({ status: false, message: err });
          }
        });
      });
    },
    /**
     * 将 data 写入 app/data 目录
     * @param fileName 文件名
     * @param data 写入的数据
     * @param DATAPATH 基础路径 来自 app.DATAPATH
     */
    writeFileToData(fileName: string, data: string, DATAPATH: string): Promise<void> {
      return new Promise((success, reject) => {
        const fd = resolve(DATAPATH, fileName);
        writeFile(fd, data, (err) => {
          if (err) {
            reject(err);
          } else {
            success();
          }
        });
      });
    },
    /**
     * 读取 app/data 内的文件内容
     * @param fileName 文件名
     * @param DATAPATH 基础路径 来自 app.DATAPATH
     */
    async getFileContent(fileName: string, DATAPATH: string): Promise<string> {
      const fd = resolve(DATAPATH, fileName);
      return new Promise((resolve, reject) => {
        readFile(fd, 'utf8', (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    },
    /** 获取cookie */
    async getCookie<T extends ICookie>(COOKIEFILE: string, DATAPATH: string): Promise<T | undefined> {
      try {
        const cookie = await this.getFileContent(COOKIEFILE, DATAPATH);
        return JSON.parse(cookie);
      } catch (error) {
        return undefined;
      }
    }
  },

  async RequestQQ<T extends any, P extends any>(options: IRequestQQOptions<T>): Promise<P> {
    try {
      const { httpclient, helper, COOKIEFILE, DATAPATH } = this as Application;
      const { url, data } = options;
      const cookie = await helper.getCookie(COOKIEFILE, DATAPATH);
      const { data: result } = await httpclient.request(url, {
        method: 'GET',
        data,
        // 设置响应数据格式，默认不对响应数据做任何处理，直接返回原始的 buffer 格式数据。 支持 text 和 json 两种格式
        dataType: 'text',
        headers: {
          Referer: 'https://y.qq.com',
          Cookie: helper._formatCookie(cookie)
        }
      });
      return JSON.parse(result.replace(/callback\(|MusicJsonCallback\(|jsonCallback\(|\)$/g, ''));
    } catch (error) {
      throw new Error(error);
    }
  },
  async RequestNETEASE<T extends any, P extends any>(options: IRequestNETEASEOptions<T>): Promise<P> {
    try {
      const {
        httpclient,
        helper,
        config: {
          CONSTANT: { NETEASECONF }
        }
      } = this as Application;
      const { url, data, crypto = 'Weapi', path } = options;
      const cryptoData = helper[`_crypto${crypto}`]({ data, NETEASECONF, url, path });
      const { data: result } = await httpclient.request(url, {
        method: 'POST',
        data: helper.stringify(cryptoData.data),
        // 设置响应数据格式，默认不对响应数据做任何处理，直接返回原始的 buffer 格式数据。 支持 text 和 json 两种格式
        dataType: 'text',
        headers: {
          Referer: 'https://music.163.com',
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': helper.getUA(),
          Cookie: helper._formatCookie(cryptoData.cookie)
        }
      });
      return JSON.parse(result);
    } catch (error) {
      throw new Error(error);
    }
  },
  async RequestMI<T extends any, P extends any>(options: IRequestMIOptions<T>): Promise<P> {
    try {
      const { httpclient, helper } = this as Application;
      const { url, data, headers } = options;
      const { data: result } = await httpclient.request(`${url}?${helper.stringify(data)}`, {
        method: 'GET',
        // 设置响应数据格式，默认不对响应数据做任何处理，直接返回原始的 buffer 格式数据。 支持 text 和 json 两种格式
        dataType: 'text',
        headers: {
          ...headers
        }
      });
      return JSON.parse(result);
    } catch (error) {
      throw new Error(error);
    }
  }
};
