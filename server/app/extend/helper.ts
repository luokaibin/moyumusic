import { ChannelNameMap } from '../constants';

export default {
  validate: {
    /** 验证渠道是否合法 */
    async checkChannel(Channel) {
      if (typeof Channel !== 'string') return Promise.reject(new Error('Channel类型不合法'));
      if (!ChannelNameMap[Channel]) return Promise.reject(new Error('不存在这个Channel'));
      return Promise.resolve();
    },
    /** 验证是正整数或可以转成整数 */
    async checkInteger(num, key = 'num') {
      if (!['string', 'number'].includes(typeof num)) Promise.reject(new Error(`1${key}类型不合法`));
      if (typeof num === 'string') {
        const reg = /^[1-9]\d*$/g;
        if (!reg.test(num)) Promise.reject(new Error(`2${key}类型不合法`));
        return Promise.resolve();
      }
      if (!Number.isInteger(num) || num < 1) Promise.reject(new Error(`3${key}需要时正整数`));
      return Promise.resolve();
    }
  }
};
