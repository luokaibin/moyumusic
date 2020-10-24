import {Subscription} from 'egg';
import {Domains} from '../constants';

export default class UpdateCookie extends Subscription {
  static get schedule() {
    return {
      cron: '0 0 4 1 * ?',
      type: 'all',
      immediate: true
    };
  }
  async subscribe() {
    const {app} = this;
    const {cookie} = await app.RequestKU({url: Domains.KU});
    const cookieMap = await app.helper.getCookie(app.COOKIEFILE, app.DATAPATH);
    cookieMap.KU = cookie;
    app.helper.writeFileToData(app.COOKIEFILE, JSON.stringify(cookieMap, null, 2), app.DATAPATH);
  }
}
