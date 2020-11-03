import {Application} from 'egg';

export default (app: Application) => {
  const {STRING, INTEGER, ENUM} = app.Sequelize;
  const Account = app.model.define(
    'account',
    {
      /** 主键ID */
      id: {type: INTEGER, primaryKey: true, autoIncrement: true},
      /** 账号类型 1 手机号 2 邮箱 3 微信 4 QQ 5 钉钉 6 淘宝 7 支付宝 8 新浪 */
      type: {
        type: ENUM('1', '2', '3', '4', '5', '6', '7', '8'),
        defaultValue: '1'
      },
      /** 账号 */
      account: {type: STRING(255), unique: true, allowNull: false},
      /** 用户密码 md5 加密存储 */
      password: {type: STRING(255), defaultValue: ''},
      /** 关联的用户ID */
      userId: {type: INTEGER, allowNull: false}
    },
    {
      freezeTableName: true
    }
  );
  Account.sync();
  return Account;
};
