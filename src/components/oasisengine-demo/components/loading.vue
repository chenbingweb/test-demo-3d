<template>
  <div class="mask">
    <van-circle v-if="false" v-model:current-rate="currentRate" :rate="100">
      <div class="flex_center box">
        <!-- <span style="color: #ffffff">{{ text }}</span> -->
        <span style="color: #ffffff; font-size: 16px">场景加载中</span>
      </div>
    </van-circle>
    <span style="color: #ffffff; font-size: 16px">场景加载中...</span>

    <!-- <div class="process_bar" v-if="url">
      <div class="one_line url_text">source:{{ url }}</div>
      <div class="process_progrom">
        <div class="percent" :style="{ width: barcurrentRate + '%' }"></div>
      </div>
   
    </div> -->
    <!-- <van-progress :percentage="barcurrentRate" :show-pivot="false" /> -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineProps } from "vue";
const props = defineProps({
  percent: {
    type: Number,
  },
  url: {
    type: String,
  },
  barpercent: {
    type: Number,
  },
});
let currentRate = ref(0);
let barcurrentRate = ref(0);
const text = computed(() => currentRate.value.toFixed(0) + "%");
watch(
  () => props.percent,
  (v, n) => {
    currentRate.value = n * 100;
  }
);
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
  /* background-color: rgba(0, 0, 0, 0.5); */
  display: flex;
  justify-content: center;
  align-items: center;
  /* background: url("../../../assets/22.gif") no-repeat center center; */
  /* background-size: cover; */
}
.box {
  width: 100%;
  height: 100%;
}
.process_bar {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 110px;
  width: 90%;
}
.process_progrom {
  width: 90%;
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
  background-color: rgb(120 77 220);
  transition: all 0.2s;
}
</style>
