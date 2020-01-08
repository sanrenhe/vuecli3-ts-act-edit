import Vue from 'vue'
import App from './App.vue'
import router from './router'

// vuex数据
import store from "@base/store";
// elementui
import "./plugins/element-ui";
// axios post get uploadFile
import "./plugins/axios";
// iframe消息通讯
import "./plugins/message";
// 编辑区基础样式
import "@base/assets/edit.scss";
// 编辑去自定义样式
import "./assets/style.scss";
// 元素对应表
import { TapMessage } from "./views/tapLink";
// v-blank
import "@base/directive";
// 消息传递
import { MessageData, MessageType } from '@base/message';
//
import { debounce } from '@base/utils/other.js';

Vue.config.productionTip = false

// mixin方法
Vue.mixin({
  data: () => {
      return {};
  },
  computed: {
      mixin() {
        return {
          actId: this.$route.params.actId
        }
      }
  },
  methods: {
      eleFillter(path, test) {
          // let testExist = test == undefined ? true : test;
          // let isShow = testExist ? (isExistKey(this.info, path) && this.editEleBlackList.indexOf(path) == -1) : (this.editEleBlackList.indexOf(path) == -1);
          let isShow = this.editEleBlackList.indexOf(path) == -1;
          return isShow;
      },
      eleEditFillter(name) {
          let ship = new TapMessage(name);
          return ship;
      },
      eleActive(path) {
          return this.activeEdit.path == path;
      },
      eleMouseover(event: any) {
          var el = event.currentTarget;
          if ($(el).hasClass("edit-active")) {
              this.$store.commit("updateEditWrapper", { path: "" });
          }
      },
      menuSelect(path, keyPath) {
          let pagePath = (<any>this).handlPagePath(path);
          this.$store.commit('resetUiWrapper');
          this.$store.commit('updateEditPagePath', {path: pagePath});
          MessageData.postMessage(MessageType.edit, {url: pagePath});
      },
      filterPagePath(path) {
          let pagePath = (<any>this).handlPagePath(path);
          return pagePath;
      },
      handlPagePath(path) {
          let isPrize = path.search("prizeId");
          let pagePath = "";
          pagePath = path.replace("actId", this.$route.params.actId);
          if (isPrize != -1) {
              let showPrize;
              if (
                  this.$store.state.appData.award[
                      this.$store.state.appData.award.type
                  ].length == 0
              ) {
                  showPrize = this.$store.state.appData.award["general_1"][0];
              } else {
                  showPrize = this.$store.state.appData.award[
                      this.$store.state.appData.award.type
                  ][this.$store.state.appData.award.index];
              }
              let prize = showPrize;
              pagePath = pagePath.replace("prizeId", prize.id);
          }
          return pagePath;
      },
      //添加beforeunload监听事件
      createBeforeunloadHandler() {
          window.addEventListener(
              "beforeunload",
              beforeunloadHandler,
              false
          );
      },
      //移除beforeunload事件
      destroyedBeforeunloadHandler(url) {
          window.removeEventListener(
              "beforeunload",
              beforeunloadHandler,
              false
          );
          if (url) {
              let a = document.createElement("a");
              a.href = url;
              a.click();
          }
      },
      // 过滤el-input-number无效数据
      filterElInputNumber(val, defaultVal) {
          val = val == undefined ? defaultVal : val;
          return val;
      }
  }
});

/**
* 关闭浏览器提示
*/
function beforeunloadHandler(e: any) {
  e.returnValue = "确定要关闭窗口吗？";
}

new Vue({
  router,
  store,
  render: h => h(App),
  provide: {
      debounce
  }
}).$mount("#app");
