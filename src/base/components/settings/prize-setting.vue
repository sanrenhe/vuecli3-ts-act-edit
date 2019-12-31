<template>
    <div>
        <el-tabs
            :stretch="true"
            v-model="appData.prize.type"
            @click="prizeTypeChange"
        >
            <!-- 普通奖品 -->
            <el-tab-pane
                label="普通奖品"
                name="general"
                data-set="general"
            >
                <!-- 顶部设置区 -->
                <el-row
                    type="flex"
                    class="edit-control_ele"
                >
                    <!-- 中奖概率设置 -->
                    <template v-if="eleFillter('prize.probability_num', false)">
                        <!-- 当前概率显示 -->
                        <el-col
                            :span="6"
                            class="edit-title_long"
                        >
                            <p>当前中奖总概率：<em
                                    :class="{ 'over': totalPercent > maxPercentSet}"
                                    class="edit-control_ele_percent"
                                >{{totalPercent}}</em><em class="edit-control_ele_percent_icon">{{percentIcon}}</em></p>
                        </el-col>
                        <!-- 概率选择 -->
                        <el-col :span="8">
                            <el-select
                                @change="choosePercent"
                                style="width: 200px;margin-left: 20px;"
                                v-model="info.draw.probability"
                                placeholder="请选择"
                            >
                                <el-option
                                    v-for="item in percentOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                >
                                </el-option>
                            </el-select>
                        </el-col>
                    </template>
                    <!-- 兼容右侧钱包余额样式 -->
                    <template v-else>
                        <el-col :span="6"></el-col>
                        <el-col :span="8"></el-col>
                    </template>
                    <!-- 兼容右侧钱包余额样式 -->
                    <template v-if="appData.prize.type == 'comfort'">
                        <el-col :span="6"></el-col>
                        <el-col :span="8"></el-col>
                    </template>
                    <!-- 钱包余额/金额显示 -->
                    <el-col
                        :span="10"
                        class="edit-wallet_info"
                        v-if="walletShow"
                        v-loading="updateWallet"
                    >
                        <el-row type="flex">
                            <el-col
                                style="max-width: unset"
                                :span="12"
                            >
                                <div class="edit-wallet_info_box edit-wallet_info_text"><em>本次使用金额</em><span>/</span><em>活动可用余额</em></div>
                                <div class="edit-wallet_info_box edit-wallet_info_money"><em>{{walletInfo.activityCurrentMoney}}</em><span>/</span><em>{{walletInfo.activityRemainMoney}}</em></div>
                            </el-col>
                            <el-col :span="12">
                                <div class="edit-wallet_info_box edit-wallet_info_text"><em>本次使用金额</em><span>/</span><em>钱包余额</em></div>
                                <div class="edit-wallet_info_box edit-wallet_info_money"><em>{{walletInfo.subjectCurrentMoney}}</em><span>/</span><em>{{walletInfo.subjectRemainMoney}}</em></div>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <!-- 奖品编辑 -->
                <el-tabs
                    @tab-click="prizeTabChange"
                    v-model="generalTabValue"
                    type="card"
                    editable
                    @edit="handleAwardTabsEdit"
                    class="tabs-sort edit-set_tab"
                >
                    <el-tab-pane
                        style="padding:0px 5px;"
                        v-for="(item, index) in generalTabs"
                        :key="item.id"
                        :label="item.name || '奖品'"
                        :name="item.seq"
                        :closable="item.close"
                        :data-set="index"
                    >
                        <span
                            v-if="item.status != 1"
                            class="edit-control_prizeStatus"
                            slot="label"
                        >{{item.name}}
                            <el-tooltip
                                :hide-after="1000"
                                class="item"
                                effect="light"
                                content="奖品已关闭"
                                placement="top-start"
                            >
                                <em><a class="edit-control_statusIcon"><i class="el-icon-prize-close"></i></a></em>
                            </el-tooltip>
                        </span>
                        <prize-part
                            :prize="item"
                            :index="index"
                            :typeOptions="info.prizesType"
                            type="general"
                        >
                            <template v-slot:part-ext="slotProps">
                                <!-- 中奖概率 -->
                                <el-row
                                    type="flex"
                                    class="edit-control_ele"
                                    v-if="eleFillter('prize.probability_num', false)"
                                >
                                    <el-col :span="6">
                                        <p>中奖概率：</p>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-input-number
                                            @change="(val, oldVal) => { return countPercent(val, oldVal, slotProps.prize) }"
                                            size="medium"
                                            v-model="slotProps.prize.probability_num"
                                            :min="0"
                                            :max="slotProps.prize.maxPercentSet"
                                            label="中奖概率"
                                            @blur="percentBlur"
                                        ></el-input-number>
                                        <em v-if="info.draw.probability == 1"> %</em>
                                        <em v-if="info.draw.probability == 2"> ‰</em>
                                        <em v-if="info.draw.probability == 3"> ‱</em>
                                    </el-col>
                                </el-row>
                                <!-- 扩展设置 -->
                                <slot
                                    name="prizepart-ext"
                                    :prize="slotProps.prize"
                                >
                                </slot>
                            </template>
                            <template v-slot:limit-ext="slotProps">
                                <slot
                                    name="prizelimit-ext"
                                    :prize="slotProps.prize"
                                >
                                </slot>
                            </template>
                        </prize-part>
                    </el-tab-pane>
                </el-tabs>
            </el-tab-pane>
            <!-- 安慰奖 -->
            <el-tab-pane
                label="安慰奖"
                name="comfort"
                data-set="comfort"
                v-if="tabType.indexOf('comfort') != -1"
            >
                <!-- 中奖概率设置 -->
                <el-row
                    type="flex"
                    class="edit-control_ele"
                >
                    <el-col :span="6"></el-col>
                    <el-col :span="8"></el-col>
                    <!-- 钱包余额/金额显示 -->
                    <el-col
                        :span="10"
                        class="edit-wallet_info"
                        v-if="walletShow"
                    >
                        <el-row type="flex">
                            <el-col
                                style="max-width: unset;"
                                :span="12"
                            >
                                <div class="edit-wallet_info_box edit-wallet_info_text"><em>本次使用金额</em><span>/</span><em>活动可用余额</em></div>
                                <div class="edit-wallet_info_box edit-wallet_info_money"><em>{{walletInfo.activityCurrentMoney}}</em><span>/</span><em>{{walletInfo.activityRemainMoney}}</em></div>
                            </el-col>
                            <el-col :span="12">
                                <div class="edit-wallet_info_box edit-wallet_info_text"><em>本次使用金额</em><span>/</span><em>钱包余额</em></div>
                                <div class="edit-wallet_info_box edit-wallet_info_money"><em>{{walletInfo.subjectCurrentMoney}}</em><span>/</span><em>{{walletInfo.subjectRemainMoney}}</em></div>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <el-tabs
                    @tab-click="prizeTabChange"
                    v-model="comfortTabValue"
                    type="card"
                    editable
                    @edit="handleAwardTabsEdit"
                    class="tabs-sort edit-set_tab"
                >
                    <el-tab-pane
                        style="padding:0px 5px;"
                        :key="item.id"
                        v-for="(item, index) in comfortTabs"
                        :data-set="index"
                        :label="item.name || '奖品'"
                        :name="item.seq"
                        :closable="item.close"
                    >
                        <span
                            v-if="item.status != 1"
                            class="edit-control_prizeStatus"
                            slot="label"
                        >{{item.title}}
                            <el-tooltip
                                :hide-after="1000"
                                class="item"
                                effect="light"
                                content="奖品已关闭"
                                placement="top-start"
                            >
                                <em><a class="edit-control_statusIcon"><i class="el-icon-prize-close"></i></a></em>
                            </el-tooltip>
                        </span>
                        <prize-part
                            @countPercent="countPercent"
                            :prize="item"
                            :index="index + generalTabs.length"
                            :typeOptions="info.prizesType"
                            type="comfort"
                        ></prize-part>
                    </el-tab-pane>
                </el-tabs>
                <div
                    class="edit-control_handleTip"
                    v-if="comfortTabs.length == 0"
                >
                    <img
                        class="edit-control_handleLine"
                        src="../../assets/img/prize-line.png"
                        alt=""
                    >
                    <div class="edit-control_handleGift">
                        <p class="edit-control_handleText">点击“+”以添加安慰奖奖品</p>
                        <img
                            src="../../assets/img/prize-null.png"
                            alt=""
                        >
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Inject, Prop, Watch } from 'vue-property-decorator';
import { Dictionary } from "vue-router/types/router";;
import { State, Getter, Action, Mutation, namespace } from 'vuex-class'
import { listenMessage, MessageData, MessageType } from '../../message';
import Setting from './setting';
import Sortable from 'sortablejs';      // tab签拖动变换位置插件

