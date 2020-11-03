import {Service} from 'egg';
import {omit, pick} from 'lodash';
import {IVerifyCode, IregisterUser, IUserInfo} from '@types';
import {Op} from 'sequelize';

export default class UserService extends Service {
  public async register({phone, type}: IregisterUser) {
    const {app, ctx} = this;
    try {
      const view_id = app.createId();
      const user = await ctx.model.User.create({view_id, phone});
      const {id: userId} = user.toJSON() as any;
      await ctx.model.Account.create({type, account: phone, userId});
      return user.toJSON();
    } catch (error) {
      return Promise.reject(error);
    }
  }
  public login() {
    try {
      return 'success';
    } catch (error) {
      return Promise.reject(error);
    }
  }
  public async loginCode({phone}: IVerifyCode) {
    const {ctx} = this;
    try {
      const account = await ctx.model.Account.findOne({
        where: {
          [Op.and]: [{type: '1', account: phone}]
        }
      });
      if (!account) {
        return this.register({phone, type: '1'});
      }
      const {userId} = account.toJSON() as any;
      const user = await ctx.model.User.findOne({where: {[Op.and]: [{id: userId}]}});
      return user?.toJSON();
    } catch (error) {
      return Promise.reject(error);
    }
  }
  public async songlist() {
    try {
      return 'success';
    } catch (error) {
      return Promise.reject(error);
    }
  }
  public async updateUserInfo(userInfo: IUserInfo) {
    try {
      const user = await this.ctx.model.User.update(omit(userInfo, ['id', 'view_id']), {
        where: pick(userInfo, ['id', 'view_id'])
      });
      if (user.toString() !== '1') {
        return Promise.reject(new Error('更新信息失败，请检查 id 或 view_id 或其他信息是否正确'));
      }
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
