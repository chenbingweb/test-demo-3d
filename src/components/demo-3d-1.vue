<template>
  <div><canvas id="canvas" style="width: 100vw; height: 100vh" /></div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { OrbitControl } from "@oasis-engine-toolkit/controls";
import {
  AssetType,
  BlinnPhongMaterial,
  Camera,
  DirectLight,
  Engine,
  GLTFResource,
  MeshRenderer,
  RenderFace,
  Texture2D,
  Vector3,
  WebCanvas,
  WebGLEngine,
  WebGLRenderer,
} from "oasis-engine";
import { PhysXPhysics } from "@oasis-engine/physics-physx";

onMounted(() => {
  PhysXPhysics.initialize().then(() => {
    // Create engine object
    const canvas = document.getElementById("canvas");
    let webCanvas = new WebCanvas(canvas);
    const webGLRenderer = new WebGLRenderer();
    const engine = new Engine(webCanvas, webGLRenderer);

    const pixelRatio = window.devicePixelRatio; // 如果已经设置 meta scale，请设置为 1
    const scale = 3 / 3; // 3 倍高清屏按 2 倍屏来计算画布尺寸

    /**
     * 设置节能模式，默认全屏，也可以自己设置任意高宽
     */
    webCanvas.width = (window.innerWidth * pixelRatio) / scale;
    webCanvas.height = (window.innerHeight * pixelRatio) / scale;
    webCanvas.setScale(scale, scale); // 拉伸画布

    // const engine = new WebGLEngine("canvas");
    // engine.canvas.resizeByClientSize();

    const scene = engine.sceneManager.activeScene;
    const rootEntity = scene.createRootEntity();

    const cameraEntity = rootEntity.createChild("Camera");
    cameraEntity.transform.position = new Vector3(0, 5, 5);
    let camera = cameraEntity.addComponent(Camera);
    // camera.cullingMask = Layer.Layer0;
    camera.farClipPlane = 1000;
    camera.fieldOfView = 70;

    let controal = cameraEntity.addComponent(OrbitControl);
    controal.minPolarAngle = (50 * Math.PI) / 180;
    controal.maxPolarAngle = (90 * Math.PI) / 180;
    controal.target = new Vector3(0, 0, 0);
    controal.enableZoom = false;
    controal.enablePan = false;
    controal.enableRotate = true;

    // Create Direct Light
    const light1 = rootEntity.createChild();
    const light2 = rootEntity.createChild();
    light1.transform.lookAt(new Vector3(-1, -1, -1));
    light2.transform.lookAt(new Vector3(1, 1, 1));
    light1.addComponent(DirectLight);
    light2.addComponent(DirectLight);
    engine.run();

    engine.resourceManager
      .load([
        {
          type: AssetType.Texture2D,
          url: "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*g_HIRqQdNUcAAAAAAAAAAAAAARQnAQ",
        },
        {
          type: AssetType.Texture2D,
          url: "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*H7nMRY2SuWcAAAAAAAAAAAAAARQnAQ",
        },
        {
          type: AssetType.Prefab,
          url: "https://gw.alipayobjects.com/os/bmw-prod/72a8e335-01da-4234-9e81-5f8b56464044.gltf",
        },
      ])
      .then((res) => {
        const baseTexture = res[0] as Texture2D;
        const normalTexture = res[1] as Texture2D;
        const gltf = res[2] as GLTFResource;

        const { defaultSceneRoot } = gltf;
        const rendererArray = new Array<MeshRenderer>();
        // const materials = new Array<BlinnPhongMaterial>();

        rootEntity.addChild(defaultSceneRoot);

        defaultSceneRoot.getComponentsIncludeChildren(
          MeshRenderer,
          rendererArray
        );
        console.log(rendererArray);
        rendererArray.forEach((renderer) => {
          const material = new BlinnPhongMaterial(engine);
          material.baseTexture = baseTexture;
          material.normalTexture = normalTexture;
          material.shininess = 64;
          material.renderFace = RenderFace.Double;
          renderer.setMaterial(material);
          // materials.push(material);
        });
      });
  });
});
</script>

<style scoped></style>
