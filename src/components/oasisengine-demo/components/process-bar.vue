<template>
  <div class="mask">
    <!-- <img src="../../../assets/33.gif" alt="" style="width: 100%" /> -->
    <div class="wave-progress">
      <div id="num_box">
        <div class="num_box">
          <div id="num" style="font-size: 25px">0</div>
          <div style="font-size: 15px">%</div>
        </div>
        <div style="font-size: 12px; line-height: 1.1">加载中...</div>
      </div>
      <div class="wave"></div>
      <div id="wave-mask"></div>
    </div>
    <div class="circle_1">
      <div class="circle_3"></div>
      <div class="circle_2"></div>
    </div>

    <!-- <div style="text-align: center; color: #ffffff; font-size: 12px">
      正在加载资源中...
    </div> -->
    <div class="process_bar" style="display: none">
      <!-- <div class="one_line url_text">source:{{ url }}</div> -->
      <div class="process_progrom">
        <div class="percent" :style="{ width: barcurrentRate + '%' }"></div>
      </div>
      <!-- <van-progress :percentage="barcurrentRate" :show-pivot="false" /> -->
    </div>
    <div class="point_group">
      <div v-for="item in [1, 2]" :key="item" class="item">
        <div
          class="point"
          style="left: 27%; top: 3%; transform: scale(1)"
        ></div>
        <div
          class="point"
          style="right: 27%; top: 3%; transform: scale(1)"
        ></div>
        <div
          class="point"
          style="left: 27%; bottom: 2%; transform: scale(1.1)"
        ></div>
        <div
          class="point"
          style="right: 27%; bottom: 2%; transform: scale(1.3)"
        ></div>
        <div
          class="point"
          style="left: 27%; top: 40%; transform: scale(1)"
        ></div>
        <div
          class="point"
          style="right: 27%; top: 50%; transform: scale(1.3)"
        ></div>
        <div
          class="point"
          style="left: 27%; top: 35%; transform: scale(1.1)"
        ></div>
        <div
          class="point"
          style="right: 27%; top: 40%; transform: scale(0.8)"
        ></div>
        <div
          class="point"
          style="top: 30%; left: 10%; width: 20px; height: 20px"
        ></div>
        <div
          class="point"
          style="top: 40%; right: 10%; width: 20px; height: 20px"
        ></div>
        <div
          class="point"
          style="top: 12%; left: 30%; transform: scale(0.75)"
        ></div>
        <div
          class="point"
          style="top: 10%; right: 30%; transform: scale(0.6)"
        ></div>
        <div
          class="point"
          style="left: 27%; bottom: 22%; transform: scale(0.7)"
        ></div>
        <div
          class="point"
          style="right: 17%; bottom: 24%; transform: scale(0.9)"
        ></div>
        <div
          class="point"
          style="left: 27%; bottom: 32%; transform: scale(1)"
        ></div>
        <div
          class="point"
          style="right: 27%; bottom: 34%; transform: scale(1.1)"
        ></div>
        <div
          class="point"
          style="right: 50%; top: 50%; transform: translateX(-50%) scale(1.3)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineProps, onMounted } from "vue";

const props = defineProps({
  url: {
    type: String,
  },
  barpercent: {
    type: Number,
  },
});

let barcurrentRate = ref(0);

watch(
  () => props.barpercent,
  (v, n) => {
    barcurrentRate.value = n * 100;
  }
);
</script>

<style scoped>
.mask {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f1f4ed;
}
.box {
  width: 100%;
  height: 100%;
}
.process_bar {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 30px;
  width: 90%;
}
.process_progrom {
  width: 100%;
  height: 10px;
  border-radius: 5px;
  background-color: #fff;
  position: relative;
  overflow: hidden;
  font-size: 10px;
}
.percent {
  position: absolute;
  left: 0;
  height: 100%;
  width: 0;
  background-color: rgb(27, 101, 231);
  transition: all 0.2s;
}
@keyframes spin {
  50% {
    transform: translate(-50%, -101%) rotate(500deg);
  }
  100% {
    transform: translate(-50%, -101%) rotate(1000deg);
  }
}
.wave-progress {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  /* background: #ffffff; */
  overflow: hidden;
  position: relative;
  z-index: 1;
}
.wave {
  position: relative;
  width: 100%;
  height: 100%;
  /* background: red; */
  background-image: linear-gradient(-180deg, #eb769a 13%, #eb769a 100%);
  border-radius: 50%;
  /* opacity: 0; */
}
#wave-mask {
  position: absolute;
  width: 200%;
  height: 200%;
  top: 100%;
  left: 50%;
  border-radius: 40%;
  transform: translate(-50%, -101%) rotate(0);
  animation: spin 15s linear infinite;
  z-index: 0;
  background-color: #0e3d72;
  /* transition: all 0.2s linear; */
}
#num_box {
  position: absolute;
  width: 100%;
  height: 100%;
  color: #fff;
  font-size: 18px;
  /* line-height: 100px; */
  font-weight: bold;
  text-align: center;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  margin-top: 3px;
}
.num_box {
  display: flex;
  justify-content: center;
  align-items: baseline;
}
.point_group {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 99999;
}
.item {
  animation: slide 5s linear infinite;
  width: 100%;
  height: 100vh;
}

@keyframes slide {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-100%);
  }
}
.point {
  width: 10px;
  height: 10px;
  position: absolute;
  background-color: #eb769a;
  border-radius: 50%;
  /* transform: translateX(-50%) translateY(-50%); */
}
.circle_1 {
  width: 150px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  /* background: red; */
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
}
.circle_2 {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  border-left: 1px solid #eb769a;
  border-top: 1px solid #eb769a;
  /* border-right: 1px solid #fff; */
  border-top-left-radius: 50%;
  border-bottom-left-radius: 50%;
  border-top-right-radius: 50%;
  /* border-bottom-right-radius: 50%; */
  animation: circle 5s linear infinite;
}
.circle_3 {
  width: 85%;
  height: 85%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%) rotateZ(90deg);
  border-left: 1px solid #eb769a;
  border-top: 1px solid #eb769a;
  /* border-right: 1px solid #fff; */
  border-top-left-radius: 50%;
  border-bottom-left-radius: 50%;
  border-top-right-radius: 50%;
  /* border-bottom-right-radius: 50%; */
  animation: circle2 3s linear infinite;
}
@keyframes circle {
  0% {
    transform: translateX(-50%) translateY(-50%) rotateZ(0);
  }
  100% {
    transform: translateX(-50%) translateY(-50%) rotateZ(360deg);
  }
}
@keyframes circle2 {
  0% {
    transform: translateX(-50%) translateY(-50%) rotateZ(30deg);
  }
  100% {
    transform: translateX(-50%) translateY(-50%) rotateZ(360deg);
  }
}
</style>
