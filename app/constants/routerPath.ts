import {IRouterPaths} from '@types';
const CONFIG = '/config';
const USER = '/user';

export const RouterPaths: IRouterPaths[] = [
  {
    path: '/search',
    method: 'get',
    controller: `search.index`
  },
  {
    path: `${CONFIG}/setCookie`,
    method: 'post',
    controller: `config.setCookie`
  },
  {
    path: `/getUrls`,
    method: 'get',
    controller: `geturls.index`
  },
  {
    path: `/sendCode`,
    method: 'post',
    controller: `sendCode.index`
  },
  {
    path: `${USER}/login`,
    method: 'post',
    controller: `user.login`
  },
  {
    path: `${USER}/loginCode`,
    method: 'post',
    controller: `user.loginCode`
  },
  {
    path: `${USER}/updateUserinfo`,
    method: 'post',
    controller: `user.updateUserInfo`
  },
  {
    path: `/getSonglist`,
    method: 'get',
    controller: `songlist.getSonglist`
  },
  {
    path: `/createSonglist`,
    method: 'post',
    controller: `songlist.createSonglist`
  }
];
