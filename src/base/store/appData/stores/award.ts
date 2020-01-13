export default {
    namespaced: true,
    state: {
        index: 0, // 当前编辑奖品序列号
        type: "", // 当前编辑奖品类型
        awardSetCustom: []
    },
    mutations: {
        award_init(state: any, data: any) {
            state.awardSetCustom = data.actSet.awardSetCustom ||  [
                {
                    name: "普通奖池",
                    title: "普通奖品",
                    area: "1",
                    probability_set: true,
                    other: {}
                },
                {
                    name: "安慰奖池",
                    title: "安慰奖品",
                    area: "2",
                    probability_set: false,
                    other: {}
                }
            ];
            state.awardSetCustom.forEach((item: any, index: number) => {
                let key = "general_" + item.area;
                state[key] = [];
                if (index == 0) {
                    state.type = key;
                }
            });
        },
        award_render(state:any, data:any) {
            // 处理奖品数据-添加编辑项标识
            data.content.forEach((val:any, index:number) => {
                // 添加编辑项字段
                let obj = {
                    input_num: 0,
                    code_num: 0,
                    renderType: "succ",
                    minnum: val.num, // 设置活动开启后默认最少数量
                    close: val.is_valid == 2 ? true : false,
                    class: val.is_valid == 2 ? "" : "unclose",
                    title: "",
                    seq: "0",
                    id: index
                };
                let award = Object.assign({}, val, obj);
                // 分发奖品至对应奖池
                let title = "";
                state.awardSetCustom.forEach((item: any) => {
                    if (award.area == item.area) {
                        title = item.title;
                    }
                });
                award.title =
                    title + (state["general_" + award.area].length + 1);
                award.seq = state["general_" + award.area].length + 1 + "";
                award.name = award.name == "" ? title : award.name;
                award.tabIndex = state["general_" + award.area].length + 1;
                state["general_" + award.area].push(award);
            });
        },
        award_handle(state:any, data:any) {
            let arr: any = [];
            state.awardSetCustom.forEach((item: any) => {
                let key = "general_" + item.area;
                arr = arr.concat(state[key]);
            });
            data.editInfo.award = arr;
        },
        award_update(state:any, data:any) {
            state.awardSetCustom.forEach((item: any) => {
                let key = "general_" + item.area;
                state[key].forEach((award: any) => {
                    award.is_valid = 1;
                    award.close = false;
                    award.class = "unclose";
                    award.minnum = award.num;
                });
            });
        },
        /**
         * 更新当前奖品编辑序列号
         * @param state
         * @param index
         */
        award_updateIndex(state:any, index: number) {
            state.index = index;
        },
        award_updateType(state:any, type: string) {
            state.type = type;
        }
    },
    actions: {
        award_render: {
            root: true,
            handler({ commit, dispatch, rootstate, state }:any, data:any) {
                return new Promise((resolve, reject) => {
                    commit("award_init", data);
                    commit("award_render", data);
                    typeof resolve === "function" && resolve();
                });
            }
        },
        award_handle: {
            root: true,
            handler({ commit, dispatch, rootstate, state }:any, data:any) {
                return new Promise((resolve, reject) => {
                    commit("award_handle", data);
                    typeof resolve === "function" && resolve();
                });
            }
        },
        award_update: {
            root: true,
            handler({ commit, dispatch, rootstate, state }:any, data:any) {
                return new Promise((resolve, reject) => {
                    commit("award_update", data);
                    typeof resolve === "function" && resolve();
                });
            }
        }
    }
};
