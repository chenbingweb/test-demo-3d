import {
  Animator,
  AnimatorController,
  AnimatorControllerLayer,
  AnimatorLayerBlendingMode,
  AnimatorStateMachine,
  AssetType,
  BoxColliderShape,
  Camera,
  Color,
  DirectLight,
  Engine,
  Entity,
  HitResult,
  Layer,
  Material,
  Matrix,
  MeshRenderer,
  PBRBaseMaterial,
  PointLight,
  Quaternion,
  Ray,
  SceneManager,
  Script,
  SphereColliderShape,
  Sprite,
  SpriteDrawMode,
  SpriteRenderer,
  StaticCollider,
  Texture2D,
  Vector2,
  Vector3,
  Vector4,
  WrapMode,
} from "oasis-engine";

import ScencePro, { IInit, LoadScence } from "./scene";
import { OrbitControl, FreeControl } from "@oasis-engine-toolkit/controls";
import TWEEN from "@tweenjs/tween.js";
import { WireframeManager } from "@oasis-engine-toolkit/auxiliary-lines";
import LoadSrc from "../loadSrc/index";
export default class ModelScenc extends ScencePro implements IInit {
  windowEntity: Entity = null;
  cameraEntity: Entity = null;
  orbit: OrbitControl;
  constructor(sceneManager: SceneManager, engine: Engine) {
    super(sceneManager, engine, "model_scence_2");
    super.addInstance<ModelScenc>("model_scence_2", this);
    this.initCamera();
    this.initLight();
    // this.loadSrc();
  }
  initCamera() {
    let { rootEntity } = this;
    if (rootEntity) {
      const cameraEntity = rootEntity.createChild("camera");
      cameraEntity.transform.position = new Vector3(0, 20, 0);
      this.cameraEntity = cameraEntity;

      let camera = cameraEntity.addComponent(Camera);
      camera.cullingMask = Layer.Layer0;
      camera.farClipPlane = 1000;
      camera.fieldOfView = 70;
      //   camera.aspectRatio = 40;

      this.camera = cameraEntity;

      let controal = (this.orbit = cameraEntity.addComponent(OrbitControl));
      //   controal.minPolarAngle = (50 * Math.PI) / 180;
      //   controal.maxPolarAngle = (90 * Math.PI) / 180;
      //   controal.target = new Vector3(0, -1.5, 0);
      controal.enableRotate = false;
      controal.enableZoom = false;
      controal.maxZoom = 2;
      controal.minZoom = 2;
      controal.enablePan = false;
    }
  }
  resetCamera() {
    // this.orbit.minPolarAngle = (0 * Math.PI) / 180;
    this.orbit.maxPolarAngle = (90 * Math.PI) / 180;
    this.orbit.enableRotate = true;
    this.camera.transform.position = new Vector3(14, 17, 0);
    // this.orbit.target = new Vector3(0, 0, 0);
    // let pos = this.cameraEntity.transform.position.clone();
    // let tween = new TWEEN.Tween(pos); //创建一段tween动画
    // tween.to(new Vector3(0, 0, 9), 1000); //4000：表示动画执行时间4000毫秒(ms)
    // tween.onUpdate(() => {
    //   // console.log(11)
    //   this.cameraEntity.transform.position = pos;
    //   // clearTimeout(this.timmer || 0)
    //   // this.timmer=null
    // });
    // tween.onComplete(() => {
    //   console.log("onComplete");
    // });
    // tween.start();
    this.createBack();
  }
  initLight() {
    let { rootEntity } = this;
    if (rootEntity) {
      const lightNode = rootEntity.createChild("lightNode");
      let directLight = lightNode.addComponent(DirectLight);
      lightNode.transform.position.set(0, 14, 0);
      // directLight.intensity = 2;
      lightNode.transform.setRotation(-90, 0, 0);
      directLight.color.set(1, 1, 1, 1);

      const pointLightNode = rootEntity.createChild("pointLight");
      let light = pointLightNode.addComponent(PointLight);
      light.intensity = 0.5;

      pointLightNode.transform.position = new Vector3(10, 14, 0);
      lightNode.transform.lookAt(new Vector3(0, 0, 0));
    }
    {
      const directLightNode = rootEntity.createChild("dir_light");
      const directLightNode2 = rootEntity.createChild("dir_light2");
      directLightNode.addComponent(DirectLight);
      directLightNode2.addComponent(DirectLight);
      directLightNode.transform.setRotation(30, 0, 0);
      directLightNode2.transform.setRotation(-30, 180, 0);
    }
  }
  async loadSrc() {
    let { engine, rootEntity } = this;
    let carUrl = "";
    if (import.meta.env.MODE == "development") {
      carUrl = "./public/asset/car/0704/car.gltf";
    } else {
      carUrl = "./asset/car/0704/car.gltf";
    }
    let env = "";
    if (import.meta.env.MODE == "development") {
      env = "./public/asset/car/ring/environment.gltf";
    } else {
      env = "./asset/car/ring/environment.gltf";
    }
    let listSource = [carUrl, env];
    // await LoadSrc.loadAll(listSource);
    //@ts-ignore
    let [caModel, envModel] = await this.loadSource([...listSource]);
    //@ts-ignore
    // let [caModel, envModel] = await this.engine.resourceManager.load([
    //   ...listSource,
    // ]);
    // let [animations, defaultSceneRoot] = caModel;
    //@ts-ignore
    let carModelClone = caModel.defaultSceneRoot.clone();

    let scale = new Vector3(1, 1, 1);
    //@ts-ignore
    carModelClone.transform.scale = scale;
    console.log(carModelClone.name);
    if (rootEntity.findByName("car")) {
      //@ts-ignore
      rootEntity.removeChild(rootEntity.findByName("car"));
    }
    rootEntity.addChild(carModelClone);

    if (!rootEntity.findByName("environment")) {
      //@ts-ignore
      rootEntity.addChild(envModel.defaultSceneRoot);
    }

    // console.log(envModel.defaultSceneRoot.name);
    // let list = [];
    // //@ts-ignore
    // caModel.animations?.forEach((item) => {
    //   //@ts-ignore
    //   list.push(item.name);
    // });
    // console.log(list);
    //@ts-ignore
    let animator: Animator = carModelClone.getComponent(Animator);
    // this.setAnimation(animator, caModel);
    // const { animatorController } = animator;
    // const animatorStateMachine = new AnimatorStateMachine();
    // const additiveLayer = new AnimatorControllerLayer("additiveLayer");
    // additiveLayer.stateMachine = animatorStateMachine;
    // additiveLayer.blendingMode = AnimatorLayerBlendingMode.Additive;
    // animatorController.addLayer(additiveLayer);
    //@ts-ignore
    carModelClone.addComponent(SelectHotPoint);
    // //@ts-ignore
    // caModel.animations.forEach((item) => {
    //   const newState = animatorStateMachine.addState(item.name);
    //   // newState.clipStartTime = 1;
    //   newState.clip = item;
    // });

    // animator.play("hot", 0);

    // currentState.wrapMode = WrapMode.Once;
    // animator.play("a_o", 1);
    this.setAnimation(animator, caModel);
    carModelClone.findByName("pSphere4 (5)").isActive = false;
    carModelClone.findByName("pSphere4").isActive = false;
    carModelClone.findByName("pSphere3 (5)").isActive = false;
    carModelClone.findByName("pSphere3").isActive = false;
    this.resetCamera();
  }
  setAnimation(animator: Animator, carModelClone) {
    const animations = carModelClone.animations;

    const animatorController = new AnimatorController();
    animations.forEach((clip) => {
      const layer = new AnimatorControllerLayer(clip.name);
      const animatorStateMachine = new AnimatorStateMachine();
      animatorController.addLayer(layer);
      layer.stateMachine = animatorStateMachine;
      const animatorState = animatorStateMachine.addState(clip.name);
      animatorState.clip = clip;
      if (clip.name !== "hot") {
        animatorState.wrapMode = WrapMode.Once;
      }
    });
    animator.animatorController = animatorController;
    animator.play("hot");
    // carModelClone.findByName("pSphere3 (5)").isActive = false;
  }
  createBack() {
    let { engine, rootEntity } = this;
    let url = "";
    if (import.meta.env.MODE == "development") {
      url = "./public/asset/back.png";
    } else {
      url = "./asset/back.png";
    }
    engine.resourceManager
      .load<Texture2D>({
        url,
        type: AssetType.Texture2D,
      })
      .then((texture) => {
        let spriteEntity = new Entity(this.engine, "sprite_back");
        const boxCollider: StaticCollider =
          spriteEntity.addComponent(StaticCollider);
        const boxColliderShape = new BoxColliderShape();
        boxColliderShape.setSize(1, 0.5, 0.1);
        boxCollider.addShape(boxColliderShape);
        this.camera.addChild(spriteEntity);
        spriteEntity.transform.position = new Vector3(-3.4, 6.5, -10);
        spriteEntity.addComponent(SpriteIcon);

        // this.wireframe.addEntityWireframe(spriteEntity);
        const spriteRenderer = spriteEntity.addComponent(SpriteRenderer);

        const sprite = (spriteRenderer.sprite = new Sprite(engine, texture));
        spriteRenderer.drawMode = SpriteDrawMode.Sliced;
        let per = texture.width / texture.height;

        sprite.width = per * 0.4;
        sprite.height = 0.4;
        const { transform } = this.camera;
      });
  }
}
class SpriteIcon extends Script {
  camera: Entity;
  loadScence: LoadScence;
  onAwake() {
    this.loadScence = LoadScence.getInstance();
  }
  onPointerClick() {
    this.loadScence.toScence("index_scence");
    let dom = document.querySelector(".point") as HTMLElement;
    let innerCarDom = document.querySelector(".inner_car") as HTMLElement;
    if (innerCarDom) {
      innerCarDom.style.display = "none";
    }
    if (dom) {
      dom.style.left = "100000px";
      dom.style.top = "100000px";
      dom.style.opacity = "0";
      dom.style.pointerEvents = "none";
    }
    {
      let dom = document.querySelector(".circle") as HTMLElement;
      // let button = document.querySelector(".buttom") as HTMLElement;
      // let pause = document.querySelector(".pause") as HTMLElement;
      if (dom) {
        dom.style.display = "block";
        // button.style.display = "block";
        // pause.style.display = "block";
      }
    }
  }
}

