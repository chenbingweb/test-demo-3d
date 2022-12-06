<template>
  <div class="tip" ref="divDom">
    <!-- <input type="text" />
    <button>23</button> -->
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="username"
          name="用户名"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="password"
          name="手机号"
          label="手机号"
          placeholder="手机号"
          :rules="[{ required: true, message: '请填写手机号' }]"
        />
      </van-cell-group>
      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, defineEmits } from "vue";
const emit = defineEmits<{
  (e: "onload"): void;
}>();
const username = ref("");
const password = ref("");
const onSubmit = (values) => {
  console.log("submit", values);
};

let divDom = ref<HTMLElement | null>(null);
onMounted(() => {
  emit("onload");
});
const getDom = () => {
  return divDom.value;
};
defineExpose({
  getDom,
});
</script>

<style scoped>
.tip {
  position: absolute;
  left: -1000px;
  top: -1000px;
  color: #333;
  width: 300px;
  height: 180px;
  box-sizing: border-box;
  background-color: #5c575799;
  border-radius: 10px;
  transform: translateX(-150px) translateY(-190px);
  padding-top: 19px;
  display: none;
}
</style>
