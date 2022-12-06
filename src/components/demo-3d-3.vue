<template>
  <div>
    <div><canvas id="canvas3" style="width: 500px; height: 500px" /></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { OrbitControl } from "@oasis-engine-toolkit/controls";
import {
  AssetType,
  Camera,
  Entity,
  Script,
  Sprite,
  SpriteMaskLayer,
  SpriteMask,
  SpriteRenderer,
  Vector3,
  WebGLEngine,
  SpriteMaskInteraction,
  Texture2D,
  GLTFResource,
  Animator,
  Light,
  DirectLight,
  ParticleRenderer,
  Color,
  ParticleRendererBlendMode,
} from "oasis-engine";
class Page {
  engine: WebGLEngine | null = null;
  rootEntity: Entity | null = null;
  constructor(canvasId: string) {
    this.initVueEvent();
    this.initEngine(canvasId);
    this.initCamera();
    this.initLight();
  }
  // oasis初始化
  initEngine(canvasId: string) {
    this.engine = new WebGLEngine(canvasId);
    this.engine.canvas.resizeByClientSize();
    this.rootEntity = this.engine.sceneManager.activeScene.createRootEntity();
    this.engine.run();
  }
  // 相机初始化
  initCamera() {
    let { rootEntity } = this;
    if (rootEntity) {
      const cameraEntity = rootEntity.createChild("Camera");
      cameraEntity.transform.position = new Vector3(0, 0, 50);
      cameraEntity.addComponent(Camera);
      cameraEntity.addComponent(OrbitControl);
    }
  }
  initLight() {
    let { rootEntity } = this;
    if (rootEntity) {
      const lightNode = rootEntity.createChild("lightNode");
      lightNode.addComponent(DirectLight);
      //   lightNode.transform.position.set(0, 10, 0);
      lightNode.transform.lookAt(new Vector3(0, 0, 0));
      lightNode.transform.rotate(new Vector3(0, 90, 0));
    }
  }
  loadSrc() {
    let { engine, rootEntity } = this;
    if (engine && rootEntity) {
      engine.resourceManager
        .load<GLTFResource>(
          "https://gw.alipayobjects.com/os/basement_prod/aa318303-d7c9-4cb8-8c5a-9cf3855fd1e6.gltf"
        )
        .then((asset) => {
          const { animations, defaultSceneRoot } = asset;
          if (rootEntity && animations) {
            rootEntity.addChild(defaultSceneRoot);

            const animator = defaultSceneRoot.getComponent(Animator);
            console.log(animations);
            animator.play(animations[0].name);
          }
        });
    }
  }
  addParticke() {
    let { engine, rootEntity } = this;
    if (engine && rootEntity) {
      const particleEntity = rootEntity.createChild("particles");
      let particles: ParticleRenderer =
        particleEntity.addComponent(ParticleRenderer);

      engine.resourceManager
        .load<Texture2D>({
          url: "https://gw.alipayobjects.com/mdn/rms_d27172/afts/img/A*kxloQYq2YDEAAAAAAAAAAAAAARQnAQ",
          type: AssetType.Texture2D,
        })
        .then((resource) => {
          particles.maxCount = 100;
          particles.startTimeRandomness = 10;
          particles.lifetime = 4;
          particles.position = new Vector3(0, 20, 0);
          particles.positionRandomness = new Vector3(100, 0, 0);
          particles.velocity = new Vector3(0, -3, 0);
          particles.velocityRandomness = new Vector3(1, 2, 0);
          particles.accelerationRandomness = new Vector3(0, 1, 0);
          particles.velocityRandomness = new Vector3(-1, -1, -1);
          particles.rotateVelocity = 1;
          particles.rotateVelocityRandomness = 1;
          particles.size = 1;
          particles.sizeRandomness = 0.8;
          particles.color = new Color(0.5, 0.5, 0.5);
          particles.colorRandomness = 1;
          particles.isFadeIn = true;
          particles.isFadeOut = true;
          particles.texture = resource;
          particles.start();
        });
    }
  }
  addParticle2() {
    let { engine, rootEntity } = this;
    if (engine && rootEntity) {
      const particleEntity = rootEntity.createChild("particles");
      let particles: ParticleRenderer =
        particleEntity.addComponent(ParticleRenderer);
      const spriteSheet = [
        {
          x: 0,
          y: 0,
          w: 100,
          h: 95,
          offX: 0,
          offY: 0,
          sourceW: 100,
          sourceH: 95,
        },
        {
          x: 100,
          y: 0,
          w: 48,
          h: 46,
          offX: 0,
          offY: 0,
          sourceW: 48,
          sourceH: 46,
        },
        {
          x: 148,
          y: 0,
          w: 97,
          h: 90,
          offX: 0,
          offY: 0,
          sourceW: 97,
          sourceH: 90,
        },
        {
          x: 245,
          y: 0,
          w: 148,
          h: 128,
          offX: 0,
          offY: 0,
          sourceW: 148,
          sourceH: 128,
        },
        {
          x: 393,
          y: 0,
          w: 118,
          h: 249,
          offX: 0,
          offY: 0,
          sourceW: 118,
          sourceH: 249,
        },
        {
          x: 100,
          y: 90,
          w: 124,
          h: 94,
          offX: 0,
          offY: 0,
          sourceW: 124,
          sourceH: 94,
        },
        {
          x: 0,
          y: 184,
          w: 249,
          h: 185,
          offX: 0,
          offY: 0,
          sourceW: 249,
          sourceH: 185,
        },
        {
          x: 0,
          y: 95,
          w: 86,
          h: 83,
          offX: 0,
          offY: 0,
          sourceW: 86,
          sourceH: 83,
        },
      ];

      engine.resourceManager
        .load<Texture2D>({
          url: "https://gw.alipayobjects.com/mdn/rms_d27172/afts/img/A*_oorR5SrpXcAAAAAAAAAAAAAARQnAQ",
          type: AssetType.Texture2D,
        })
        .then((resource) => {
          particles.maxCount = 100;
          particles.startTimeRandomness = 5;
          particles.position = new Vector3(0, -30, 0);
          particles.velocity = new Vector3(0, 30, 0);
          particles.velocityRandomness = new Vector3(10, 2, 10);
          particles.acceleration = new Vector3(0, -10, 0);
          particles.accelerationRandomness = new Vector3(2, 4, 5);
          particles.rotateVelocity = 1;
          particles.rotateVelocityRandomness = 1;
          particles.size = 1;
          particles.sizeRandomness = 1;
          particles.color = new Color(0.5, 0.5, 0.5);
          particles.colorRandomness = 1;
          particles.isFadeIn = true;
          particles.isFadeOut = true;
          particles.texture = resource;
          particles.spriteSheet = spriteSheet;
          particles.blendMode = ParticleRendererBlendMode.Additive;
          particles.start();
          //   setTimeout(() => {
          //     particles.stop();
          //     particles.destroy();
          //   }, 5000);
        });
    }
  }
  addSpriteRenderer(
    pos: Vector3,
    scale: Vector3,
    sprite: Sprite,
    maskInteraction: SpriteMaskInteraction,
    maskLayer: number
  ): void {
    let { rootEntity } = this;
    if (rootEntity) {
      const entity = rootEntity.createChild("Sprite");
      const renderer = entity.addComponent(SpriteRenderer);
      const { transform } = entity;
      transform.position = pos;
      transform.scale = scale;
      renderer.sprite = sprite;
      renderer.maskInteraction = maskInteraction;
      renderer.maskLayer = maskLayer;
    }
  }
  addMask<T extends Script>(
    pos: Vector3,
    sprite: Sprite,
    influenceLayers: number,
    scriptType: new (entity: Entity) => T
  ): void {
    let { rootEntity } = this;
    if (rootEntity) {
      const entity = rootEntity.createChild("Mask");
      const mask = entity.addComponent(SpriteMask);
      entity.addComponent(scriptType);
      entity.transform.position = pos;
      mask.sprite = sprite;
      mask.influenceLayers = influenceLayers;
    }
  }

  // vue相关初始化
  initVueEvent() {}
}

class ScaleScript extends Script {
  private _scaleSpeed: number = 0.01;
  onUpdate(delteTime: number): void {
    const { transform } = this.entity;
    let curCale = transform.scale.x;
    // console.log(curCale);
    if (curCale <= 0 || curCale >= 2) {
      this._scaleSpeed *= -1;
    }
    curCale += this._scaleSpeed;
    transform.scale.set(curCale, curCale, curCale);
  }
}
onMounted(() => {
  let page = new Page("canvas3");
  //   page.loadSrc();
  page.addParticle2();
});
</script>

<style scoped></style>
