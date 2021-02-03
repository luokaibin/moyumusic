import {Application} from 'egg';

export default (app: Application) => {
  const {STRING, INTEGER, BOOLEAN} = app.Sequelize;
  const Songlist = app.model.define(
    'songlist',
    {
      /** 主键ID */
      id: {type: INTEGER, primaryKey: true, autoIncrement: true},
      /** 歌单名称 **/
      name: {
        type: STRING(128),
        allowNull: false
      },
      /** 歌单所属用户 */
      userId: {type: INTEGER, allowNull: false},
      /** 歌单是否公开 */
      public: {type: BOOLEAN, defaultValue: true},
      /** 背景图 */
      cover_bg: {
        type: STRING(512),
        defaultValue: ''
      },
      /** 描述 */
      desc: {
        type: STRING(512),
        defaultValue: ''
      }
    },
    {
      freezeTableName: true
    }
  );
  Songlist.sync();
  return Songlist;
};
