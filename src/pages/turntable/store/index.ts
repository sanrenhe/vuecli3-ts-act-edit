import { Dispatch, Commit } from "vuex";
import { Dictionary } from "vue-router/types/router";

interface ActionHandler {
    commit: Commit;
    dispatch: Dispatch;
    [key: string]: any;
}

export default {
    state: {
        editDataKey: [ // 接口数据编辑字段
            "act",
            "draw",
            "advert",
            "award",
            "awardsType",
        ],
        editEleBlackList: [],    // 编辑项黑名单，配置即隐藏
        editRenderIgnoreKey: [],                // 自定义忽略的数据字段，即不需要进行特殊处理的数据字段
        editHandleKey: ["award",],               // 自定义需要处理的数据字段，即在编辑前进行处理的数据字段
        editUpdateKey: ["award"],               // 自定义需要更新的数据字段，即在保存成功后 或 在操作过程中 需要更新的数据字段
        activeNames: {                          // 控制设置区域显示和隐藏
            active: [
                "base",
                "baseExt",
                "share",
                "logo",
                "white",
                "advert",
                "draw",
                "win"
            ]
        },
        /**
         * 顶部导航栏、左侧数字导航栏数据
         */
        editPagePath: {
            path: '/e/actId/index', // 当前页面显示路径
            pathArr: [              // 页面路径，奖品、商品详情页特殊处理，替换奖品(prizeId)、商品(goodsId)id占位字符串
                {
                    path: '/e/actId/index',
                    title: '活动首页',
                },
                {
                    path: '/e/actId/my',
                    title: '我的奖品',
                },
                {
                    path: '/e/actId/detail/prizeId',
                    title: '奖品详情',
                },
                {
                    path: 'share',
                    title: '分享效果',
                },
            ]
        }
    },
    mutations: {
        updateEditPagePath(state: any, data: any) {
            state.editPagePath.path = data.path;
        }
    },
    actions: {},
    getters: {
        editDataKey(state: Dictionary<string[]>) {
            return state.editDataKey;
        },
        editEleBlackList(state: Dictionary<string[]>) {
            return state.editEleBlackList;
        },
        activeNames(state: Dictionary<any>) {
            return state.activeNames;
        },
        editPagePath(state: Dictionary<any>) {
            return state.editPagePath;
        }
    }
};
