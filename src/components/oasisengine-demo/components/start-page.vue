<template>
  <div class="bg">
    <slot></slot>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.bg {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: url("./img/bg.png") no-repeat center center;
  background-size: cover;
}
</style>
