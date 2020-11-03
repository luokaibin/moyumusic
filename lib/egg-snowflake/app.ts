import {Application} from 'egg';
import * as FlakeId from 'flake-idgen';
import * as intformat from 'biguint-format';

declare module 'egg' {
  interface CreateId {
    (): string;
  }
  interface Application {
    /**
     * 雪花算法生成唯一ID
     */
    createId: CreateId;
  }
}

export default (app: Application) => {
  const {snowflake} = app.config;
  if (snowflake) {
    const {epoch} = snowflake;
    /**
     * 雪花算法生成唯一ID
     */
    app.createId = (function () {
      const flakeIdGen = new FlakeId({epoch});
      return function () {
        return intformat(flakeIdGen.next(), 'dec');
      };
    })();
  }
};
