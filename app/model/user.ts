import {Application} from 'egg';

export default (app: Application) => {
  const {INTEGER, STRING, ENUM, TEXT} = app.Sequelize;
  const USER = app.model.define(
    'user',
    {
      /** 主键ID */
      id: {type: INTEGER, primaryKey: true, autoIncrement: true},
      /** 用户 ID，用来显示的ID，由雪花算法生成 */
      view_id: {
        type: STRING(128),
        unique: true,
        allowNull: false
      },
      /** 手机号码 联系方式 */
      phone: {
        type: STRING(128),
        defaultValue: ''
      },
      /** 用户性别 1 男 2 女 0 未知 */
      gender: {
        type: ENUM('1', '2', '0'),
        defaultValue: '0'
      },
      /** 用户昵称，不超过32个汉字 */
      nickname: {
        type: STRING(255),
        defaultValue: ''
      },
      /** 主页背景图 */
      cover_bg: {
        type: STRING(512),
        defaultValue: ''
      },
      /** 用户头像 一个 URL 地址 */
      portrait_image: {
        type: STRING(512),
        defaultValue: ''
      },
      /** 签名 */
      autograph: {
        type: TEXT,
        defaultValue: ''
      },
      /** 生日 */
      birthday: {
        type: STRING(128),
        defaultValue: ''
      },
      /** 地区 字符串 */
      region: {
        type: TEXT,
        defaultValue: ''
      },
      /** 用户真实姓名，不超过30个汉字 如果有实名认证的话 */
      realname: {
        type: STRING(128),
        defaultValue: ''
      },
      /** 用户证件号码 不超过30个数字 如果有实名认证的话 */
      card_id: {
        type: STRING(255),
        defaultValue: ''
      },
      /** 证件类型 1 身份证 2 驾照 3 护照 4 军官证 0 未知 */
      card_type: {
        type: ENUM('1', '2', '3', '4', '0'),
        defaultValue: '0'
      }
    },
    {
      freezeTableName: true
    }
  );
  USER.sync();
  return USER;
};
