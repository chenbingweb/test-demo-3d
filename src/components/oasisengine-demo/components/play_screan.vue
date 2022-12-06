<template>
  <div class="screan_box">
    <div>欢迎进入积木元宇宙</div>
    <div>请看大屏幕</div>
    <div class="btn" @click="onPlay"></div>
    <!-- <van-button @click="onPlay" type="primary" class="btn"></van-button> -->
    <!-- <van-button @click="onPlay" type="primary">暂停</van-button> -->
  </div>
  <!-- <Teleport to="body">
    <van-overlay :show="show">
      <div @click.capture="show = false" class="close">X</div>
      <video
        v-if="show"
        controls
        crossOrigin="Anonymous"
        x5-video-player-type
        webkit-playsinline
        playsinline
        :src="videoUrl"
        class="video"
      ></video>
    </van-overlay>
  </Teleport> -->
</template>

<script setup lang="ts">
import { Engine } from "oasis-engine";
import { ref, onMounted, inject, defineProps } from "vue";
const props = defineProps({
  engin: Engine,
});
let videoUrl = ref(
  "https://dpv.videocc.net/e785b2c81c/5/e785b2c81c9e018296671a1287e99615_1.mp4"
);
if (import.meta.env.MODE == "development") {
  videoUrl = ref("./public/asset/mp4.mp4");
} else {
  videoUrl = ref("./asset/mp4.mp4");
}
let show = ref(false);

let text = ref("播放");
let playText = ref("立即播放");
let onPlay = () => {
  // console.log(2);
  // show.value = true;
  let video = document.querySelector("video");
  if (video && video.paused) {
    video.play();
    playText.value = "暂停播放";
    props.engin.dispatch("look_screan");
  } else {
    video.pause();
    playText.value = "立即播放";
  }
};
onMounted(() => {
  let video = document.querySelector("video");
  if (video && video.paused) {
    playText.value = "立即播放";
  } else {
    playText.value = "暂停播放";
  }
  console.log(this);
});
</script>

<style scoped>
.screan_box {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("./img/dialog.png") no-repeat center center;
  background-size: 100% 100%;
  flex-direction: column;
  box-sizing: border-box;
  padding: 0 17px;
  font-size: 13px;
}
.btn {
  width: 78px;
  height: 34px;
  text-align: center;
  line-height: 30px;
  background-color: rgb(29, 136, 254);
  border-radius: 4px;
  margin-top: 10px;
  background: url("./img/play.png") no-repeat center center;
  background-size: 100% 100%;
}
.video {
  position: absolute;
  width: 80%;
  height: 200px;
  left: 50%;
  top: 50%;

  transform: translateY(-50%) translateX(-50%);
}
.close {
  position: absolute;
  right: 30px;
  top: 30px;
  color: #ffffff;
  font-size: 28px;
}
</style>
