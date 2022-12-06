import {
  AssetType,
  BackgroundMode,
  BoxColliderShape,
  Camera,
  Color,
  DirectLight,
  Engine,
  Entity,
  GLTFResource,
  Layer,
  Material,
  Matrix,
  MeshRenderer,
  PBRMaterial,
  PlaneColliderShape,
  PointerButton,
  PointLight,
  PrimitiveMesh,
  Quaternion,
  Ray,
  Rect,
  RenderFace,
  Scene,
  SceneManager,
  Script,
  SkyBoxMaterial,
  SpotLight,
  Sprite,
  SpriteDrawMode,
  SpriteRenderer,
  StaticCollider,
  Texture2D,
  Vector2,
  Vector3,
  Vector4,
} from "oasis-engine";
import ScencePro, { IInit, LoadScence } from "./scene";
import { OrbitControl, FreeControl } from "@oasis-engine-toolkit/controls";
import TWEEN from "@tweenjs/tween.js";
export default class ModelScenc extends ScencePro implements IInit {
  windowEntity: Entity = null;
  cameraEntity: Entity = null;
  orbit: OrbitControl;
  constructor(sceneManager: SceneManager, engine: Engine) {
    super(sceneManager, engine, "model_scence");
    super.addInstance<ModelScenc>("model_scence", this);
    this.initCamera();
    this.initLight();

    // this.splitCamer(sceneManager);
    // this.loadSrc();
    // this.scence.background.solidColor = new Color(0, 0, 0);
    this.scence.background.mode = BackgroundMode.Sky;
  }

