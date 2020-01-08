<template>
    <div>
        <head-bar>
            <template #menu-ext>
                <el-menu
                    mode="horizontal"
                    class="edit-view_menu_top"
                    :default-active="filterPagePath(editPagePath.path)"
                    @select="menuSelect"
                >
                    <el-menu-item v-for="path in editPagePath.pathArr" :key="path.title" :index="filterPagePath(path.path)">{{path.title}}</el-menu-item>
                </el-menu>
            </template>
        </head-bar>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Provide, Watch } from 'vue-property-decorator';
import { Getter } from 'vuex-class';
import { Dictionary } from 'vue-router/types/router';
import HeadBar from '@base/components/bars/head-bar.vue';

@Component({
    components: {
        HeadBar
    }
})
export default class P_TOP extends Vue {
    @Getter public editPagePath!: Dictionary<any>;
}

</script>


<style>
</style>
