import {Context} from 'egg';
import {FAIL, SUCCESS} from '@const';
import {IBody} from '@types';
/**
 * 一个完整的返回结果必须包含 code，message，data 如果没有就给结果加上
 */

export default () => {
  const checkCode = (body: IBody) => {
    const {code, data} = body;
    if (!code) {
      if (data) {
        return SUCCESS;
      }
      return FAIL;
    }
    return code;
  };
  const checkMessage = (body: IBody) => {
    const {code, messge, data} = body;
    if (!messge) {
      if (code) {
        return code === FAIL ? '失败' : '成功';
      }
      return data ? '成功' : '失败';
    }
    return messge;
  };
  return async (ctx: Context, next) => {
    await next();
    const code = checkCode(ctx?.body ?? {});
    const message = checkMessage(ctx?.body ?? {});
    const data = ctx?.body?.data ?? {};
    ctx.body = {
      code,
      message,
      data,
      ...ctx?.body
    };
  };
};
