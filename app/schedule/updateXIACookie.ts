import { Subscription } from 'egg';
import { XIADomain } from '../constants';

export default class UpdateCookie extends Subscription {
  static get schedule() {
    return {
      cron: '0 0 4 * * ?',
      type: 'all',
      immediate: true
    };
  }
  async subscribe() {
    const { app } = this;
    const { cookie } = await app.RequestXIA({ url: XIADomain });
    const cookieMap = await app.helper.getCookie(app.COOKIEFILE, app.DATAPATH);
    cookieMap.XIA = cookie;
    app.helper.writeFileToData(app.COOKIEFILE, JSON.stringify(cookieMap, null, 2), app.DATAPATH);
  }
}
