// 验证 url 的正则
export const UrlReg = /^((https?)?:\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+\.)+[a-zA-Z]+)(:\d+)?(\/.*)?(\?.*)?(#.*)?$/;
// 验证纯数字的正则
export const numberReg = /^\d*$/;
// 验证手机号的正则
export const phoneReg = /^1[3-9]\d{9}$/;
// 验证中文汉字的正则
export const ZhCNReg = /\p{Script=Han}/u;
