<template>
    <el-container class="edit-control_main">
        <el-main>
            <el-tabs
                v-model="activeEdit.tab"
                type="border-card"
                class="edit-control_tab"
            >
                <el-tab-pane
                    label="基础设置"
                    name="base"
                >
                    <!-- 基础设置 -->
                    <base-set/>
                    <!-- 分享设置 -->
                    <share-set />
                </el-tab-pane>
                <el-tab-pane
                    label="奖品设置"
                    name="award"
                >
                    <!-- 奖品设置 -->
                    <award-set/>
                </el-tab-pane>
                <el-tab-pane
                    label="高级设置"
                    name="senior"
                >
                    <!-- logo设置 -->
                    <logo-set/>
                    <!-- 广告设置 -->
                    <advert-set :adOptions="advertOptions"/>
                </el-tab-pane>
            </el-tabs>
        </el-main>
    </el-container>
</template>

<script lang="ts">
import { Component, Vue, Provide, Watch } from 'vue-property-decorator';
import { Action, Getter, Mutation, State } from 'vuex-class'
import { Dictionary } from 'vue-router/types/router'

import baseSet from '@base/components/settings/base-setting.vue';
import shareSet from '@base/components/settings/share-setting.vue';
import awardSet from '@base/components/settings/award-setting.vue';
import logoSet from '@base/components/settings/logo-setting.vue';
import advertSet from '@base/components/settings/advert-setting.vue';

@Component({
    components: {
        baseSet,
        shareSet,
        awardSet,
        logoSet,
        advertSet
    }
})
export default class P_RIGHT extends Vue {
    @Getter public info!: Dictionary<any>
    @Getter public activeEdit!: Dictionary<any>

    private advertOptions: any = [
        { value: 1, label: '首页顶部', disabled: false },
        { value: 2, label: '首页底部', disabled: false },
        { value: 3, label: '我的奖品顶部', disabled: false },
        { value: 4, label: '我的奖品底部', disabled: false },
        { value: 5, label: '奖品详情页顶部', disabled: false },
        { value: 6, label: '奖品详情页底部', disabled: false },
    ]
}

</script>


<style>
</style>