  initCamera() {
    let { rootEntity } = this;
    if (rootEntity) {
      const cameraEntity = rootEntity.createChild("camera");
      // cameraEntity.transform.position = new Vector3(0, 2, 2);
      cameraEntity.transform.position = new Vector3(0, 10, 0);
      // cameraEntity.transform.setRotation(0, 0, 0);
      // cameraEntity.transform.lookAt(new Vector3(0, 0, 0));
      // {
      //   let q = new Quaternion();
      //   q.rotateX((30 * Math.PI) / 180);

      //   let m = new Matrix();
      //   Matrix.rotationQuaternion(q, m);

      //   let q2 = new Quaternion();
      //   q2.rotateY((30 * Math.PI) / 180);

      //   let m2 = new Matrix();
      //   Matrix.rotationQuaternion(q2, m2);
      //   let m3 = new Matrix();
      //   Matrix.multiply(m2, m, m3);
      //   let v = new Vector3();
      //   Vector3.transformToVec3(new Vector3(0, -1.5, 0), m3, v);

      //   cameraEntity.transform.position = v;
      // }
      this.cameraEntity = cameraEntity;

      let camera = cameraEntity.addComponent(Camera);
      camera.cullingMask = Layer.Layer0;
      camera.farClipPlane = 1000;
      camera.fieldOfView = 70;
      this.camera = cameraEntity;

      let controal = (this.orbit = cameraEntity.addComponent(OrbitControl));
      //   controal.minPolarAngle = (50 * Math.PI) / 180;
      controal.maxPolarAngle = (90 * Math.PI) / 180;
      controal.target = new Vector3(0, -1.5, 0);
      controal.enableRotate = false;
      controal.enableZoom = false;
      //   controal.maxZoom = 0.1;
      //   controal.minZoom = 0.1;
      controal.enablePan = false;

      // controal.autoRotate = true;
    }
  }
  resetCamera() {
    this.orbit.minPolarAngle = (50 * Math.PI) / 180;
    this.orbit.maxPolarAngle = (85 * Math.PI) / 180;
    let v = new Vector3();
    Vector3.lerp(new Vector3(0, 10, 0), new Vector3(0, 0, 9), 1, v);
    this.orbit.enableRotate = true;
    this.camera.transform.position = v;

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
  }
  splitCamer(scene: Scene) {
    this.windowEntity = scene.createRootEntity();
    this.windowEntity.layer = Layer.Layer1;
    const windowCameraEntity = this.windowEntity.createChild("window-camera");
    const windowCamera = windowCameraEntity.addComponent(Camera);
    // windowCamera.cullingMask = Layer.Layer1;

    windowCamera.viewport.set(0, 0, 1, 1);
    windowCamera.farClipPlane = 200;
    windowCameraEntity.transform.lookAt(new Vector3(0, 0, 0));
    windowCameraEntity.transform.setPosition(0, 1.8, 10);
  }
  initLight() {
    let { rootEntity } = this;
    if (rootEntity) {
      const lightNode = rootEntity.createChild("lightNode");
      let directLight = lightNode.addComponent(DirectLight);
      lightNode.transform.position.set(0, 10, 0);
      // directLight.intensity = 2;
      // console.log(lightNode.transform.rotation);
      // lightNode.transform.lookAt(new Vector3(0, 0, 0));
      lightNode.transform.setRotation(-90, 0, 0);
      directLight.color.set(1, 1, 1, 1);

      // directLight.shadowStrength = 0.75;
      const pointLightNode = rootEntity.createChild("pointLight");
      let light = pointLightNode.addComponent(PointLight);
      light.intensity = 0.5;
      // light.color
      pointLightNode.transform.position = new Vector3(10, 10, 0);
      lightNode.transform.lookAt(new Vector3(0, 0, 0));
    }
    {
      const pointLightNode = rootEntity.createChild("pointLight");
      let light = pointLightNode.addComponent(PointLight);
      light.intensity = 0.5;
      // light.color
      pointLightNode.transform.position = new Vector3(-10, 10, 0);
    }
    {
      const pointLightNode = rootEntity.createChild("pointLight");
      let light = pointLightNode.addComponent(PointLight);
      light.intensity = 0.5;
      // light.color
      pointLightNode.transform.position = new Vector3(0, -1, 0);
    }
    // {
    //   const lightEntity = rootEntity.createChild("light");

    //   const spotLight = lightEntity.addComponent(SpotLight);

    //   // spotLight.angle = Math.PI / 6; // 散射角度
    //   // spotLight.penumbra = Math.PI / 12; // 半影衰减角度
    //   spotLight.color.set(1, 1, 1, 1);
    //   spotLight.intensity = 10;
    //   lightEntity.transform.setPosition(0, 10, 0);
    //   lightEntity.transform.setRotation(45, 0, 0);
    // }
  }
  innnerCar() {
    let q = new Quaternion();
    q.rotateX((30 * Math.PI) / 180);

    let m = new Matrix();
    Matrix.rotationQuaternion(q, m);

    let q2 = new Quaternion();
    q2.rotateY((30 * Math.PI) / 180);

    let m2 = new Matrix();
    Matrix.rotationQuaternion(q2, m2);
    let m3 = new Matrix();
    Matrix.multiply(m2, m, m3);
    let v = new Vector3();
    Vector3.transformToVec3(new Vector3(0, -1.5, 0), m3, v);
    // let outv = new Vector3();
    // Vector3.lerp(this.cameraEntity.transform.position.clone(), v, 1, outv);
    // this.cameraEntity.transform.position = outv;
    // return;
    let pos = this.cameraEntity.transform.position.clone();
    let tween = new TWEEN.Tween(pos); //创建一段tween动画
    tween.to(v, 1000); //4000：表示动画执行时间4000毫秒(ms)
    tween.onUpdate(() => {
      // console.log(11)
      this.cameraEntity.transform.position = pos;
      // clearTimeout(this.timmer || 0)
      // this.timmer=null
    });
    tween.onComplete(() => {
      console.log("onComplete");
    });
    tween.start();
    // this.cameraEntity.transform.position = v;
  }

