import 'tsconfig-paths/register';
import * as assert from 'assert';
import {Context} from 'egg';
import {app} from 'egg-mock/bootstrap';
import {ChannelNameMap} from '@const';

describe('test/app/service/search.test.js', () => {
  let ctx: Context;

  before(async () => {
    ctx = app.mockContext();
  });

  it('sayHi', async () => {
    const result = await ctx.service.search[`Search${ChannelNameMap.KU}`]({
      KeyWord: '周杰伦',
      Limit: 1,
      PageIndex: 1,
      Type: 'SONG'
    });
    assert(Boolean(result));
  });
});