// 奖品编辑模块
import prizePart from '../parts/prize-part.vue';
// 奖品vuex模块
const prizeModule = namespace('prize');

@Component({
    components: {
        prizePart
    },
    watch: {
        'appData.prize.index': {
            handler: function () {
                if (this.appData.prize.type == 'general') {
                    this.generalTabValue = this.appData.prize.general[this.appData.prize.index].seq;
                    this.generalIndex = this.appData.prize.index;
                } else {
                    this.comfortTabValue = this.appData.prize.comfort[this.appData.prize.index].seq;
                    this.comfortIndex = this.appData.prize.index;
                }
            }
        }
    }
})
export default class PrizeSet extends Setting {
    constructor() {
        super({ 'warn': '活动开启后不可更改' })
    }
    @State('appData') appData!: Dictionary<any>
    @prizeModule.Mutation('prize_updateIndex') prize_updateIndex!: Function
    @prizeModule.Mutation('prize_updateType') prize_updateType!: Function
    @prizeModule.Mutation('prize_handle') prize_handle!: Function
    @Action('getWallet') getWallet!: Function
    @Getter public walletInfo!: Dictionary<any>
    @Mutation updateEditInfoStatus!: Function

    @Inject() debounce!: Function
    @Inject() onDataChange!: Function

    @Prop({
        type: Array,
        default: () => {
            return ['general']
        }
    })
    tabType!: string[]

