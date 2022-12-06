<template>
  <div>
    <canvas id="canvas" />
    <Joystick @dir="onStick" @start="onStart" @end="onEnd"></Joystick>

    <Dialog ref="dialog" @onload="onLoad"></Dialog>
    <div id="loading"></div>
    <div id="loading_process"></div>
    <startPageVue v-if="startShow">
      <div v-if="showStartBtn" class="Start_btn" @click="onStartPage"></div>
    </startPageVue>
    <!-- <button class="buttom" @click="onplay">play</button>
    <button class="pause" style="right: 0" @click="onPause">pause</button> -->
    <!-- <van-overlay :show="show" @click="show = false">
      <van-circle :rate="30" :speed="100" />
    </van-overlay> -->
  </div>
</template>

<script setup lang="ts">
import Dialog from "./components/dialog.vue";
import Joystick from "./components/JoyStick.vue";
import { onMounted, Ref, ref, VueElement } from "vue";
import startPageVue from "./components/start-page.vue";
// import nipplejs from "nipplejs";
import Page, { State } from "./init";
import Player from "./Player";
import ControllerScript from "./ControllerScript";
let page: Page | null = null;
let player = null;
let dialog = ref();
let startShow = ref(true);
let show: Ref<boolean> = ref<boolean>(true);
let showStartBtn: Ref<boolean> = ref<boolean>(false);
const onStick = (e) => {
  if (player) {
    player.controlMove(e);
  }
};
const onplay = () => {
  page.indexScens.video.play();
};
const onPause = () => {
  page.indexScens.video.pause();
};
const onStart = () => {
  if (player == null) {
    player = page.indexScens.npc.getComponent(ControllerScript);
    // player = page.npc.getComponent(Player);
  }
  if (player) {
    player.controlStart();
  }
  if (page) {
    page.indexScens.animator.play(State.Run);
  }
};
const onEnd = () => {
  if (page) {
    page.indexScens.animator.play(State.Idle);
  }
  if (player) {
    player.controalEnd();
  }
};
const onLoad = () => {};
onMounted(() => {
  page = new Page("canvas", () => {
    // page.loadSrc();
    showStartBtn.value = true;
  });
});
const onStartPage = () => {
  if (page) {
    page.initEngine("canvas");
    startShow.value = false;
  }
};
</script>

<style scoped>
#canvas {
  width: 100vw;
  height: 100vh;
}
.buttom {
  position: fixed;
  left: 0;
  top: 20px;
  width: 80px;

  background: #28242480;
  border-radius: unset;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}

.pause {
  position: fixed;
  left: 0;
  top: 80px;
  width: 80px;

  background: #28242480;
  border-radius: unset;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}
.Start_btn {
  width: 138px;
  height: 42px;
  background: url("./components/img/start.png") no-repeat center center;
  background-size: 100% 100%;
  position: absolute;
  left: 50%;

  transform: translateX(-50%) translateY(0%);
  bottom: 10%;
}
</style>