class SelectHotPoint extends Script {
  rightFontDoor: Entity;
  camera: Camera;
  wireframe: WireframeManager;
  animator: Animator;
  orbit: OrbitControl;
  originCamerPos: Vector3;
  originCamerRoate: Quaternion;
  animationCurrent: string;
  animationCurrentObj = {
    c_o: false,
    d_o: false,
    a_o: false,
    b_o: false,
  };
  //  let animator = caModel.defaultSceneRoot.getComponent(Animator);
  constructor(entity: Entity) {
    super(entity);
    this.wireframe = this.entity.addComponent(WireframeManager);
    this.createButton();
  }
  onAwake() {
    this.setCollider();
  }
  onEnable() {
    console.log(12);
    this.animator = this.entity.getComponent(Animator);
    this.camera = this.entity.parent.findByName("camera").getComponent(Camera);
    this.orbit = this.entity.parent
      .findByName("camera")
      .getComponent(OrbitControl);
    this.createCarButton();
  }
  setCollider() {
    let list = [
      "pSphere3 (1)", //
      "pSphere3 (2)",
      "pSphere3 (3)",
      "pSphere3 (4)",
      // "pSphere3 (5)",
      // "pSphere3",
    ];
    list.forEach((item) => {
      let entity = this.entity.findByName(item);

      const physicsSphere = new SphereColliderShape();
      physicsSphere.radius = 4;
      physicsSphere.position = new Vector3(0, 0, 0); //this.rightFontDoor.transform.worldPosition.clone();
      const sphereCollider = entity.addComponent(StaticCollider);
      sphereCollider.addShape(physicsSphere);
    });
  }
  onUpdate() {
    TWEEN.update();
    const { inputManager } = this.engine;
    //@ts-ignore 取消动画
    if (inputManager.isPointerDown()) {
      let pos = inputManager.pointerPosition;
      const ratio = 1;
      let ray = new Ray();
      this.camera.screenPointToRay(new Vector2(pos.x, pos.y).scale(ratio), ray);

      const hit = new HitResult();
      let result = this.engine.physicsManager.raycast(
        ray,
        Number.MAX_VALUE,
        Layer.Everything,
        hit
      );
      if (result) {
        console.log(hit.entity.name);
        if (hit.entity.name === "pSphere3 (1)") {
          if (this.animationCurrentObj["c_o"]) {
            this.animator.play("c_c");
            this.animationCurrentObj["c_o"] = false;
          } else {
            this.animator.play("c_o");
            this.animationCurrentObj["c_o"] = true;
          }
        }
        if (hit.entity.name === "pSphere3 (3)") {
          if (this.animationCurrentObj["d_o"]) {
            this.animator.play("d_c");
            this.animationCurrentObj["d_o"] = false;
          } else {
            this.animator.play("d_o");
            this.animationCurrentObj["d_o"] = true;
          }
        }
        if (hit.entity.name === "pSphere3 (2)") {
          if (this.animationCurrentObj["a_o"]) {
            this.animator.play("a_c");
            this.animationCurrentObj["a_o"] = false;
          } else {
            this.animator.play("a_o");
            this.animationCurrentObj["a_o"] = true;
          }
          // this.animator.play("a_o");
        }
        if (hit.entity.name === "pSphere3 (4)") {
          // if (

          if (this.animationCurrentObj["b_o"]) {
            this.animator.play("b_c");
            this.animationCurrentObj["b_o"] = false;
          } else {
            this.animator.play("b_o");
            this.animationCurrentObj["b_o"] = true;
          }
          // this.animator.play("b_o");
        }
      }
      // const currentState = this.animator.getCurrentAnimatorState(0);
      // currentState.wrapMode = WrapMode.Once;

      // this.screenToViewPoint(inputManager.pointerPosition);
    }
  }
  innerCar() {
    let forword = new Vector3();
    this.entity.transform.getWorldForward(forword);

    let target = new Vector3(
      0.8068933486938477,
      2.1422691345214844,
      -6.121748447418213
    ).add(new Vector3(0, 1, 3));
    this.tweenMove(
      this.camera.entity.transform.position.clone(),
      target,
      (pos) => {
        this.camera.entity.transform.position = pos;
      }
    )();
    this.tweenMove(
      this.orbit.target.clone(),
      new Vector3(target.clone().x + 0.1, target.clone().y, target.clone().z),
      (pos) => {
        this.orbit.target = pos;
      }
    )();
    this.camera.fieldOfView = 110;
    this.orbit.maxPolarAngle = Math.PI;

    // this.camera.entity.transform.position = target;
    // this.orbit.target = new Vector3(target.x + 0.1, target.y, target.z);

    // let q = new Quaternion();
    // q.rotateX((0 * Math.PI) / 180);
    // let m = new Matrix();
    // Matrix.rotationQuaternion(q, m);
    // let q2 = new Quaternion();
    // q2.rotateY((90 * Math.PI) / 180);
    // let m2 = new Matrix();
    // Matrix.rotationQuaternion(q2, m2);
    // let m3 = new Matrix();
    // Matrix.multiply(m2, m, m3);
    // console.log(m3);
    // let v = new Vector3();
    // Vector3.transformToVec3(new Vector3(0, 3, -3), m3, v);
    // this.camera.entity.transform.position = v;
    // this.orbit.target = new Vector3(v.x, v.y + 0.1, v.z);
    // this.camera.fieldOfView = 100;

    // let target = new Vector3(0, 3, -3);
  }
  createButton() {
    if (document.querySelector(".inner_car")) {
      document.querySelector(".inner_car").remove();
    }
    let div = document.createElement("div");
    div.className = "inner_car";
    document.body.append(div);
    //@ts-ignore
    div.style = `
    position: absolute;
    right: 0px;
    top: 20px;
    width: 85px;
    line-height: 34px;
    background-color: #00000066;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    text-align: center;
    color: rgb(255, 255, 255);
    font-size: 14px;
    
    `;
    div.innerText = "车内";
    div.onclick = () => {
      if (div.hasAttribute("data-id")) {
        // this.camera.entity.transform.position = this.originCamerPos;
        this.tweenMove(
          this.camera.entity.transform.position.clone(),
          this.originCamerPos,
          (pos) => {
            this.camera.entity.transform.position = pos;
          }
        )();
        // this.camera.entity.transform.rotationQuaternion = this.originCamerRoate;
        this.camera.fieldOfView = 70;
        this.orbit.maxPolarAngle = Math.PI;
        this.orbit.maxPolarAngle = (90 * Math.PI) / 180;
        this.orbit.target = new Vector3(0, 0, 0);

        div.removeAttribute("data-id");
        div.innerText = "车内";
        document.querySelectorAll(".point").forEach((item) => {
          let ele = item as HTMLElement;
          ele.style.pointerEvents = "none";
          ele.style.opacity = "0";
        });
        console.log("车外");

        let backIcon = this.entity.parent.findByName("sprite_back");
        backIcon.isActive = true;
      } else {
        this.innerCar();
        div.innerText = "车外";
        div.setAttribute("data-id", "1");
        this.originCamerRoate =
          this.camera.entity.transform.rotationQuaternion.clone();
        this.originCamerPos = this.camera.entity.transform.position.clone();

        document.querySelectorAll(".point").forEach((item, index) => {
          if (index != 1) {
            let ele = item as HTMLElement;
            ele.style.pointerEvents = "all";
            ele.style.opacity = "1";
          }
        });
        let backIcon = this.entity.parent.findByName("sprite_back");
        backIcon.isActive = false;
        this.orbit.maxPolarAngle = Math.PI;
      }
    };
  }
  tweenMove(
    start: Vector3,
    end: Vector3,
    callback: (res: Vector3) => void,
    time: number = 500
  ) {
    return () => {
      new TWEEN.Tween(start)
        .to(end, time)
        .onUpdate(() => {
          callback(start);
        })
        .start();
    };
  }
  createCarButton() {
    document.querySelectorAll(".point").forEach((item) => {
      item.remove();
    });
    let pointEle = {
      "pSphere3 (1)": new Vector3(0, 1, -3), //前左
      "pSphere3 (2)": new Vector3(0, 1, 3), //前右
      "pSphere3 (3)": new Vector3(0, 1, -3), // 后右
      "pSphere3 (4)": new Vector3(0, 1, 4), // 后左
    };
    for (let key in pointEle) {
      let entity = this.entity.findByName(key);

      if (entity) {
        let render2D = entity.addComponent(Renderer2DScript);
        render2D.setCamera(this.camera);
        render2D.setPos(
          entity.transform.worldPosition.clone().add(pointEle[key])
        );
        render2D.setOrb(this.orbit);
      }
    }
  }
}