    private defaultPrizeData = {
        id: 0, // 奖品id
        jackpot: '1', // '1-默认奖池 2-安慰奖奖池(1)',
        is_valid: 2, // '是否有效 1-有效 2-无效 (系统添加置2-无效 用户主动保存后置1-有效禁止删除 )',
        short_name: '', // '奖品简称',
        name: '', // '奖品名称',
        type: '', // '奖品类型
        generic_code: '', // '通用码',
        num: 0, // '奖品数量(只能增加不能少于上次保存值)(100)',
        minnum: 0, // 默认最少奖品数量
        money: '0.00', // '奖品价值(9.99)',
        probability_num: 0, // '中奖概率(整数根据当前概率模式变限制)',
        pic_url: '', // 'type=file',
        desc: '', // '奖品说明(样例)',
        maxPercentSet: 0, // 可设置最大中奖概率
        use_url: '', // 线上消费地址
        prize_max_win_num: 0, // 奖品每天最大中奖次数
        prize_person_max_win_num: 1, // 每人最大中奖次数
        prize_person_day_max_win_num: 1, // 每人每天中奖次数
        status: 1, // 奖品开启状态 1-开启 2-关闭 关闭的奖品不计算奖品概率,转盘、活动介绍、我的奖品不显示
        is_dzq: '2', // 是否导入电子券 1-导，2-不导
        code_num: 0, // 券码数量
        input_num: 0, // 非券码数量
    }

    private generalTabs: Dictionary<any> = []
    private generalIndex: number = 0 //当前普通奖品编辑序列号
    private generalTabValue: string = ''
    private generalNextIndex!: number

    private comfortTabs: Dictionary<any> = []
    private comfortIndex: number = 0 //当前普通奖品编辑序列号
    private comfortTabValue: string = ''
    private comfortNextIndex!: number

    private percentOptions = [{
        value: 1,
        label: '百分率'
    },
    {
        value: 2,
        label: '千分率'
    },
    {
        value: 3,
        label: '万分率'
    }
    ]
    private maxPercentSet: number = 0
    private totalPercent: number = 0
    private menuSelect!: Function
    private percentIcon: string = ''
    private walletShow: boolean = false;

