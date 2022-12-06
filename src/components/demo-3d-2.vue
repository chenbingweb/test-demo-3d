<template>
  <div>
    <div><canvas id="canvas2" style="width: 500px; height: 500px" /></div>
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
} from "oasis-engine";
class Page {
  engine: WebGLEngine | null = null;
  rootEntity: Entity | null = null;
  constructor(canvasId: string) {
    this.initVueEvent();
    this.initEngine(canvasId);
    this.initCamera();
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
      cameraEntity.transform.setPosition(0, 0, 50);
      cameraEntity.addComponent(Camera);
      cameraEntity.addComponent(OrbitControl);
    }
  }
  loadSrc() {
    let { engine } = this;
    if (engine) {
      engine.resourceManager
        .load([
          {
            // Sprite texture
            url: "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*rgNGR4Vb7lQAAAAAAAAAAAAAARQnAQ",
            type: AssetType.Texture2D,
          },
          {
            // Mask texture
            url: "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*qyhFT5Un5AgAAAAAAAAAAAAAARQnAQ",
            type: AssetType.Texture2D,
          },
          {
            // Mask texture
            url: "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*pgrpQIneqSUAAAAAAAAAAAAAARQnAQ",
            type: AssetType.Texture2D,
          },
        ])
        .then((textures: Texture2D[] | Object[]) => {
          if (engine && Texture2D.length) {
            const pos = new Vector3();
            const scale = new Vector3();
            let texture = textures[0] as Texture2D;
            const sprite = new Sprite(engine, textures[0] as Texture2D);
            const maskSprite0 = new Sprite(engine, textures[1] as Texture2D);
            const maksSprite1 = new Sprite(engine, textures[2] as Texture2D);
            // pos.set
            pos.set(-5, 0, 0);
            scale.set(2, 2, 2);
            this.addSpriteRenderer(
              pos,
              scale,
              sprite,
              SpriteMaskInteraction.VisibleInsideMask,
              SpriteMaskLayer.Layer1
            );
            this.addMask(pos, maskSprite0, SpriteMaskLayer.Layer1, ScaleScript);
          }
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
  let page = new Page("canvas2");
  page.loadSrc();
});
</script>

<style scoped></style>
