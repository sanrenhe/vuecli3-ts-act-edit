<template>
    <!-- 基础设置 -->
    <div>
        <!-- 基础设置 -->
        <el-collapse v-model="activeNames.active">
            <el-collapse-item
                title="基础设置"
                name="base"
            >
                <!-- 活动名称 -->
                <div
                    v-if="eleFillter('act.info.title')"
                    :class="{ 'edit-active': eleActive('act.info.title')}"
                    @mouseover="eleMouseover"
                >
                    <el-row
                        type="flex"
                        class="edit-control_ele"
                    >
                        <el-col :span="6">
                            <p>活动名称：</p>
                        </el-col>
                        <el-col :span="18">
                            <el-input
                                placeholder="请输入内容"
                                size="medium"
                                maxlength="20"
                                show-word-limit
                                v-model="info.act.info.title"
                            >
                            </el-input>
                        </el-col>
                    </el-row>
                </div>
                <!-- 活动起始时间 -->
                <div
                    :class="{ 'edit-active': eleActive('act.info.start_time') || eleActive('act.info.end_time')}"
                    @mouseover="eleMouseover"
                    v-if="eleFillter('act.info.start_time')"
                >
                    <el-row
                        type="flex"
                        class="edit-control_ele"
                    >
                        <el-col :span="6">
                            <p>活动起始时间：</p>
                        </el-col>
                        <el-col :span="18">
                            <el-date-picker
                                v-model="info.act.info.start_time"
                                type="datetime"
                                placeholder="选择开始时间"
                                format="yyyy-MM-dd HH:mm:ss"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                :picker-options="pickerOptions0"
                            >
                            </el-date-picker>
                            &nbsp;至&nbsp;
                            <el-date-picker
                                v-model="info.act.info.end_time"
                                type="datetime"
                                placeholder="选择结束时间"
                                format="yyyy-MM-dd HH:mm:ss"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                :picker-options="pickerOptions1"
                            >
                            </el-date-picker>
                        </el-col>
                    </el-row>
                </div>
                <!-- 扩展设置 -->
                <slot name="set-ext">
                </slot>
                <!-- 参与人数 -->
                <el-row
                    type="flex"
                    class="edit-control_ele"
                    v-if="eleFillter('act.info.user_num.is_show')"
                >
                    <el-col :span="6">
                        <p>
                            参与人数：
                            <el-popover
                                placement="bottom"
                                width="450"
                                trigger="hover"
                                :content="popover.person"
                            >
                                <i
                                    slot="reference"
                                    class="el-icon-question"
                                ></i>
                            </el-popover>
                        </p>
                    </el-col>
                    <el-col :span="18">
                        <el-switch
                            active-text="显示"
                            inactive-text="隐藏"
                            active-value="1"
                            inactive-value="2"
                            v-model="info.act.info.user_num.is_show"
                        >
                        </el-switch>
                    </el-col>
                </el-row>
                <!-- 参与人数底数 -->
                <el-row
                    type="flex"
                    class="edit-control_ele"
                    v-if="info.act.info.user_num.is_show == '1' && eleFillter('act.info.user_num.num_base')"
                >
                    <el-col :span="6">
                        <p>参与人数底数：</p>
                    </el-col>
                    <el-col :span="18">
                        <el-input-number
                            size="small"
                            controls-position="right"
                            :min="0"
                            :max="99999"
                            v-model="info.act.info.user_num.num_base"
                            @blur="(e) => info.act.info.user_num.num_base = filterElInputNumber(info.act.info.user_num.num_base, 0)"
                        ></el-input-number>
                    </el-col>
                </el-row>
                <!-- 活动说明 -->
                <div
                    :class="{ 'edit-active': eleActive('act.info.rules')}"
                    @mouseover="eleMouseover"
                    v-if="eleFillter('act.info.rules')"
                >
                    <el-row
                        type="flex"
                        class="edit-control_ele"
                    >
                        <el-col :span="6">
                            <p>活动说明：</p>
                        </el-col>
                        <el-col :span="18">
                            <editor-part v-model="info.act.info.rules" />
                        </el-col>
                    </el-row>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Inject, Watch, Prop } from 'vue-property-decorator';
import Setting from './setting';

import EditorPart from '../parts/editor-part.vue';
import { Dictionary } from "vue-router/types/router";;

@Component({
    components: {
        EditorPart
    }
})
export default class BaseSet extends Setting {
    constructor() {
        super({ 'person': '在活动首页显示已有多少人参与，且显示人数为实际人数与虚拟人数之和', 'warn': '活动开启后已选平台不可更改' })
    }

    private pickerOptions0!: any
    private pickerOptions1!: any
    beforeCreate() {
        this.pickerOptions0 = {
            disabledDate: (time: Date) => {
                if (this.info.act.end_time != "") {
                    return time.getTime() < Date.now() - 86400000 || time.getTime() > new Date(this.info.act.end_time).getTime();
                } else {
                    return time.getTime() < Date.now() - 86400000;
                }
            }
        }
        this.pickerOptions1 = {
            disabledDate: (time: Date) => {
                return time.getTime() < new Date(this.info.act.start_time).getTime() - 86400000 || time.getTime() < Date.now() - 86400000;
            }
        }
    }
}
</script>


<style>
</style>