  async loadSrc() {
    let { engine, rootEntity } = this;
    let carUrl = "";
    if (import.meta.env.MODE == "development") {
      carUrl = "./public/asset/benchi-1.glb";
    } else {
      carUrl = "./asset/benchi-1.glb";
    }
    let listSource = [carUrl];
    //@ts-ignore
    let [caModel, cubeMap2] = await this.loadSource([
      ...listSource,
      {
        urls: [
          "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*5w6_Rr6ML6IAAAAAAAAAAAAAARQnAQ",
          "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*TiT2TbN5cG4AAAAAAAAAAAAAARQnAQ",
          "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*8GF6Q4LZefUAAAAAAAAAAAAAARQnAQ",
          "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*D5pdRqUHC3IAAAAAAAAAAAAAARQnAQ",
          "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*_FooTIp6pNIAAAAAAAAAAAAAARQnAQ",
          "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*CYGZR7ogZfoAAAAAAAAAAAAAARQnAQ",
        ],
        type: AssetType.TextureCube,
      },
      {
        urls: [
          "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*Bk5FQKGOir4AAAAAAAAAAAAAARQnAQ",
          "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*_cPhR7JMDjkAAAAAAAAAAAAAARQnAQ",
          "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*trqjQp1nOMQAAAAAAAAAAAAAARQnAQ",
          "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*_RXwRqwMK3EAAAAAAAAAAAAAARQnAQ",
          "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*q4Q6TroyuXcAAAAAAAAAAAAAARQnAQ",
          "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*DP5QTbTSAYgAAAAAAAAAAAAAARQnAQ",
        ],
        type: AssetType.TextureCube,
      },
    ]);

    const { defaultSceneRoot } = caModel;
    let Mercedes = defaultSceneRoot.findByName("Mercedes");
    console.log(defaultSceneRoot);
    this.addTexture(defaultSceneRoot);
    Mercedes.transform.scale.set(0.02, 0.02, 0.02);
    Mercedes.transform.position.set(0, 0.5, 0);
    defaultSceneRoot.transform.position.set(0, -5, 0);
    this.rootEntity.addChild(defaultSceneRoot);
    let render = Mercedes.addComponent(Renderer2DScript);
    let that = this;
    render.dom.onclick = function () {
      if (render.dom.hasAttribute("data-1")) {
        that.cameraEntity.transform.position = new Vector3(0, 0, 9);
        render.dom.removeAttribute("data-1");
      } else {
        render.dom.setAttribute("data-1", "1");
        that.innnerCar();
      }
    };
    this.createBack();
    if (cubeMap2) {
      const skyMaterial = (this.scence.background.sky.material =
        new SkyBoxMaterial(engine)); // 添加天空盒材质
      skyMaterial.textureCubeMap = cubeMap2; // 设置立方体纹理
      //@ts-ignore
      this.scence.background.sky.mesh = PrimitiveMesh.createCuboid(
        engine,
        4,
        1,
        4
      ); // 设置天空盒网格
    }

    this.resetCamera();
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
        let spriteEntity = new Entity(this.engine, "sprite");
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

  addTexture(entity: Entity) {
    let circle = entity.findByName("Cylinder");
    let circle2 = entity.findByName("Cylinder.001");
    if (circle2) {
      circle2.destroy();
    }

    let renderMesh = circle.getComponent(MeshRenderer);
    let material = renderMesh.getMaterial();
    //@ts-ignore
    material.baseColor.r = 0;
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
    if (dom) {
      dom.style.left = "100000px";
      dom.style.top = "100000px";
      dom.style.opacity = "0";
      dom.style.pointerEvents = "none";
    }
    {
      let dom = document.querySelector(".circle") as HTMLElement;
      let button = document.querySelector(".buttom") as HTMLElement;
      let pause = document.querySelector(".pause") as HTMLElement;
      if (dom) {
        dom.style.display = "block";
        button.style.display = "block";
        pause.style.display = "block";
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
        width:40px;
        height:40px;
        position:absolute;
        top:-1000px;
        left:-1000px;
        background: #dde405;
        border-radius:50%;
        color:#333333`
    );

    document.body.appendChild(this.dom);
  }
  onStart() {
    this.camera = this.entity.parent.parent
      .findByName("camera")
      .getComponent(Camera);

    const ratio = 1; // window.devicePixelRatio;
    let ray = new Ray();
    this.camera.screenPointToRay(
      new Vector2(this.engine.canvas.width, this.engine.canvas.height).scale(
        ratio
      ),
      ray
    );
    ray.getPoint(1, this.screen);

    this.screen = this.entity
      .findByName("Mercedes Benz GLS 580")
      .transform.worldPosition.clone()
      .add(new Vector3(2, 3 - 0.5, 1));
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
    const { inputManager } = this.engine;
    //tween 更新
    TWEEN.update();
    //@ts-ignore
    if (inputManager.isPointerDown()) {
      // this.screenToViewPoint(inputManager.pointerPosition);
    }
    // console.log(this.screen);
    let p2 = this.screen; //new Vector3();
    // Vector3.transformToVec3(
    //   this.screen,
    //   this.camera.projectionMatrix.clone().invert(),
    //   p2
    // );
    // console.log(p2);
    var screen = new Vector3();
    this.camera.worldToScreenPoint(p2, screen);
    this.dom.style.left = `${screen.x / this.widthRatio}px`;
    this.dom.style.top = `${screen.y / this.heightRatio}px`;
    this.dom.style.opacity = "1";
    this.dom.style.pointerEvents = "all";
    this.hiddenDom();
  }
}
