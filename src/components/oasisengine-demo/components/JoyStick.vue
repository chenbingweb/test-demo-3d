<template>
  <div
    class="circle"
    @touchstart.self="toucheStart"
    @touchmove.self="touchMove"
    @touchend.self="touchEnd"
  >
    <div
      class="circle_inner"
      :style="{ left: pos.x + 'px', top: pos.y + 'px' }"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import JoyStick from "./JoyStick";
import { onMounted, defineEmits } from "vue";
import { reactive } from "vue";
import { Vector2 } from "oasis-engine";
let joyStick: JoyStick = null;
let pos = reactive({ x: 50, y: 50 });
interface IdirInfo {
  dir: Vector2;
  deg: number;
}
onMounted(() => {
  joyStick = new JoyStick(
    document.querySelector(".circle"),
    document.querySelector(".circle_inner")
  );
});
const emit = defineEmits<{
  (e: "dir", dir: IdirInfo): IdirInfo;
  (e: "start");
  (e: "end");
}>();

const toucheStart = (e) => {
  let x = e.touches[0].pageX | 0;
  let y = e.touches[0].pageY | 0;
  if (joyStick) {
    let { x: px, y: py } = joyStick.touchStart({ x, y });
    pos.x = px;
    pos.y = py;
  }
  emit("start");
};
const touchMove = (e) => {
  let x = e.touches[0].pageX | 0;
  let y = e.touches[0].pageY | 0;
  if (joyStick) {
    let { x: px, y: py, normal, deg } = joyStick.touchMove({ x, y });
    pos.x = px;
    pos.y = py;
    emit("dir", { dir: normal, deg });

    // console.log(normal);
  }
};
const touchEnd = (e) => {
  let x = 0;
  let y = 0;
  pos.x = 50;
  pos.y = 50;
  emit("dir", { dir: new Vector2(0, 0), deg: 0 });
  emit("end");
  //   if (joyStick) {
  //     joyStick.touchEnd({ x, y });
  //   }
};
</script>

<style scoped>
.circle {
  width: 100px;
  height: 100px;
  /* border: 2px solid yellow; */
  border-radius: 50%;
  position: fixed;
  left: 30px;
  bottom: 30px;
  pointer-events: none;
  opacity: 0;
  background: url("../../../assets/circle.png") no-repeat center center;
  background-size: 100% 100%;
}
.circle_inner {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  /* background-color: blue; */
  opacity: 0.8;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  pointer-events: none;
  background: url("../../../assets/circle_inner.png") no-repeat center center;
  background-size: 100% 100%;
}
</style>
