export default {
    namespaced: true,
    state: {
        general: [], // 普通奖品
        comfort: [], // 安慰奖品
        index: 0, // 当前编辑奖品序列号
        type: 'general' // 当前编辑奖品类型 general comfort
    },
    mutations: {
        prize_render(state:any, data:any) {
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
                    is_dzq:
                        val.type == ""
                            ? 2
                            : data.editInfo.prizesType[val.type].is_dzq, // 是否导入电子券 1-导，2-不导
                    title: "",
                    seq: "0",
                };
                let prize = Object.assign({}, val, obj);
                if (prize.is_valid == 2 && prize.num > 0) {
                    prize.code_num = prize.num;
                }
                if (prize.is_valid == 1) {
                    if (data.editInfo.prizesType[prize.type].is_dzq == 2) {
                        prize.input_num = prize.num;
                    } else {
                        prize.code_num = prize.num;
                    }
                }
                if (prize.jackpot == 1) {
                    prize.title =
                        "奖品" + (state.general.length + 1);
                    prize.seq = state.general.length + 1 + "";
                    prize.name = prize.name == '' ? '奖品' : prize.name;
                    prize.tabIndex = state.general.length + 1;
                    state.general.push(prize);
                } else {
                    prize.title =
                        "安慰奖" + (state.comfort.length + 1);
                    prize.seq = state.comfort.length + 1 + "";
                    prize.name = prize.name == '' ? '安慰奖' : prize.name;
                    prize.tabIndex = state.comfort.length + 1;
                    state.comfort.push(prize);
                }
            });
        },
        prize_handle(state:any, data:any) {
            data.editInfo.prize = state.general.concat(
                state.comfort
            );
            data.editInfo.prize.forEach((prize:any, index:number) => {
                if (prize.is_dzq == 2) {
                    prize.num = prize.input_num;
                } else {
                    prize.num = prize.code_num;
                }
            });
        },
        prize_update(state:any, data:any) {
            state.general.forEach((prize:any, index:number) => {
                prize.is_valid = 1;
                prize.close = false;
                prize.class = "unclose";
                prize.minnum = prize.input_num;
            });

            state.comfort.forEach((prize:any, index:number) => {
                prize.is_valid = 1;
                prize.close = false;
                prize.class = "unclose";
                prize.minnum = prize.input_num;
            });
        },
        /**
         * 更新当前奖品编辑序列号
         * @param state
         * @param index
         */
        prize_updateIndex(state:any, index: number) {
            state.index = index;
        },
        prize_updateType(state:any, type: string) {
            state.type = type;
        }
    },
    actions: {
        prize_render: {
            root: true,
            handler({ commit, dispatch, rootstate, state }:any, data:any) {
                return new Promise((resolve, reject) => {
                    commit("prize_render", data);
                    typeof resolve === "function" && resolve();
                });
            }
        },
        prize_handle: {
            root: true,
            handler({ commit, dispatch, rootstate, state }:any, data:any) {
                return new Promise((resolve, reject) => {
                    commit("prize_handle", data);
                    typeof resolve === "function" && resolve();
                });
            }
        },
        prize_update: {
            root: true,
            handler({ commit, dispatch, rootstate, state }:any, data:any) {
                return new Promise((resolve, reject) => {
                    commit("prize_update", data);
                    typeof resolve === "function" && resolve();
                });
            }
        }
    }
};
