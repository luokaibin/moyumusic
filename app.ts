import {mkdir} from 'fs';

export default class AppBootHook {
  app: any;
  constructor(app) {
    this.app = app;
  }
  serverDidReady() {
    const creatDataPath = async () => {
      const {
        app: {DATAPATH, helper}
      } = this;
      const {status} = await helper.getStat(DATAPATH);
      if (!status) {
        mkdir(DATAPATH, (err) => {
          if (!err) {
            console.log('创建成功');
          }
        });
      }
    };
    creatDataPath();
  }
}
