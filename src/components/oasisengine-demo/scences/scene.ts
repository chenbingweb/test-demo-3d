import {
  AssetType,
  Camera,
  Color,
  Component,
  DirectLight,
  Engine,
  Entity,
  ParticleRenderer,
  ParticleRendererBlendMode,
  Scene,
  SceneManager,
  Script,
  Texture2D,
  Vector3,
  WebGLEngine,
} from "oasis-engine";
import { WireframeManager } from "@oasis-engine-toolkit/auxiliary-lines";
import { createApp, h, getCurrentInstance } from "vue";
import LoadingComponent from "../components/loading.vue";
import LoadingComponentProcess from "../components/process-bar.vue";
export default class ScencePro {
  engine: WebGLEngine | Engine | null = null;
  rootEntity: Entity | null = null;
  scence: Scene;
  camera: Entity;
  wireframe: WireframeManager = null;
  loadScence: LoadScence;
  loadingEntity: Component;
  particle: Entity;

  constructor(sceneManager: SceneManager, engine: Engine, scenceName: string) {
    this.scence = new Scene(sceneManager.engine);
    this.engine = engine;
    this.rootEntity = this.scence.createRootEntity(scenceName);

    this.loadScence = LoadScence.getInstance(sceneManager);
    this.loadScence.addScence(scenceName, this.scence);

    this.wireframe = this.rootEntity.addComponent(WireframeManager);
  }
  loading() {
    this.loadingEntity = this.rootEntity.addComponent(Particle);
    if (this.particle) {
      this.rootEntity.addChild(this.particle);
    }
  }
  hidden() {
    if (this.loadingEntity) {
      // this.loadingEntity.destroy();
      this.particle = this.rootEntity.findByName("particle");
      console.log(this.particle);
      this.rootEntity.removeChild(this.rootEntity.findByName("particle"));
    }
  }
  addInstance<T>(instanceName: string, instance: T) {
    this.loadScence.addInstance(instanceName, instance);
  }
  async loadSource(list, callBack?: (per: number) => void) {
    let div = document.createElement("div");
    div.setAttribute("loading", "1");
    document.body.append(div);
    const app = createApp({
      name: "root",
      data() {
        return {
          progress: 0,
        };
      },
      render() {
        return h(LoadingComponentProcess, {
          percent: this.progress,
        });
      },
    });
    let loading = 0;
    app.mount(div);
    return await this.engine.resourceManager
      .load(list)
      .onProgress((progress: number) => {
        // loading.setVal(progress);
        // console.log(`当前加载进度为 ${progress}`);

        // if (app._instance?.data) {
        //   app._instance.data.progress = progress;
        // }
        let dom = document.querySelector(".percent") as HTMLElement;
        // let urlDom = document.querySelector(".url_text") as HTMLElement;

        let numEle = document.getElementById("num") as HTMLElement;
        let maskEle = document.getElementById("wave-mask") as HTMLElement;

        if (dom) {
          dom.style.width = progress * 100 + "%";
          console.log(`当前加载进度为 ${progress}`);
          numEle.innerHTML = progress * 100 + "";
          maskEle.style.top = 100 - progress * 100 + "%";
          if (progress > 0) {
            maskEle.style.opacity = "1";
          }
        }
        // if (urlDom) {
        //   urlDom.textContent = "source:" + url;
        // }
        if (callBack) {
          callBack(progress);
        }

        if (progress == 1) {
          app.unmount();
          // document.body.removeChild(div);
        }
      });
  }
}
export interface IInit {
  initCamera: () => void;
  initLight: () => void;
}

export class Particle extends Script {
  particles: ParticleRenderer;
  spriteSheet = [
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

  onStart() {
    const particleEntity = this.entity.createChild("particle");
    this.particles = particleEntity.addComponent(ParticleRenderer);

    let particles = this.particles;

    this.engine.resourceManager
      .load<Texture2D>({
        url: "https://gw.alipayobjects.com/mdn/rms_d27172/afts/img/A*kxloQYq2YDEAAAAAAAAAAAAAARQnAQ",
        // url: "https://gw.alipayobjects.com/mdn/rms_d27172/afts/img/A*_oorR5SrpXcAAAAAAAAAAAAAARQnAQ",
        type: AssetType.Texture2D,
      })
      .then((resource) => {
        particles.maxCount = 500;
        particles.startTimeRandomness = 5;
        particles.position = new Vector3(0, 0, 0);
        particles.positionRandomness = new Vector3(0.5, 0, 0.5);
        particles.velocity = new Vector3(0, 20, 0);
        particles.velocityRandomness = new Vector3(5, 20, 5);
        particles.acceleration = new Vector3(0, -10, 0);
        particles.accelerationRandomness = new Vector3(2, 4, 5);
        particles.rotateVelocity = 1;
        particles.rotateVelocityRandomness = 1;
        particles.size = 0.1;
        // particles.sizeRandomness = 1;
        // particles.color = new Color(0.5, 0.5, 0.5);
        // particles.colorRandomness = 1;
        // particles.isFadeIn = true;
        // particles.isFadeOut = true;
        particles.texture = resource;
        // particles.spriteSheet = this.spriteSheet;
        // particles.blendMode = ParticleRendererBlendMode.Transparent;
        particles.start();
      });
  }
}

export class LoadScence {
  private static instance: LoadScence;
  private sceneManager: SceneManager = null;
  private constructor(sceneManager: SceneManager) {
    this.sceneManager = sceneManager;
  }
  scenceMap: { scenceName: string; scence: Scene } | Object = {};
  instanceMap: { instanceName: string; instance: any } | Object = {};

  addScence(scenceName: string, scence: Scene) {
    this.scenceMap[scenceName] = scence;
  }
  addInstance<T>(instanceName: string, instance: T) {
    this.instanceMap[instanceName] = instance as T;
  }
  toScence(scenceName: string) {
    // this.sceneManager.activeScene = this.scenceMap[scenceName];
    for (let key in this.scenceMap) {
      this.scenceMap[key].isActive = false;
    }
    this.scenceMap[scenceName].isActive = true;
    this.sceneManager.activeScene = this.scenceMap[scenceName];
    if (this.instanceMap[scenceName]) {
      this.instanceMap[scenceName].loadSrc();
    }
  }
  public static getInstance(sceneManager?: SceneManager) {
    if (!LoadScence.instance) {
      LoadScence.instance = new LoadScence(sceneManager);
    }

    return LoadScence.instance;
  }
}
