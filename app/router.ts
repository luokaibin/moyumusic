import {Application} from 'egg';
import {RouterPaths} from '@const';

export default (app: Application) => {
  const {router} = app;
  RouterPaths.forEach((item) => {
    router[item.method](item.path, item.controller);
  });
};
