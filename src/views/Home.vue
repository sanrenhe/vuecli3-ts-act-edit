<template>
    <div class="home">
        <el-button
            type="primary"
            @click="avUpdate"
        >更新数据</el-button>
        <el-button
            type="success"
            @click="avGet"
        >获取数据</el-button>
        <el-button
            type="warning"
            @click="avCreate"
        >新建数据</el-button>
        <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="data"
            disabled
        >
        </el-input>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Provide, Watch } from 'vue-property-decorator';
import { Dictionary } from "vue-router/types/router";
import { Message } from "element-ui";
import $ from 'jquery'

import AV from 'leancloud-storage';

@Component
export default class Home extends Vue {
    private data: string = '';

    created() {
        this.avInit();
        this.getDefalutData();
    }

    // 获取默认数据
    public getDefalutData() {
        $.getJSON('https://raw.githubusercontent.com/sanrenhe/sanrenhe/master/data.json', function (result1) {
            console.log(result1);
        });
    }

    // leancloud-初始化
    public avInit() {
        AV.init({
            appId: "TBk0Vh6PATq4y8t7Mnl0FSkP-gzGzoHsz",
            appKey: "4jfp4zUMcMMMmUhMfzLaNNlm",
            serverURLs: "https://tbk0vh6p.lc-cn-n1-shared.com"
        });
    }

    // leancloud-新建对象
    public avCreate() {
        let DataObject = AV.Object.extend('ActEditData');
        let dataObject = new DataObject();
        dataObject.set('type', 'turntable');
        dataObject.save().then((res: Dictionary<any>) => {
             Message({
                showClose: true,
                message: '新建成功',
                type: "success"
            });
        });
    }

    // leancloud-更新对象
    public avUpdate() {
        let TestObject = AV.Object.createWithoutData('ActEditData', '5e15457f21460d006a625edb');
        TestObject.set('data', '');
        TestObject.save().then(() => {
            Message({
                showClose: true,
                message: '更新成功',
                type: "success"
            });
        });
    }

    // leancloud-获取对象
    public avGet() {
        let query = new AV.Query('TestObject');
        query.get('5e0af40921460d006a0a461a').then((todo: Dictionary<any>) => {
			this.data = JSON.stringify(todo._serverData);
			Message({
                showClose: true,
                message: '获取成功',
                type: "info"
            });
        });
    }
}
</script>
