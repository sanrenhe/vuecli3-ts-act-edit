/**
 * 后台编辑接口
 */
const HOST = process.env.VUE_APP_EDIT_HOST;
export const api = {
    getData: HOST + '/sanrenhe/master/data.json', // 获取活动数据
}