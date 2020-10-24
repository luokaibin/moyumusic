import { IRouterPaths } from '@types';
const USER = '/user';

export const RouterPaths: IRouterPaths[] = [
  {
    path: '/',
    method: 'get',
    controller: `home.index`
  },
  {
    path: '/search',
    method: 'get',
    controller: `search.index`
  },
  {
    path: `${USER}/setcookie`,
    method: 'post',
    controller: `user.setCookie`
  },
  {
    path: `/geturls`,
    method: 'get',
    controller: `geturls.index`
  }
];