class Renderer2DScript extends Script {
  screen: Vector3 = new Vector3();
  widthRatio: number;
  heightRatio: number;
  camera: Camera;
  dom: HTMLElement;
  orb: OrbitControl;

  constructor(entity: Entity) {
    super(entity);

    this.widthRatio =
      //@ts-ignore
      this.engine.canvas.width / this.engine.canvas._webCanvas.clientWidth;

    this.heightRatio =
      //@ts-ignore
      this.engine.canvas.height / this.engine.canvas._webCanvas.clientHeight;

    this.dom = document.createElement("div");
    this.dom.className = "point";

    this.dom.setAttribute(
      "style",
      ` 
          pointer-events: none;
          opacity:0;
          width:15px;
          height:15px;
          position:absolute;
          top:-1000px;
          left:-1000px;
          background: #dde405;
          border-radius:50%;
          color:#333333`
    );
    this.dom.onclick = () => {
      this.moveCameraTo();
      this.camera.fieldOfView = 110;

      // this.camera.entity.transform.position = this.screen;
      // this.orb.target = new Vector3();

      // this.orb.target = new Vector3(
      //   this.screen.x + 0.1,
      //   this.screen.y,
      //   this.screen.z
      // );
      this.orb.maxPolarAngle = Math.PI;
      // 如果是当前位置，则隐藏，其他显示
      document.querySelectorAll(".point").forEach((item: HTMLElement) => {
        if (item == this.dom) {
          this.dom.style.opacity = "0";
          this.dom.style.pointerEvents = "none";
        } else {
          item.style.opacity = "1";
          item.style.pointerEvents = "all";
        }
      });
    };

    document.body.appendChild(this.dom);
  }
  moveCameraTo() {
    this.tweenMove(
      this.camera.entity.transform.position.clone(),
      this.screen,
      (pos) => {
        this.camera.entity.transform.position = pos;
      }
    )();

    this.tweenMove(
      this.orb.target.clone(),
      new Vector3(this.screen.x + 0.1, this.screen.y, this.screen.z),
      (pos) => {
        this.orb.target = pos;
      }
    )();
  }
  tweenMove(
    start: Vector3,
    end: Vector3,
    callback: (res: Vector3) => void,
    time: number = 500
  ) {
    return () => {
      new TWEEN.Tween(start)
        .to(end, time)
        .onUpdate(() => {
          callback(start);
        })
        .start();
    };
  }
  onStart() {
    // this.camera = this.entity.parent.parent.parent
    //   .findByName("camera")
    //   .getComponent(Camera);
    // this.screen = this.entity.transform.worldPosition.clone();
  }
  setCamera(camera: Camera) {
    this.camera = camera;
  }
  setPos(pos: Vector3) {
    this.screen = pos;
  }
  setOrb(orb: OrbitControl) {
    this.orb = orb;
  }
  screenToViewPoint(pos: Vector2) {
    let { x: clientX, y: clientY } = pos;
    console.log(pos);
    // const { left, top, width, height } = {
    //   left: 0,
    //   top: 0,
    //   width: this.engine.canvas.width,
    //   height: this.engine.canvas.height,
    // };
    // const [cssX, cssY] = [clientX - left, clientY - top];
    // //解决坐标原点位置的差异
    // const [halfWidth, halfHeight] = [width / 2, height / 2];
    // const [xBaseCenter, yBaseCenter] = [cssX - halfWidth, cssY - halfHeight];
    // // 解决y 方向的差异
    // const yBaseCenterTop = -yBaseCenter;
    // //解决坐标基底的差异

    // let v3 = new Vector3(
    //   xBaseCenter / halfWidth,
    //   yBaseCenterTop / halfHeight,
    //   1
    // );

    // this.camera.worldToScreenPoint(v3, this.screen);
    // this.dom.style.left = `${this.screen.x / this.widthRatio}px`;
    // this.dom.style.top = `${this.screen.y / this.heightRatio}px`;

    let p = new Vector3();
    const ratio = 1; // window.devicePixelRatio;
    let ray = new Ray();
    this.camera.screenPointToRay(
      new Vector2(
        this.engine.canvas.width / 2,
        this.engine.canvas.height / 2
      ).scale(ratio),
      ray
    );
    ray.getPoint(1, this.screen);
    let p2 = new Vector3();
    Vector3.transformToVec3(
      this.screen,
      this.camera.projectionMatrix.clone().invert(),
      p2
    );
    this.camera.worldToScreenPoint(p2, this.screen);
    this.dom.style.left = `${this.screen.x / this.widthRatio}px`;
    this.dom.style.top = `${this.screen.y / this.heightRatio}px`;
    console.log(p);
  }
  hiddenDom() {
    let markWp = this.screen.clone();
    let position = this.camera.entity.transform.position.clone();
    let targt = this.camera.entity.getComponent(OrbitControl).target.clone();
    let dot = Vector3.dot(
      markWp.subtract(position),
      targt.clone().subtract(position)
    );

    if (dot > 0) {
      this.dom.style.display = "block";
    } else {
      this.dom.style.display = "none";
    }
  }

  onUpdate() {
    if (!this.camera) return;

    //tween 更新
    // TWEEN.update();

    let p2 = this.screen; //new Vector3();

    var screen = new Vector3();
    this.camera.worldToScreenPoint(p2, screen);
    this.dom.style.left = `${screen.x / this.widthRatio}px`;
    this.dom.style.top = `${screen.y / this.heightRatio}px`;
    // this.dom.style.opacity = "1";
    // this.dom.style.pointerEvents = "all";
    this.hiddenDom();
  }
}
