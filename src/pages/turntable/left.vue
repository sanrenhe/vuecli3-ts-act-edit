<template>
    <el-aside class="edit-view_main">
        <el-row
            type="flex"
            justify="space-between"
        >
            <el-col :span="22">
                <div class="edit-view_main_header">
                    <p>{{info.act.info.title}}</p>
                </div>
                <div class="activity-view">
                    <iframe
                        style="width: 100%;height: 620px;"
                        :src="viewSrc"
                        frameborder="0"
                        id="view"
                        v-show="editPagePath.path != 'share'"
                    ></iframe>
                    <share-bar v-show="editPagePath.path == 'share'" />
                    <div class="activity-editWrap">
                        <uiwrap-bar />
                    </div>
                </div>
            </el-col>
            <el-col :span="2">
                <el-menu
                    collapse
                    class="edit-view_menu_right"
                    :default-active="filterPagePath(editPagePath.path)"
                    @select="menuSelect"
                >
                    <el-menu-item v-for="(path, index) in editPagePath.pathArr" :key="path.title" :index="filterPagePath(path.path)">{{index + 1}}</el-menu-item>
                </el-menu>
            </el-col>
        </el-row>
    </el-aside>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Getter } from 'vuex-class';
import { Dictionary } from 'vue-router/types/router';
import uiwrapBar from '@base/components/bars/uiwrap-bar.vue';
import shareBar from '@base/components/bars/share-bar.vue'

@Component({
    components: {
        uiwrapBar,
        shareBar
    }
})
export default class P_LEFT extends Vue {
    @Getter public info!: Dictionary<any>;
    @Getter public editPagePath!: Dictionary<any>;

    @Prop(String)
    viewSrc!: string
}

</script>


<style>
</style>