    private preGeneral: any = []
    private preComfort: any = []

    private isFirst: boolean = false
    private updateWallet: boolean = false

    mounted() {
        this.generalTabs = this.appData.prize.general; // 普通奖品
        this.generalTabValue = this.appData.prize.general.length == 0 ? '' : this.appData.prize.general[this.appData.prize.index].seq; // 当前普通奖品编辑tab值
        this.generalNextIndex = this.appData.prize.general.length // 添加普通奖品-序列号

        this.comfortTabs = this.appData.prize.comfort
        this.comfortTabValue = this.appData.prize.comfort.length == 0 ? '' : this.appData.prize.comfort[this.appData.prize.index].seq
        this.comfortNextIndex = this.appData.prize.comfort.length

        this.storePreData(this.generalTabs, 'general');
        this.storePreData(this.comfortTabs, 'comfort');

        this.$nextTick(() => {
            // 设置最大中奖概率
            if (this.info.draw && this.info.draw.probability) {
                if (this.info.draw.probability == 1) {
                    this.maxPercentSet = 100;
                    this.percentIcon = '%'
                } else if (this.info.draw.probability == 2) {
                    this.maxPercentSet = 1000;
                    this.percentIcon = '‰'
                } else {
                    this.maxPercentSet = 10000;
                    this.percentIcon = '‱'
                }
            }

            // 计算总中奖概率
            this.generalTabs.forEach((tab: Dictionary<any>, index: number) => {
                if (tab.status == 1) {
                    this.totalPercent += tab.probability_num;
                }
            })

            // 初始化每个奖品还可设置最大中奖概率值
            this.generalTabs.forEach((tab: Dictionary<any>, index: number) => {
                tab.maxPercentSet = tab.probability_num + this.maxPercentSet - this.totalPercent;
            })

            let el = document.querySelectorAll('.tabs-sort .el-tabs__nav')[0];
            let sortable = Sortable.create(el as HTMLElement, {
                onEnd: (evt: Dictionary<any>) => {
                    const tempIndex = this.generalTabs.splice(evt.oldIndex, 1)[0];
                    this.generalTabs.splice(evt.newIndex, 0, tempIndex);
                }
            })

            // 更新奖品列表
            this.updatePrizeTabs(this.generalTabs, 'general');
            this.updatePrizeTabs(this.comfortTabs, 'comfort');

            // 监听奖品数据
            this.$watch('generalTabs', (tab, type) => { return this.watchPrizeTabs(this.generalTabs, 'general') }, { deep: true });
            this.$watch('comfortTabs', (tab, type) => { return this.watchPrizeTabs(this.comfortTabs, 'comfort') }, { deep: true });
        })
    }

    public updatePrizeTabs(prize: Dictionary<any>, type: string) {
        window.setTimeout(() => {
            let isWallet = false;
            let isCount = false;
            prize.forEach((tab: Dictionary<any>, index: number) => {
                // 判断该奖品是否可删除
                if (!tab.close) {
                    if (type == 'general') {
                        $('#pane-general').find('#tab-' + tab.tabIndex).find('span.el-icon-close').eq(0).hide();
                    } else {
                        $('#pane-comfort').find('#tab-' + tab.tabIndex).find('span.el-icon-close').eq(0).hide();
                    }
                }
                if (tab.type == 'money') {
                    this.walletShow = true;
                    isWallet = true;
                    let tabs = type == 'general' ? this.preGeneral : this.preComfort;
                    if (tab.input_num != tabs[index].input_num || tab.money != tabs[index].money || tab.type != tabs[index].type || tab.minnum != tabs[index].minnum) {
                        isCount = true;
                    }
                }
                if (index == prize.length - 1 && !isWallet) {
                    this.walletShow = false;
                }
            })
            this.prize_handle(this.appData);
            this.storePreData(prize, type);
            if (isCount || !this.isFirst) {
                this.countMoney();
            }
            this.isFirst = true;
        }, 500)
    }

    public watchPrizeTabs(prize: Dictionary<any>, type: string) {
        this.updatePrizeTabs(prize, type);
        // 传递消息
        this.onDataChange(MessageType.update);
        // 更改编辑数据状态
        this.updateEditInfoStatus(1);
    }

