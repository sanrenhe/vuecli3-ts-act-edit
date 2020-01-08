<template>
    <div
        v-loading="!isShow"
        element-loading-text="加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        class="edit-page"
        style="height: 100vh;"
    >
        <el-container
            v-loading="loading"
            element-loading-text="加载中..."
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            v-if="isShow"
            class="edit-container"
        >
            <el-header class="edit-header">
                <p-top />
            </el-header>
            <el-container class="edit-wrap">
                <p-left :viewSrc="viewSrc" />
                <p-right />
            </el-container>
        </el-container>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Provide, Watch } from 'vue-property-decorator';
import { Action, Getter, Mutation, State } from 'vuex-class'
import { Dictionary } from 'vue-router/types/router'
import store from './store'

import pTop from '@/pages/turntable/top.vue';
import pLeft from '@/pages/turntable/left.vue';
import pRight from '@/pages/turntable/right.vue';

import { listenMessage, MessageData, MessageType } from '@base/message';

@Component({
    components: {
        pTop,
        pLeft,
        pRight
    },
})
export default class Home extends Vue {
    @Getter public info!: Dictionary<any>
    @Getter public activeEdit!: Dictionary<any>
    @Getter private isShow!: boolean
    @Getter private loading!: number
    @Action getData!: Function
    @Mutation updateUiWrapper!: Function
    @Mutation updateScrollUiWrapper!: Function
    @Mutation updateEditInfoStatus!: Function

    private viewSrc = ''
    private createBeforeunloadHandler!: Function
    private isFisrtLoad = true;

    mounted() {
        this.createBeforeunloadHandler();
    }

    beforeCreate() {
        // 动态注册活动store
        this.$store.registerModule(['appData', 'actSet'], store);
    }
    created() {
        this.getData('turntable').then(() => {
            this.viewSrc = this.$route.query.view as string;
            this.$watch('info', (type) => { return this.onDataChange(MessageType.update) }, { deep: true });
        })

        listenMessage((res, e) => {
            if (res.type == MessageType.empty) {
                this.onDataChange(MessageType.init)
            } else if (res.type == MessageType.tapHover || res.type == MessageType.tapClick) {
                res.data.ele = this.eleEditFillter(res.data.name);
                this.updateUiWrapper(res.data);
            } else if (res.type == MessageType.tapScroll) {
                this.updateScrollUiWrapper(res.data);
            }
        })
    }

    @Provide()
    public onDataChange(type: MessageType) {
        if (type ==  MessageType.update && !this.isFisrtLoad) {
            this.updateEditInfoStatus(1);
        }
        if (this.isFisrtLoad) {
            this.isFisrtLoad = false;
        }
        let data = {
            activity: this.info.act,
            advert: this.info.advert,
            prize: this.info.prize
        }
        MessageData.postMessage(type, data)
    }
}
</script>
