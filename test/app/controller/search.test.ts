import * as assert from 'assert';
import {app} from 'egg-mock/bootstrap';

describe('test/app/controller/search.test.ts', () => {
  it('should GET /', async () => {
    const result = await app.httpRequest().get('/search?KeyWord=%E5%91%A8%E6%9D%B0%E4%BC%A6&Channel=KU').expect(200);
    assert(Boolean(result.text));
  });
});
