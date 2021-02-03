import {Application} from 'egg';

export default (app: Application) => {
  const {INTEGER} = app.Sequelize;
  const SonglistMerge = app.model.define(
    'songlistMerge',
    {
      /** 主键ID */
      id: {type: INTEGER, primaryKey: true, autoIncrement: true},
      /** 歌曲ID */
      songId: {type: INTEGER, allowNull: false},
      /** 歌曲信息 **/
      singlistId: {
        type: INTEGER,
        allowNull: false
      }
    },
    {
      freezeTableName: true
    }
  );
  SonglistMerge.sync();
  return SonglistMerge;
};
