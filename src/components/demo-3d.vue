<template>
  <div><canvas id="canvas" style="width: 500px; height: 500px" /></div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { OrbitControl } from "@oasis-engine-toolkit/controls";
import {
  Camera,
  GLTFResource,
  Script,
  Vector3,
  WebGLEngine,
  TextureCube,
  BackgroundMode,
  BackgroundTextureFillMode,
  AssetType,
  Texture2D,
} from "oasis-engine";
class Rotate extends Script {
  private _tempVector = new Vector3(0, 1, 0);
  onUpdate() {
    this.entity.transform.rotate(this._tempVector);
  }
}
onMounted(() => {
  const engine = new WebGLEngine("canvas");
  engine.canvas.resizeByClientSize();

  const rootEntity = engine.sceneManager.activeScene.createRootEntity();
  const scene = engine.sceneManager.activeScene;
  const { background } = scene;

  engine.resourceManager
    .load([
      {
        url: "https://gw.alipayobjects.com/mdn/rms_2e421e/afts/img/A*BcWiRYM7hroAAAAAAAAAAAAAARQnAQ",
        type: AssetType.Texture2D,
      },
    ])
    .then(([texture]) => {
      background.mode = BackgroundMode.Texture;
      background.textureFillMode = BackgroundTextureFillMode.AspectFitWidth;
      if (texture) {
        background.texture = texture as Texture2D;
      }
    });
  const cameraEntity = rootEntity.createChild("camera");
  cameraEntity.addComponent(Camera);
  cameraEntity.transform.setPosition(3, 3, 3);
  cameraEntity.transform.lookAt(new Vector3(0, 0, 0));
  cameraEntity.addComponent(OrbitControl);

  engine.sceneManager.activeScene.ambientLight.diffuseSolidColor.set(
    1,
    1,
    1,
    1
  );
  engine.resourceManager
    .load<GLTFResource>(
      "https://gw.alipayobjects.com/os/OasisHub/267000040/9994/%25E5%25BD%2592%25E6%25A1%25A3.gltf"
    )
    .then((gltf) => {
      const duck = gltf.defaultSceneRoot;

      rootEntity.addChild(duck);

      // Add Script
      duck.addComponent(Rotate);
    });

  engine.run();
});
</script>

<style scoped></style>
