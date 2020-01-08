<template>
    <div>
        <!-- 分享设置 -->
        <el-collapse
            v-model="activeNames.active"
        >
            <el-collapse-item
                title="分享设置"
                name="share"
            >
                <!-- 分享标题 -->
                <div
                    :class="{ 'edit-active': eleActive('act.info.wx_share.title')}"
                    v-if="eleFillter('act.wx_share.title')"
                    @mouseover="eleMouseover"
                >
                    <el-row
                        type="flex"
                        class="edit-control_ele"
                    >
                        <el-col :span="6">
                            <p>分享标题：</p>
                        </el-col>
                        <el-col :span="18">
                            <el-input
                                placeholder="请输入内容"
                                size="medium"
                                maxlength="25"
                                show-word-limit
                                v-model="info.act.wx_share.title"
                            ></el-input>
                        </el-col>
                    </el-row>
                </div>
                <!-- 分享描述 -->
                <div
                    :class="{ 'edit-active': eleActive('act.info.wx_share.desc')}"
                    v-if="eleFillter('act.wx_share.desc')"
                    @mouseover="eleMouseover"
                >
                    <el-row
                        type="flex"
                        class="edit-control_ele"
                    >
                        <el-col :span="6">
                            <p>分享描述：</p>
                        </el-col>
                        <el-col :span="18">
                            <el-input
                                placeholder="请输入内容"
                                size="medium"
                                maxlength="30"
                                show-word-limit
                                type="textarea"
                                v-model="info.act.wx_share.desc"
                            ></el-input>
                        </el-col>
                    </el-row>
                </div>
                <!-- 分享缩略图 -->
                <div
                    :class="{ 'edit-active': eleActive('act.info.wx_share.img')}"
                    v-if="eleFillter('act.wx_share.img')"
                    @mouseover="eleMouseover"
                >
                    <el-row
                        type="flex"
                        class="edit-control_ele"
                        v-if="editEleBlackList.indexOf('share_pic') == -1"
                    >
                        <el-col :span="6">
                            <p>分享缩略图：</p>
                        </el-col>
                        <el-col :span="18">
                            <!-- 图片选择组件 -->
                            <image-part
                                errTip="分享缩略图片大小不能超过500K"
                                imgSize="500"
                                v-model="info.act.wx_share.img"
                            >
                                <template #tip>
                                    <div class="edit-img_tip">建议尺寸 200*200，大小不能超过500K</div>
                                </template>
                            </image-part>
                        </el-col>
                    </el-row>
                </div>
                <!-- 扩展设置 -->
                <slot name="set-ext">
                </slot>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator';
import Setting from './setting';
import imagePart from '../parts/image-part.vue'

@Component({
    components: {
        imagePart
    }
})
export default class ShareSet extends Setting {
    constructor() {
        super({})
    }
}

</script>


<style>
</style>
