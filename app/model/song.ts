import {Application} from 'egg';

export default (app: Application) => {
  const {STRING, INTEGER, TEXT} = app.Sequelize;
  const Song = app.model.define(
    'song',
    {
      /** 主键ID */
      id: {type: INTEGER, primaryKey: true, autoIncrement: true},
      /** 歌曲ID */
      songId: {type: STRING(128), unique: true, allowNull: false},
      /** 歌曲信息 **/
      songInfo: {
        type: TEXT,
        allowNull: false
      }
    },
    {
      freezeTableName: true
    }
  );
  Song.sync();
  return Song;
};