    countMoney = this.debounce(function () {
        if (!this.walletShow) return false;

        let prizeMoney = 0;
        let prize = this.generalTabs.concat(this.comfortTabs);
        prize.forEach((tab: Dictionary<any>, index: number) => {
            if (tab.type == 'money' && tab.status == 1) { // 开启的红包奖品
                prizeMoney += tab.input_num * tab.money;
            }
        })
        this.updateWallet = true;
        this.getWallet(prizeMoney).then(() => {
            this.updateWallet = false;
        })
    }, 1000)

    public storePreData(tabs: any, type: string) {
        if (type == 'general') {
            this.preGeneral = [];
        } else {
            this.preComfort = [];
        }
        tabs.forEach((tab: Dictionary<any>, index: number) => {
            if (type == 'general') {
                this.preGeneral.push({ id: tab.id, input_num: tab.input_num, money: tab.money, type: tab.type, minnum: tab.minnum });
            } else {
                this.preComfort.push({ id: tab.id, input_num: tab.input_num, money: tab.money, type: tab.type, minnum: tab.minnum });
            }
        })
    }

    // 计算总中奖概率
    public countPercent(val: number, oldVal: number, prize: Dictionary<any>) {
        if (prize.status == 1) {
            val = val == undefined ? 0 : val;
            oldVal = oldVal == undefined ? 0 : oldVal;
            val = val > prize.maxPercentSet ? prize.maxPercentSet : val;
            prize.probability_num = val;
            this.totalPercent = this.totalPercent + (val - oldVal);

            this.generalTabs.forEach((tab: Dictionary<any>, index: number) => {
                tab.maxPercentSet = tab.probability_num + (this.maxPercentSet - this.totalPercent);
            })
        }
    }

    // 奖品切换
    public prizeTabChange(tab: Dictionary<any>) {
        let index = tab.$attrs['data-set'];
        if (this.appData.prize.type == 'general') {
            this.generalIndex = index
        } else {
            this.comfortIndex = index
        }
        this.prize_updateIndex(index);
        this.menuSelect('/e/actId/detail/prizeId');
    }

    // 奖品类型切换
    public prizeTypeChange(tab: Dictionary<any>) {
        let type = tab.$attrs['data-set'];
        this.appData.prize.type = type;
    }

    // 选择中奖概率
    public choosePercent(val: number) {
        if (val == 1) {
            this.maxPercentSet = 100;
            this.percentIcon = '%'
        } else if (val == 2) {
            this.maxPercentSet = 1000;
            this.percentIcon = '‰'
        } else if (val == 3) {
            this.maxPercentSet = 10000;
            this.percentIcon = '‱'
        }

        this.generalTabs.forEach((tab: Dictionary<any>, index: number) => {
            tab.maxPercentSet = tab.probability_num + this.maxPercentSet - this.totalPercent;
        })
    }

