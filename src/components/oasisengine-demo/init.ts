import {
  AmbientLight,
  AnimationClip,
  Animator,
  AnimatorController,
  AnimatorControllerLayer,
  AnimatorStateMachine,
  AssetType,
  BackgroundMode,
  BoxColliderShape,
  Camera,
  CapsuleColliderShape,
  CharacterController,
  Color,
  ControllerCollisionFlag,
  DirectLight,
  Engine,
  Entity,
  Font,
  GLTFResource,
  Keys,
  Logger,
  Material,
  Matrix,
  MeshRenderer,
  PBRMaterial,
  PlaneColliderShape,
  PrimitiveMesh,
  Quaternion,
  Renderer,
  RenderFace,
  Script,
  SkyBoxMaterial,
  StaticCollider,
  TextRenderer,
  Texture2D,
  Vector2,
  Vector3,
  WebGLEngine,
  WebCanvas,
  WebGLRenderer,
  PointLight,
  BlinnPhongMaterial,
  TextureFormat,
  TextureWrapMode,
  BoundingBox,
  Scene,
  SceneManager,
} from "oasis-engine";
import { OrbitControl, FreeControl } from "@oasis-engine-toolkit/controls";
// @oasis-engine/physics-physx
import { PhysXPhysics } from "@oasis-engine/physics-physx";
import Player from "./Player";
import ControllerScript, { UserClick } from "./ControllerScript";
import UpdateVideoScript, { VideoMaterial } from "./texture-vide";
import AddColliderShape from "./addColliderShape";
import { WireframeManager } from "@oasis-engine-toolkit/auxiliary-lines";
import IndexScene from "./scences/index-scene";
import ModelScenc from "./scences/model-scene";
import ModelScene2 from "./scences/model-scene-2";
import { LoadScence } from "./scences/scene";
export enum State {
  Run = "Run",
  Idle = "Idle",
  Jump = "Jump_In",
  Fall = "Fall",
  Landing = "Landing",
}
export default class Page {
  engine: WebGLEngine | Engine | null = null;
  rootEntity: Entity | null = null;
  npc: Entity | null = null;
  animator: Animator | null = null;
  video: any;
  camera: Entity | null = null;
  wireframe = null;
  sceneList = [];
  indexScens: IndexScene = null;
  modelScens: ModelScenc = null;
  modelScens2: ModelScene2 = null;
  constructor(canvasId: string, cb: () => void) {
    PhysXPhysics.initialize().then(() => {
      // this.initEngine(canvasId);
      cb && cb();
    });
  }
  initEngine(canvasId: string) {
    let sceneManager = this.createScence(canvasId).sceneManager;
    this.engine = sceneManager.engine;
    this.engine.physicsManager.initialize(PhysXPhysics);

    this.initScences(sceneManager);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState == "visible") {
        console.log("visible");
        this.engine.resume();
      }
      if (document.visibilityState == "hidden") {
        console.log("hidden");
        this.engine.pause();
      }
    });
    this.engine.run();
  }
  initScences(sceneManager: SceneManager) {
    let indexScens = new IndexScene(sceneManager, this.engine);

    this.indexScens = indexScens;
    this.modelScens2 = new ModelScene2(sceneManager, this.engine); //new ModelScenc(sceneManager, this.engine);

    sceneManager.activeScene = this.indexScens.scence;
  }
  createScence(canvasId: string) {
    const canvas = document.getElementById(canvasId);
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
    return {
      sceneManager: engine.sceneManager,
      engine,
    };
  }
}