    // 奖品操作
    public handleAwardTabsEdit(targetName: string, action: string) {
        let jackpot = this.appData.prize.type == 'general' ? '1' : '2';
        let tabs = this.appData.prize.type == 'general' ? this.generalTabs : this.comfortTabs;
        let tabValue = this.appData.prize.type == 'general' ? this.generalTabValue : this.comfortTabValue;

        if (action === 'add') {
            let nextIndex = tabs.length + 1;
            let nextTabName = this.appData.prize.type == 'general' ? (++this.generalNextIndex).toString() : (++this.comfortNextIndex).toString();

            this.$http.post(this.apiList.addPrizeUrl, { jackpot: jackpot }).then((res: Dictionary<any>) => {
                if (res.status == 'success') {
                    let obj = $.extend({}, this.defaultPrizeData, res.data);
                    obj.title = (this.appData.prize.type == 'general' ? '奖品' : '安慰奖');
                    obj.name = (this.appData.prize.type == 'general' ? '奖品' : '安慰奖');
                    obj.tabIndex = this.generalNextIndex;
                    obj.seq = nextTabName;
                    obj.close = true;
                    obj.changeIndex = 0;

                    tabs.push(obj);
                    this.appData.prize.type == 'general' ? (this.generalTabValue = nextTabName) : (this.comfortTabValue = nextTabName);

                    if (this.appData.prize.type == 'general') {
                        tabs.forEach((tab: Dictionary<any>, index: number) => {
                            tab.maxPercentSet = tab.probability_num + this.maxPercentSet - this.totalPercent;
                        })
                    }

                    this.resetTabIndex(tabs);
                } else {
                    this.$message({
                        message: res.message,
                        type: 'warning'
                    })
                }
            })
        }
        if (action === 'remove') {
            let prizeId = '';
            tabs.forEach((tab: Dictionary<any>, index: number) => {
                if (tab.seq == targetName) {
                    prizeId = tab.id;
                }
            })

            this.$http.post(this.apiList.delPrizeUrl, { prizeId: prizeId }).then((res: Dictionary<any>) => {
                if (res.status == 'success') {
                    this.$message(res.message);
                    if (tabValue == targetName) {
                        tabs.forEach((tab: Dictionary<any>, index: number) => {
                            if (tab.seq == targetName) {
                                let nextTab = tabs[index + 1] || tabs[index - 1]
                                if (nextTab) {
                                    this.appData.prize.type == 'general' ? (this.generalTabValue = nextTab.seq) : (this.comfortTabValue = nextTab.seq);
                                }
                            }
                        })
                    }

                    tabs.forEach((prize: Dictionary<any>, index: number) => {
                        if (prize.seq == targetName) {
                            tabs.splice(index, 1)
                        }
                    })

                    tabs.forEach((prize: Dictionary<any>, index: number) => {
                        prize.title = (this.appData.prize.type == 'general' ? '奖品' : '安慰奖') + (index + 1)
                    })

                    if (this.appData.prize.type == 'general') {
                        this.totalPercent = 0;
                        tabs.forEach((tab: Dictionary<any>, index: number) => {
                            if (tab.status == 1) {
                                this.totalPercent += tab.probability_num
                            }
                        })

                        tabs.forEach((tab: Dictionary<any>, index: number) => {
                            if (tab.status == 1) {
                                tab.maxPercentSet = tab.probability_num + this.maxPercentSet - this.totalPercent;
                            }
                        })
                    }

                    this.resetTabIndex(tabs);
                } else {
                    this.$message({
                        message: res.message,
                        type: 'warning'
                    });
                }
            })
        }
    }

    public resetTabIndex(tabs: Dictionary<any>) {
        tabs.forEach((tab: Dictionary<any>, index: number) => {
            if (!tab.close) {
                $('#pane-general').find('#tab-' + (index + 1)).find('span.el-icon-close').eq(0).hide();
                $('#pane-comfort').find('#tab-' + (index + 1)).find('span.el-icon-close').eq(0).hide();
            }
        })

        let prizeIndex = tabs.length - 1 < 0 ? 0 : tabs.length - 1
        if (this.appData.prize.type == 'general') {
            this.generalIndex = prizeIndex;
        } else {
            this.comfortIndex = prizeIndex;
        }

        this.prize_updateIndex(prizeIndex);
    }

    public percentBlur(e: any) {
        let el = e.target;
        if ($(el).val() == '') {
            $(el).val(0)
        }
    }
}
</script>


<style lang="scss" scoped>
.over {
    color: red !important;
}

.edit-control_ele_percent_icon {
    font-size: 16px;
    padding-left: 10px;
}

.edit-wallet_info {
    text-align: center;
    margin-top: -14px;

    .edit-wallet_info_text {
        font-weight: bold;
        display: flex;
        justify-content: space-around;
        background: #f5f5f5;
        border-right: 1px solid #ddd;

        em {
            display: block;
            width: 47%;
        }

        em:first-child {
            text-align: right;
        }

        em:last-child {
            text-align: left;
        }

        span {
            display: block;
            width: 3%;
        }
    }

    .edit-wallet_info_money {
        em:first-child {
            color: #ff4e1f;
            font-size: 26px;
        }

        em:last-child {
            text-align: left;
            font-size: 16px;
        }
    }
}
</style>
