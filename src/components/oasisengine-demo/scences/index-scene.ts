import {
  AnimationClip,
  Animator,
  AnimatorController,
  AnimatorControllerLayer,
  AnimatorStateMachine,
  AssetType,
  BlinnPhongMaterial,
  BoxColliderShape,
  Camera,
  CapsuleColliderShape,
  CharacterController,
  Color,
  DirectLight,
  DynamicCollider,
  DynamicColliderConstraints,
  Engine,
  Entity,
  GLTFResource,
  HitResult,
  Layer,
  Material,
  Matrix,
  MeshRenderer,
  ModelMesh,
  PBRBaseMaterial,
  PBRMaterial,
  PlaneColliderShape,
  PointerButton,
  PointLight,
  PrimitiveMesh,
  Quaternion,
  Ray,
  RenderFace,
  Scene,
  SceneManager,
  Script,
  SphereColliderShape,
  StaticCollider,
  Texture2D,
  TextureFormat,
  Vector2,
  Vector3,
  WebGLEngine,
  WrapMode,
} from "oasis-engine";
import AddColliderShape from "../addColliderShape";
import ControllerScript, { UserClick } from "../ControllerScript";
import { OrbitControl, FreeControl } from "@oasis-engine-toolkit/controls";
import { WireframeManager } from "@oasis-engine-toolkit/auxiliary-lines";
import UpdateVideoScript, {
  VideoMaterial,
  VideoMaterial2,
} from "../texture-vide";
import ScencePro, { LoadScence } from "./scene";
import LoadSrc from "../loadSrc/index";
// import * as dat from "dat.gui";
import PlayScrean from "../components/play_screan.vue";
import { createApp, h } from "vue";
import TWEEN from "@tweenjs/tween.js";
// const gui = new dat.GUI();
export enum State {
  Run = "Run",
  Idle = "Idle",
  Jump = "Jump_In",
  Fall = "Fall",
  Landing = "Landing",
}
export default class IndexScene extends ScencePro {
  //   engine: WebGLEngine | Engine | null = null;
  //   rootEntity: Entity | null = null;
  animator: Animator | null = null;
  npc: Entity | null = null;
  camera: Entity | null = null;
  orbit: OrbitControl;
  video: any;
  _dialogDom: HTMLElement | null = null;
  //   scence: Scene;
  constructor(sceneManager: SceneManager, engine: Engine) {
    super(sceneManager, engine, "index_scence");
    // this.scence = new Scene(sceneManager.engine);
    // this.engine = engine;

    this.scence.ambientLight.diffuseSolidColor.set(1, 1, 1, 1);
    this.scence.ambientLight.diffuseIntensity = 0.4;
    // this.rootEntity = this.scence.createRootEntity("index");

    this.initCamera();
    this.initLight();
    this.loadSrc();
    // this.loadSrc32();
  }
  set dialogDom(val) {
    this._dialogDom = val;
  }
  get dialogDom() {
    return this._dialogDom;
  }
  // 相机初始化
  initCamera() {
    let { rootEntity } = this;
    if (rootEntity) {
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

      this.orbit = controal;
      this.camera = cameraEntity;

      // const physicsSphere = new SphereColliderShape();
      // physicsSphere.radius = 1;

      // physicsSphere.material.staticFriction = 100000;
      // physicsSphere.material.dynamicFriction = 99999;
      // // physicsSphere.material.bounciness = 0;
      // physicsSphere.material.bounceCombine = 999999990;
      // const sphereCollider = cameraEntity.addComponent(DynamicCollider);
      // sphereCollider.isKinematic = false;
      // sphereCollider.angularVelocity = new Vector3(0, 0, 0);
      // sphereCollider.angularDamping = 0;
      // sphereCollider.maxAngularVelocity = 0;
      // sphereCollider.linearVelocity = new Vector3(0, 0, 0);
      // sphereCollider.constraints = DynamicColliderConstraints.FreezePositionZ;

      // sphereCollider.addShape(physicsSphere);

      // controal.autoRotate = true;
    }
  }
  initLight() {
    let { rootEntity } = this;
    if (rootEntity) {
      const lightNode = rootEntity.createChild("lightNode");
      lightNode.addComponent(DirectLight);
      // lightNode.transform.position.set(0, 10, 0);
      lightNode.transform.lookAt(new Vector3(0, 0, 0));
      lightNode.transform.rotate(new Vector3(0, 90, 0));
      const pointLightNode = rootEntity.createChild("pointLight");
      let light = pointLightNode.addComponent(PointLight);
      // light.color
      pointLightNode.transform.position = new Vector3(0, 50, 0);
      lightNode.transform.lookAt(new Vector3(0, 0, 0));
    }
  }
  resetCamera() {
    this.orbit.minPolarAngle = (50 * Math.PI) / 180;
    this.orbit.maxPolarAngle = (90 * Math.PI) / 180;
    this.orbit.enableRotate = true;
    this.camera.transform.position = new Vector3(0, 5, 5);
  }
  async loadSrc() {
    let { engine, rootEntity } = this;
    if (engine && rootEntity) {
      let senceUrl = "";
      if (import.meta.env.MODE == "development") {
        senceUrl = "./public/asset/jeemoo/jeemoo_1.glb"; //"./public/asset/out-physics.glb";
      } else {
        senceUrl = "./asset/jeemoo/jeemoo_1.glb"; //"./asset/out-physics.glb";
      }
      // let carUrl = "";
      // if (import.meta.env.MODE == "development") {
      //   carUrl = "./public/asset/benchi111.glb";
      // } else {
      //   carUrl = "./asset/benchi111.glb";
      // }
      // AudiR8
      // let carUrlAudiR8 = "";
      // if (import.meta.env.MODE == "development") {
      //   carUrlAudiR8 = "./public/asset/laoyeche1.glb";
      // } else {
      //   carUrlAudiR8 = "./asset/laoyeche1.glb";
      // }
      let newCar = "";
      if (import.meta.env.MODE == "development") {
        newCar = "./public/asset/car/0704/car.gltf"; //"./public/asset/laoyeche1.glb";
      } else {
        newCar = "./asset/car/0704/car.gltf"; //"./asset/laoyeche1.glb";
      }
      // let personUrl = "";

      // if (import.meta.env.MODE == "development") {
      //   personUrl = "./public/asset/person/RobotExpressive.glb";
      // } else {
      //   personUrl = "./asset/person/RobotExpressive.glb";
      // }
      let personUrl2 = "";
      if (import.meta.env.MODE == "development") {
        personUrl2 = "./public/asset/person/little_girl_2.glb";
      } else {
        personUrl2 = "./asset/person/little_girl_2.glb";
      }

      // personUrl =
      //   "https://mmbizwxaminiprogram-1258344707.cos.ap-guangzhou.myqcloud.com/xr-frame/demo/miku.glb";

      let playerListUrl = [
        "https://gw.alipayobjects.com/os/OasisHub/440001585/5407/Doggy_Demo.gltf",
        "https://gw.alipayobjects.com/os/OasisHub/440001585/7205/Anim_Run.gltf",
        "https://gw.alipayobjects.com/os/OasisHub/440001585/3380/Anim_Idle.gltf",
        "https://gw.alipayobjects.com/zos/OasisHub/440001585/6990/T_Doggy_1_diffuse.png",
        "https://gw.alipayobjects.com/zos/OasisHub/440001585/3072/T_Doggy_normal.png",
        "https://gw.alipayobjects.com/zos/OasisHub/440001585/5917/T_Doggy_roughness.png",
        "https://gw.alipayobjects.com/zos/OasisHub/440001585/2547/T_Doggy_1_ao.png",
      ];

      let sourceList: string[] = [
        senceUrl,
        ...playerListUrl,
        // carUrl,
        // carUrlAudiR8,
        newCar,
        // personUrl,
        personUrl2,
      ];

      // await LoadSrc.loadAll(sourceList);
      try {
        //@ts-ignore
        let [
          mianScenc, //场景
          charactorPlayer, // 角色
          runAni, // 跑
          idkeAni, //停止动画
          diffuse,
          normal, //法线纹理
          roughness, // 金属粗糙度纹理
          ao, // 阴影遮蔽纹理
          // car,
          // AudiR8,
          newCarModel,
          // personModel,
          personModel2,
        ] = await this.loadSource(
          //@ts-ignore
          [...sourceList]
        );

        const { defaultSceneRoot } = mianScenc;
        this.hiddenEle(defaultSceneRoot);

        rootEntity?.addChild(defaultSceneRoot);

        let screan = defaultSceneRoot.findByName("Square_Screen01_Video");
        let squareTree = defaultSceneRoot.findByName("square_tree_leaf004.002");
        // let p = AddColliderShape.addPlan(defaultSceneRoot, "grass");
        // this.wireframe.addEntityWireframe(p);
        // this.createVideo(screan);
        this.createVideo2(screan);
        this.createPhysXPhysics(squareTree);
        if (defaultSceneRoot) {
          const { defaultSceneRoot, materials } = charactorPlayer;
          {
            // 添加动画
            this.setPlayerAnimation(defaultSceneRoot, idkeAni, runAni);
            // 设置材质
            this.setPlayerMaterials(materials, diffuse, normal, roughness, ao);

            // let carsNode = rootEntity.createChild("car");
            // @ts-ignore
            // this.createCar(carsNode, car);

            // let carsNode2 = rootEntity.createChild("ca2r");
            // if (AudiR8) {
            //   this.createCar2(carsNode2, AudiR8);
            // }

            let carNode3 = rootEntity.createChild("car3");

            let c = newCarModel as GLTFResource;
            this.createCar3(carNode3, c);
          }

          let npc = rootEntity.createChild("npc");
          npc.transform.scale.set(2, 2, 2);
          defaultSceneRoot.transform.position.set(0, -0.24, 0);
          defaultSceneRoot.transform.rotateByAxis(new Vector3(0, 1, 0), 180);
          npc.addChild(defaultSceneRoot);
          this.npc = npc;
          this.npc.transform.position.set(0, 0, 0);

          this.setPlayer(defaultSceneRoot);

          this.testModel();
          // this.resetCamera();
        }
        this.setPersonModel(personModel2);
        // this.setPersonModel2(personModel);
      } catch (err) {
        console.log(err);
      } finally {
        // engine.run();
      }
    }
  }
  hiddenEle(defaultSceneRoot: Entity) {
    let world_ground = defaultSceneRoot.findByName("world_ground layer.004");
    world_ground.isActive = false;
    let grass = defaultSceneRoot.findByName("grass");
    grass.isActive = false;
    let cur = defaultSceneRoot.findByName("Curve001");
    console.log(cur);
    // let stare = defaultSceneRoot.findByName("08 square_stairs");
    // let renderer = stare.getComponent(MeshRenderer);
    // const mesh = <ModelMesh>renderer.mesh;
    // console.log(mesh.getPositions());
    // const { vertexCount } = mesh;
    // const positions = mesh.getPositions();
    // console.log(vertexCount);
    // console.log(mesh.shaderData.getMatrix("u_MVMat"));
  }
  //添加人物
  setPlayer(defaultSceneRoot) {
    const physicsCapsule = new CapsuleColliderShape();
    physicsCapsule.radius = 0.15;
    physicsCapsule.height = 0.5;
    physicsCapsule.position.set(0, 0, 0);

    const characterController = this.npc.addComponent(CharacterController);
    characterController.addShape(physicsCapsule);

    const userController = this.npc.addComponent(ControllerScript);
    userController.targetCamera(this.camera);
    userController.targetCharacter(defaultSceneRoot);
    this.npc.addComponent(UserClick);
    if (import.meta.env.MODE == "development") {
      this.wireframe.addEntityWireframe(this.npc);
    }
  }
  // 设置动画
  setPlayerAnimation(defaultSceneRoot, idkeAni, runAni) {
    const animator = defaultSceneRoot.addComponent(Animator);
    const animatorController = new AnimatorController();
    const layer = new AnimatorControllerLayer("layer");
    const animatorStateMachine = new AnimatorStateMachine();
    animatorController.addLayer(layer);
    animator.animatorController = animatorController;
    layer.stateMachine = animatorStateMachine;
    this.animator = animator;
    const animationsRun = runAni.animations;
    if (animationsRun) {
      animationsRun.forEach((clip: AnimationClip) => {
        const animatorState = animatorStateMachine.addState(clip.name);
        animatorState.clip = clip;
      });
    }
    const animationsIdel = idkeAni.animations;
    if (animationsIdel) {
      animationsIdel.forEach((clip: AnimationClip) => {
        const animatorState = animatorStateMachine.addState(clip.name);
        animatorState.clip = clip;
      });
      animator.play(State.Idle);
    }
  }
  // 设置材质
  setPlayerMaterials(materials, diffuse, normal, roughness, ao) {
    console.log(materials);
    for (let i = 0, n = materials.length; i < n; i++) {
      const material = materials[i];
      (<PBRMaterial>material).baseTexture = diffuse;
    }
    for (let i = 0, n = materials.length; i < n; i++) {
      const material = materials[i];
      (<PBRMaterial>material).normalTexture = normal;
    }
    for (let i = 0, n = materials.length; i < n; i++) {
      const material = materials[i];
      (<PBRMaterial>material).roughnessMetallicTexture = roughness;
    }
    for (let i = 0, n = materials.length; i < n; i++) {
      const material = materials[i];
      (<PBRMaterial>material).occlusionTexture = ao;
    }
  }
  setPersonModel(resource: GLTFResource) {
    let personNode = this.rootEntity.createChild("person_node");

    let personModel = resource.defaultSceneRoot.clone();

    personNode.addChild(personModel);
    personModel.transform.scale.set(-1.5, -1.5, -1.5);
    personNode.transform.position.set(-3, -1.5, -5);
    personModel.name = "person_model";
    console.log(personModel);
    let personScript = personModel.addComponent(PersonScript);
    // console.log(resource.animations);
    // // resource.animations.forEach((item) => {
    // //   item.name = "Idle";
    // // });
    personScript.setAnimationList(resource.animations || []);
  }
  setPersonModel2(resource: GLTFResource) {
    let personNode = this.rootEntity.createChild("person_node");

    let personModel = resource.defaultSceneRoot.clone();

    personNode.addChild(personModel);
    personModel.transform.scale.set(-0.4, 0.4, -0.4);
    personNode.transform.position.set(-5, -1.5, -5);
    personModel.name = "person_model";
    console.log(personModel);
    let personScript = personModel.addComponent(PersonScript2);
    console.log(resource.animations);
    // resource.animations.forEach((item) => {
    //   item.name = "Idle";
    // });
    personScript.setAnimationList(resource.animations || []);
  }
  async createVideo2(screan: Entity) {
    let renderer = screan.getComponent(MeshRenderer);
    let url = "";
    if (import.meta.env.MODE == "development") {
      url = "./public/asset/mp4.mp4";
    } else {
      url = "./asset/mp4.mp4";
    }

    let video = document.createElement("video");
    video.autoplay = false;
    video.loop = true;
    video.muted = false;
    video.setAttribute("crossOrigin", "Anonymous");
    video.setAttribute("playsinline", "true");
    video.setAttribute("webkit-playsinline", "true");
    video.setAttribute("x5-video-player-type", "h5");
    video.setAttribute("style", "position:absolute;top:10000px");
    document.body.append(video);
    let material = new VideoMaterial2(this.engine, screan);
    video.src = url;
    this.video = video;
    let texture = new Texture2D(
      this.engine,
      480,
      272,
      TextureFormat.R8G8B8,
      false
    );
    texture.setImageSource(this.video);
    //@ts-ignore
    material.texture = texture;
    let script = screan.addComponent(UpdateVideoScript);
    script.video = this.video;
    script.texture = texture;
    renderer.setMaterial(material);
  }
  async createVideo(screan: Entity) {
    let renderer = screan.getComponent(MeshRenderer);
    let url = "";
    if (import.meta.env.MODE == "development") {
      url = "./public/asset/mp4.mp4";
    } else {
      url = "./asset/mp4.mp4";
    }

    let material = new VideoMaterial(this.engine, screan);
    material.src = url;

    // 480*270
    // material.src =
    //   "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/file/A*p_f5QYjE_2kAAAAAAAAAAAAAARQnAQ";
    // material.src =
    //   "https://view.2amok.com/20191010/22bed2ddfcae38db643de670c300712f.mp4";
    // setTimeout(() => {

    // }, 10000);

    renderer.setMaterial(material);
    this.video = material.video;
    // @ts-ignore
    screan.video = this.video;
    console.log(renderer.mesh.bounds);
    let bounds = renderer.mesh.bounds;
    let size = new Vector3();
    bounds.getExtent(size);
    console.log(size);
    const boxCollider = screan.addComponent(StaticCollider);
    const physicsBox = new BoxColliderShape();
    physicsBox.size = new Vector3(5, 20, 50);
    physicsBox.isTrigger = false;

    physicsBox.position.set(0, 20, 0);

    boxCollider.addShape(physicsBox);
    if (import.meta.env.MODE == "development") {
      this.wireframe.addEntityWireframe(screan);
    }

    return;
    {
      let material = new PBRMaterial(this.engine);
      material.baseColor.r = 0;
      renderer.setMaterial(material);
      this.engine.resourceManager
        .load<Texture2D>({
          url: "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*ApFPTZSqcMkAAAAAAAAAAAAAARQnAQ",

          type: AssetType.Texture2D,
        })
        .then((res) => {
          material.baseTexture = res;
          setTimeout(() => {
            this.engine.resourceManager
              .load<Texture2D>({
                url: "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*L2GNRLWn9EAAAAAAAAAAAAAAARQnAQ",
                type: AssetType.Texture2D,
              })
              .then((res) => {
                material.baseTexture = res;
              });
          }, 5000);
        });
    }

    // video.onplaying = () => {
    //   const texture = new Texture2D(
    //     this.engine,
    //     1,
    //     1,
    //     TextureFormat.R8G8B8,
    //     false
    //   );
    //   let material = new VideoMaterial(this.engine);

    //   material.texture = texture;
    //   renderer.setMaterial(material);
    //   const script = this.rootEntity.addComponent(UpdateVideoScript);
    //   script.video = video;
    //   script.texture = texture;
    // };

    // const material = renderer.getMaterial();

    // // @ts-ignore
    // material.baseColor.r = 0;
    // // @ts-ignore
    // material.baseColor.g = 0;
    // // @ts-ignore
    // material.baseColor.b = 0;
  }
  createPhysXPhysics(tree: Entity) {
    let renderer = tree.getComponent(MeshRenderer);
    // let mesh = new MeshRenderer()
    // tree.getComponents(MeshRenderer)
    console.log(renderer);
    const material = new BlinnPhongMaterial(this.engine);
    material.baseColor.r = 0;

    // 通过 `setMaterial` 设置当前 renderer 的第 i 个材质, 默认第 0 个。
    renderer.setMaterial(material);
  }
  createCar2(carsNode: Entity, car) {
    // @ts-ignore
    carsNode.transform.position = new Vector3(8, -1.3, 0);
    // @ts-ignore
    carsNode.addChild(car.defaultSceneRoot);
    // @ts-ignore
    car.defaultSceneRoot.transform.scale = new Vector3(3, 3, 3);
    console.log(car.defaultSceneRoot.name);
    let car2 = car.defaultSceneRoot.addComponent(Car2);

    car2.setDom(this._dialogDom);

    const physicsBox = new BoxColliderShape();
    physicsBox.size = new Vector3(3, 1, 1);
    physicsBox.position.set(0, 0, 0);
    physicsBox.isTrigger = false;
    const boxCollider = car.defaultSceneRoot.addComponent(StaticCollider);
    physicsBox.material.bounceCombine = 0;
    physicsBox.material.bounciness = 0;
    boxCollider.addShape(physicsBox);
    if (import.meta.env.MODE == "development") {
      this.wireframe.addEntityWireframe(carsNode);
    }
  }
  createCar3(carsNode: Entity, car: GLTFResource) {
    let carModel = car.defaultSceneRoot.clone();
    let list2 = [
      "pSphere3 (1)", //
      "pSphere3 (2)",
      "pSphere3 (3)",
      "pSphere3 (4)",
      "pSphere3 (5)",
      "pSphere3",
      "pSphere4 (1)", //
      "pSphere4 (2)",
      "pSphere4 (3)",
      "pSphere4 (4)",
      "pSphere4 (5)",
      "pSphere4",
    ];
    list2.forEach((item) => {
      let obj = carModel.findByName(item);
      let mesh = obj.getComponent(MeshRenderer);
      let material = mesh.getMaterial() as PBRBaseMaterial;
      // material.isTransparent = true;
      // material.baseColor = new Color(0, 0, 0, 0);
      obj.isActive = false;
    });
    let per = 0.8;
    // @ts-ignore
    carsNode.transform.position = new Vector3(-12, -0.8, 5);
    carsNode.transform.setRotation(0, 0, 0);
    // @ts-ignore
    carsNode.addChild(carModel);
    // @ts-ignore
    carModel.transform.scale = new Vector3(0.4 * per, 0.4 * per, 0.4 * per);
    console.log(carModel.name);

    carModel.addComponent(Car);
    // const physicsBox = new BoxColliderShape();
    // let pos = new Vector3(-0.3, 0, -0.4);

    // physicsBox.size = new Vector3(27, 10, 11);
    // physicsBox.position = pos;

    // physicsBox.isTrigger = false;
    // const boxCollider = carModel.addComponent(StaticCollider);
    // physicsBox.material.bounceCombine = 0;
    // physicsBox.material.bounciness = 0;
    // boxCollider.addShape(physicsBox);
    // physicsBox.isTrigger = true;
    if (import.meta.env.MODE == "development") {
      this.wireframe.addEntityWireframe(carsNode);
      // const debugInfo = {
      //   sizeX: physicsBox.size.x,
      //   sizeY: physicsBox.size.y,
      //   sizeZ: physicsBox.size.z,
      //   posX: physicsBox.position.x,
      //   posY: physicsBox.position.y,
      //   posZ: physicsBox.position.z,
      //   speed: 1,
      // };
      // gui.add(debugInfo, "sizeX", -20, 30).onChange((v) => {
      //   this.wireframe.onUpdate(2);
      //   physicsBox.size.x = v;
      //   this.wireframe.clear();
      //   this.wireframe.addEntityWireframe(carsNode);
      // });
      // gui.add(debugInfo, "sizeY", -20, 30).onChange((v) => {
      //   physicsBox.size.y = v;
      //   this.wireframe.clear();
      //   this.wireframe.addEntityWireframe(carsNode);
      // });
      // gui.add(debugInfo, "sizeZ", -20, 30).onChange((v) => {
      //   physicsBox.size.z = v;
      //   this.wireframe.clear();
      //   this.wireframe.addEntityWireframe(carsNode);
      // });
      // gui.add(debugInfo, "posX", -20, 30).onChange((v) => {
      //   physicsBox.position.x = v;
      //   this.wireframe.clear();
      //   this.wireframe.addEntityWireframe(carsNode);
      // });
      // gui.add(debugInfo, "posY", -20, 30).onChange((v) => {
      //   physicsBox.position.y = v;
      //   this.wireframe.clear();
      //   this.wireframe.addEntityWireframe(carsNode);
      // });
      // gui.add(debugInfo, "posZ", -20, 30).onChange((v) => {
      //   physicsBox.position.z = v;
      //   this.wireframe.clear();
      //   this.wireframe.addEntityWireframe(carsNode);
      // });
    }
  }

  createCar(carsNode: Entity, car) {
    // @ts-ignore
    carsNode.transform.position = new Vector3(0, -2, -18);
    // @ts-ignore
    carsNode.addChild(car.defaultSceneRoot);
    // @ts-ignore
    car.defaultSceneRoot.transform.scale = new Vector3(0.02, 0.02, 0.02);
    car.defaultSceneRoot.addComponent(Car);

    console.log(
      "Mercedes Benz GLS 580",
      car.defaultSceneRoot.findByName("Mercedes Benz GLS 580")
    );

    const physicsBox = new BoxColliderShape();
    physicsBox.size = new Vector3(200, 400, 500);
    physicsBox.position.set(0, 0, 0);
    physicsBox.isTrigger = false;
    const boxCollider = car.defaultSceneRoot.addComponent(StaticCollider);
    physicsBox.material.bounceCombine = 0;
    physicsBox.material.bounciness = 0;
    boxCollider.addShape(physicsBox);
    if (import.meta.env.MODE == "development") {
      this.wireframe.addEntityWireframe(carsNode);
    }
  }

  testModel() {
    let wireframe = this.wireframe;
    addPlane(
      this.rootEntity,
      new Vector2(10, 6),
      new Vector3(0, -1.5, 0),
      new Quaternion()
    );
    let dom = document.querySelector(".circle") as HTMLElement;
    let pc =
      !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    if (!pc) {
      dom.style["pointer-events"] = "all";
      dom.style["opacity"] = "1";
    }

    // addStair(
    //   this.rootEntity,
    //   new Vector3(1, 0.3, 0.5),
    //   new Vector3(3, -1.5, 1),
    //   new Quaternion()
    // );
    // addStair(
    //   this.rootEntity,
    //   new Vector3(1, 0.3, 0.5),
    //   new Vector3(3, -1.5 + 0.3, 1.5),
    //   new Quaternion()
    // );
    // addStair(
    //   this.rootEntity,
    //   new Vector3(1, 0.3, 0.5),
    //   new Vector3(3, -1.5 + 0.6, 2),
    //   new Quaternion()
    // );
    // addStair(
    //   this.rootEntity,
    //   new Vector3(1, 5.3, 0.2),
    //   new Vector3(3, -1.5 + 0.6, 2),
    //   new Quaternion(),
    //   true
    // );
    // const slope = new Quaternion();
    // Quaternion.rotationEuler(45, 0, 0, slope);
    // let ent = addBox(
    //   this.rootEntity,
    //   new Vector3(4, 4, 0.01),
    //   new Vector3(0, -1.5, 1),
    //   slope.normalize()
    // );
    // wireframe.addEntityWireframe(ent);
    function addBox(
      rootEntity: Entity,
      size: Vector3,
      position: Vector3,
      rotation: Quaternion
    ): Entity {
      const mtl = new PBRMaterial(rootEntity.engine);
      mtl.roughness = 0.2;
      mtl.metallic = 0.8;
      mtl.baseColor.set(1, 1, 0, 1.0);

      const boxEntity = rootEntity.createChild();
      const renderer = boxEntity.addComponent(MeshRenderer);
      renderer.mesh = PrimitiveMesh.createCuboid(
        rootEntity.engine,
        size.x,
        size.y,
        size.z
      );
      renderer.setMaterial(mtl);
      boxEntity.transform.position = position;
      boxEntity.transform.rotationQuaternion = rotation;

      const physicsBox = new BoxColliderShape();
      physicsBox.size = size;
      physicsBox.isTrigger = false;
      const boxCollider = boxEntity.addComponent(StaticCollider);
      boxCollider.addShape(physicsBox);
      console.log(renderer.mesh.bounds);

      return boxEntity;
    }

    function addPlane(
      rootEntity: Entity,
      size: Vector2,
      position: Vector3,
      rotation: Quaternion
    ): Entity {
      const mtl = new PBRMaterial(rootEntity.engine);
      mtl.baseColor.set(
        0.2179807202597362,
        0.2939682161541871,
        0.31177952549087604,
        0.1
      );
      mtl.alphaCutoff = 1;
      mtl.roughness = 0.0;
      mtl.metallic = 0.0;
      mtl.renderFace = RenderFace.Double;
      const planeEntity = rootEntity.createChild();

      const renderer = planeEntity.addComponent(MeshRenderer);
      renderer.mesh = PrimitiveMesh.createPlane(
        rootEntity.engine,
        size.x,
        size.y
      );
      renderer.setMaterial(mtl);
      planeEntity.transform.position = position;
      planeEntity.transform.rotationQuaternion = rotation;

      const physicsPlane = new PlaneColliderShape();
      physicsPlane.isTrigger = false;

      const planeCollider = planeEntity.addComponent(StaticCollider);
      planeCollider.addShape(physicsPlane);

      return planeEntity;
    }
    function addStair(
      rootEntity: Entity,
      size: Vector3,
      position: Vector3,
      rotation: Quaternion,
      isAddClick: boolean = false
    ): Entity {
      const mtl = new PBRMaterial(rootEntity.engine);
      mtl.roughness = 0.5;
      mtl.baseColor.set(0.9, 0.9, 0.9, 1.0);
      const mesh = PrimitiveMesh.createCuboid(
        rootEntity.engine,
        size.x,
        size.y,
        size.z
      );

      const stairEntity = rootEntity.createChild();
      stairEntity.transform.position = position;
      stairEntity.transform.rotationQuaternion = rotation;
      const boxCollider = stairEntity.addComponent(StaticCollider);
      {
        const level = stairEntity.createChild();
        const renderer = level.addComponent(MeshRenderer);
        renderer.mesh = mesh;
        renderer.setMaterial(mtl);
        const physicsBox = new BoxColliderShape();
        physicsBox.size = size;
        boxCollider.addShape(physicsBox);
      }
      if (isAddClick) {
        stairEntity.addComponent(ChangeCence);

        // wireframe.addEntityWireframe(stairEntity);
      }
      return stairEntity;
    }
  }
}
class ChangeCence extends Script {
  loadScence: LoadScence;
  camera: Entity;
  origin: Vector3;
  direction: Vector3 = new Vector3();
  ray: Ray;
  onPointerClick() {
    console.log("Click");
    // this.loadScence.toScence("model_scence");
    this.loadScence.toScence("model_scence_2");
  }
  onAwake() {
    this.loadScence = LoadScence.getInstance();
    this.camera = this.entity.parent.findByName("Camera");
    this.origin = this.camera.transform.position;
    this.camera.transform.getWorldForward(this.direction);
  }
  getRay() {
    this.origin = this.camera.transform.position;
    this.camera.transform.getWorldForward(this.direction);
    this.ray = new Ray(this.origin, this.direction);
  }
  onUpdate() {
    this.getRay();
    // console.log(this.ray);
    const hit = new HitResult();
    let result = this.engine.physicsManager.raycast(
      this.ray,
      Number.MAX_VALUE,
      Layer.Everything,
      hit
    );

    if (result && hit.entity.name == "car") {
      console.log(hit.entity.name);
    }
  }
}
class Car extends Script {
  loadScence: LoadScence;
  camera: Entity;
  origin: Vector3;
  direction: Vector3 = new Vector3();
  ray: Ray;
  carEntity: Entity | null = null;

  widthRatio: number;
  heightRatio: number;
  dom: HTMLElement;
  camerComent: Camera;
  carMaterMap = {};
  carColorMap = {};

  list =
    "pSphere4,pSphere3,polySurface8849,polySurface8860,polySurface8885,polySurface8886,polySurface8836,polySurface8838,polySurface8535,polySurface8551,polySurface8563,polySurface8565,polySurface8585,polySurface8586,polySurface8587,polySurface8624,polySurface8625,polySurface8626,polySurface8725,polySurface8732,polySurface8733,polySurface8734,polySurface8736,polySurface8737,polySurface8756,polySurface8773,polySurface8803,polySurface8805,polySurface8823,R_Front_41,R_Front_18,pSphere4 (1),pSphere3 (1),L_Front_23,L_Front_46,pSphere4 (2),pSphere3 (2),polySurface8514,pSphere4 (3),pSphere3 (3),L_after_34,pSphere4 (4),pSphere3 (4),pSphere4 (5),pSphere3 (5)";
  orbit: OrbitControl;

  constructor(entity: Entity) {
    super(entity);
    this.widthRatio =
      //@ts-ignore
      this.engine.canvas.width / this.engine.canvas._webCanvas.clientWidth;

    this.heightRatio =
      //@ts-ignore
      this.engine.canvas.height / this.engine.canvas._webCanvas.clientHeight;
    console.log(this.widthRatio, this.heightRatio);
    this.addphysicsBox();
  }

  onPointerClick() {
    this.loadScence.toScence("model_scence_2");
    let dom = document.querySelector(".circle") as HTMLElement;
    // let button = document.querySelector(".buttom") as HTMLElement;
    // let pause = document.querySelector(".pause") as HTMLElement;
    let tip = document.querySelector(".tip") as HTMLElement;
    let tip_screan_play = document.querySelector(
      ".tip_screan_play"
    ) as HTMLElement;
    let video = document.querySelector("video") as HTMLVideoElement;
    if (dom) {
      dom.style.display = "none";
      // button.style.display = "none";
      // pause.style.display = "none";
      tip.style.display = "none";
      tip_screan_play.style.display = "none";
      video.pause();
    }

    // this.getCarInfo();
  }
  addphysicsBox() {
    const physicsBox = new BoxColliderShape();
    let pos = new Vector3(-0.3, 0, -0.4);
    physicsBox.size = new Vector3(27, 10, 11);
    physicsBox.position = pos;
    physicsBox.isTrigger = false;

    const boxCollider = this.entity.addComponent(DynamicCollider);
    physicsBox.material.bounceCombine = 0;
    physicsBox.material.bounciness = 0;
    physicsBox.material.staticFriction = 999999999;
    physicsBox.material.dynamicFriction = 999999999;

    boxCollider.addShape(physicsBox);
    boxCollider.isKinematic = true;
  }
  onAwake() {
    this.loadScence = LoadScence.getInstance();
    this.camera = this.entity.parent.parent.findByName("Camera");
    this.camerComent = this.camera.getComponent(Camera);
    this.orbit = this.camera.getComponent(OrbitControl);
    this.origin = this.camera.transform.position;
    this.camera.transform.getWorldForward(this.direction);
    // this.createButton();
  }
  getRay() {
    this.origin = this.camera.transform.position;
    this.camera.transform.getWorldForward(this.direction);
    this.ray = new Ray(this.origin, this.direction);
  }
  setColor(children) {
    let list = this.list.split(",");
    children.forEach((item) => {
      if (item.children.length) {
        this.setColor(item.children);
      }
      let renderMesh = item.getComponent(MeshRenderer);
      if (renderMesh) {
        let material = renderMesh.getMaterial() as PBRMaterial;
        // && item.name.indexOf("polySurface") < 0
        if (item.name !== "shadow" && material && list.indexOf(item.name) < 0) {
          // material.baseColor.a = 1;
          // material.isTransparent = false;
          // material.baseColor.r = 0;
          // material.baseColor.a = 1;
          // material.baseTexture = this.carMaterMap[item.name];
          // material.isTransparent = false;
        }
      }
    });
  }
  clearUp(children) {
    // return;
    let list = this.list.split(",");
    children.forEach((item) => {
      if (item.children.length) {
        this.clearUp(item.children);
      }
      let renderMesh = item.getComponent(MeshRenderer);
      if (renderMesh) {
        // item.isActive = false;
        let material = renderMesh.getMaterial() as PBRMaterial;

        if (
          material &&
          item.name !== "shadow" &&
          item.name !== "polySurface8603" &&
          list.indexOf(item.name) < 0
        ) {
          // this.carMaterMap[item.name] = material;
          if (material.baseColor) {
            // material.baseColor.a = 1;
            // material.isTransparent = true;
          }
        }
      }
    });
  }

  getCarInfo() {
    console.log(this.entity);
    return;
    // this.carEntity = this.entity.findByName("Mercedes Benz GLS 580");
    let renderer = this.entity.getComponent(MeshRenderer);
    // console.log(renderer);
    if (renderer) {
      let material = renderer.getMaterial() as PBRMaterial;

      material.baseColor = new Color(
        Math.random(),
        Math.random(),
        Math.random(),
        1
      );
    }

    // console.log(mesh.getMaterial());
  }
  createButton() {
    let url = "";
    if (import.meta.env.MODE == "development") {
      url = "./public/asset/mp4.mp4";
    } else {
      url = "./asset/mp4.mp4";
    }
    let div = document.createElement("div");
    div.className = "to_car";
    div.style.position = "absolute";
    div.style.width = "230px";
    // div.style.height = "100px";
    // div.style.backgroundColor = "red";
    div.style.transform = "translateX(-115px) translateY(-180px)";
    div.style.display = "none";
    let video = document.createElement("video");
    video.autoplay = false;
    video.loop = true;
    video.muted = false;
    video.setAttribute("crossOrigin", "Anonymous");
    video.setAttribute("playsinline", "true");
    video.setAttribute("webkit-playsinline", "true");
    video.setAttribute("x5-video-player-type", "h5");
    video.src = url;
    video.style.width = "100%";
    video.style.height = "100%";
    video.setAttribute("controls", "true");
    div.appendChild(video);
    document.body.appendChild(div);
    this.dom = div;
  }
  hiddenDom() {
    let markWp = this.entity.transform.worldPosition.clone();
    let position = this.camera.transform.position.clone();
    let targt = this.camera.getComponent(OrbitControl).target.clone();
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
    this.getRay();
    // this.hiddenDom();
    // console.log(this.ray);
    const hit = new HitResult();
    let result = this.engine.physicsManager.raycast(
      this.ray,
      Number.MAX_VALUE,
      Layer.Everything,
      hit
    );

    if (result && hit.entity.name != "npc") {
      if (hit.entity.name == "car") {
        // this.clearUp(this.entity.children);
        this.orbit.maxPolarAngle = (60 * Math.PI) / 180;
      } else {
        this.orbit.maxPolarAngle = (90 * Math.PI) / 180;
        // this.setColor(this.entity.children);
      }
      // this.getCarInfo();
    } else {
      if (this.entity) {
        this.orbit.maxPolarAngle = (90 * Math.PI) / 180;
        // this.setColor(this.entity.children);
      }
    }
    if (this.dom) {
      let p2 = this.entity.transform.worldPosition.clone(); //new Vector3();
      var screen = new Vector3();
      this.camerComent.worldToScreenPoint(p2, screen);
      this.dom.style.left = `${screen.x / this.widthRatio}px`;
      this.dom.style.top = `${screen.y / this.heightRatio}px`;
    }
  }
}
class Car2 extends Script {
  loadScence: LoadScence;
  camera: Entity;
  origin: Vector3;
  direction: Vector3 = new Vector3();
  ray: Ray;
  carEntity: Entity | null = null;
  color = new Color(Math.random(), Math.random(), Math.random(), 1);
  dom2d: HTMLElement;
  constructor(enty: Entity) {
    super(enty);
    console.log("1");
  }
  setDom(dom: HTMLElement) {
    console.log("2");
    this.loadScence = LoadScence.getInstance();
    this.camera = this.entity.parent.parent.findByName("Camera");
    this.origin = this.camera.transform.position;
    this.camera.transform.getWorldForward(this.direction);
    this.setColor();

    let render2D = this.entity
      .findByName("Circle.005")
      .addComponent(Renderer2DScript);
    render2D.dom = dom;
    this.dom2d = dom;
  }
  onPointerClick() {
    console.log("Click");
    // this.loadScence.toScence("model_scence");
    this.getCarInfo();
  }
  onAwake() {}
  setColor() {
    // return;
    this.entity.children.forEach((item) => {
      let renderMesh = item.getComponent(MeshRenderer);
      let material = renderMesh.getMaterial() as PBRMaterial;
      material.baseColor = this.color;
      material.isTransparent = false;
    });
  }
  getRay() {
    this.origin = this.camera.transform.position;
    this.camera.transform.getWorldForward(this.direction);
    this.ray = new Ray(this.origin, this.direction);
  }
  getCarInfo() {
    this.carEntity = this.entity;

    // console.log(this.entity.findByName("Mercedes").getComponent());
    let renderer = this.carEntity.getComponent(MeshRenderer);

    if (renderer) {
      let material = renderer.getMaterial() as PBRMaterial;
      console.log(material);

      material.baseColor = new Color(
        Math.random(),
        Math.random(),
        Math.random(),
        1
      );
    } else {
      // debugger;
      console.log(this.carEntity);
      this.entity.children.forEach((item) => {
        let renderMesh = item.getComponent(MeshRenderer);
        let material = renderMesh.getMaterial() as PBRMaterial;
        material.baseColor = new Color(
          Math.random(),
          Math.random(),
          Math.random(),
          0.1
        );
        material.isTransparent = true;
      });

      // let render = new MeshRenderer(this.carEntity);
      // let material = new BlinnPhongMaterial(this.engine);

      // material.baseColor.set(0, 1, 1, 0);
      // render.setMaterial(material);
      // console.log(render.getMaterial());
    }

    // console.log(mesh.getMaterial());
  }
  clearUp() {
    this.entity.children.forEach((item) => {
      let renderMesh = item.getComponent(MeshRenderer);
      let material = renderMesh.getMaterial() as PBRMaterial;
      material.baseColor = new Color(
        this.color.r,
        this.color.g,
        this.color.b,
        0.1
      );
      material.isTransparent = true;
    });
  }

  updateCameraPos() {}
  onUpdate() {
    this.getRay();
    // console.log(this.ray);
    const hit = new HitResult();
    let result = this.engine.physicsManager.raycast(
      this.ray,
      Number.MAX_VALUE,
      Layer.Everything,
      hit
    );

    if (result && hit.entity.name && hit.entity.name != "npc") {
      if (hit.entity.name == "GLTF_ROOT") {
        this.clearUp();
      }
      // this.getCarInfo();
    } else {
      this.setColor();
    }
  }
}

class Renderer2DScript extends Script {
  screen: Vector3 = new Vector3();
  widthRatio: number;
  heightRatio: number;
  camera: Camera;
  dom: HTMLElement;
  rootEntity: Entity;
  constructor(entity: Entity) {
    super(entity);
    this.widthRatio =
      //@ts-ignore
      this.engine.canvas.width / this.engine.canvas._webCanvas.clientWidth;

    this.heightRatio =
      //@ts-ignore
      this.engine.canvas.height / this.engine.canvas._webCanvas.clientHeight;
  }
  onStart() {
    let rootEntity = (this.rootEntity = this.entity.parent.parent.parent);
    this.camera = rootEntity.findByName("Camera").getComponent(Camera);
    this.screen = this.entity.transform.worldPosition
      .clone()
      .add(new Vector3(0, 0, 0));
    this.dom = document.querySelector(".tip");
    this.entity.addComponent(Check).setDom(this.dom);
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
    if (this.dom) {
      let p2 = this.screen; //new Vector3();
      var screen = new Vector3();
      this.camera.worldToScreenPoint(p2, screen);
      this.dom.style.left = `${screen.x / this.widthRatio}px`;
      this.dom.style.top = `${screen.y / this.heightRatio}px`;
      // this.hiddenDom();
    }
  }
}

class Check extends Script {
  dom: HTMLElement;
  rootEntity: Entity;
  npc: Entity;
  npcControl: ControllerScript;
  ray: Ray;
  constructor(entity: Entity) {
    super(entity);
  }
  onAwake() {
    let rootEntity = (this.rootEntity = this.entity.parent.parent.parent);
  }
  setDom(dom: HTMLElement) {
    this.dom = dom;
    this.dom = document.querySelector(".tip");
  }
  check() {
    let pos = this.npc.transform.worldPosition;
    let forword = new Vector3();

    this.npc.transform.getWorldForward(forword);
    this.ray = new Ray(pos, forword.normalize().scale(-1));
    const hit = new HitResult();
    let result = this.engine.physicsManager.raycast(
      this.ray,
      1,
      Layer.Everything,
      hit
    );

    if (result && hit.entity.name == "GLTF_ROOT") {
      let gltfRootDir = new Vector3();
      hit.entity.transform.getWorldForward(gltfRootDir);
      let dot = Vector3.dot(forword, gltfRootDir.scale(-1));
      let y = Math.sqrt(1 - dot * dot);
      let deg = (Math.atan2(y, dot) * 180) / Math.PI;

      if (deg > 70 && deg < 110) {
        this.dom.style.display = "block";
      } else {
        this.dom.style.display = "none";
      }
    } else {
      this.dom.style.display = "none";
    }

    // if (result && hit.entity.name == "Mercedes") {
    //   console.log(hit.entity.name);
    // }
  }
  onUpdate() {
    if (this.npcControl == undefined) {
      // RootNode
      let npc = this.rootEntity.findByName("RootNode");

      if (npc) {
        // console.log(npc.parent);
        this.npcControl = npc.parent.getComponent(ControllerScript);
        this.npc = npc;
      }
    }
    if (this.dom && this.npcControl) {
      this.check();
    }
  }
}
class PersonScript extends Script {
  animator: Animator;
  animationList: string[];
  ray: Ray;
  npc: Entity;

  npcControl: ControllerScript;
  rootEntity: Entity;

  idle = true;

  widthRatio: number;
  heightRatio: number;

  camera: Camera;

  dom: HTMLElement;

  screan: Entity;
  constructor(entity: Entity) {
    super(entity);
    this.widthRatio =
      //@ts-ignore
      this.engine.canvas.width / this.engine.canvas._webCanvas.clientWidth;

    this.heightRatio =
      //@ts-ignore
      this.engine.canvas.height / this.engine.canvas._webCanvas.clientHeight;
  }
  onAwake() {
    // this.entity.transform.rotateByAxis(new Vector3(0, 0, 1), 40);
    /*
    6.467268235440021 1.5664997378203815 2.1000682525615346
    -14.871375722286018 50.32258654121036 0
    */

    let rootEntity = (this.rootEntity = this.entity.parent.parent);
    this.camera = rootEntity.findByName("Camera").getComponent(Camera);
    let wireframe = rootEntity.addComponent(WireframeManager);
    const physicsCapsule = new CapsuleColliderShape();
    physicsCapsule.radius = 0.8;
    physicsCapsule.height = 1;
    physicsCapsule.setPosition(0, 1, 0);
    const capsuleCollider = this.entity.parent.addComponent(StaticCollider);
    capsuleCollider.addShape(physicsCapsule);

    if (import.meta.env.MODE == "development") {
      wireframe.addEntityWireframe(this.entity.parent);
    }

    console.log(this.entity);

    this.animator = this.entity.getComponent(Animator);
    if (this.animator) {
      this.animator.play("O_CH_LittleWitch|Idle01|Base Layer");
    }
    this.createEle();
    this.screan = rootEntity.findByName("Square_Screen01_Video");

    // const { animatorController } = this.animator;
  }

  setAnimationList(list: AnimationClip[]) {
    this.animationList = list.map((item) => item.name);
    console.log(this.animationList);
  }
  check2() {
    let pos = this.npc.transform.worldPosition;
    this.entity.transform.lookAt(this.npc.transform.worldPosition);
    if (
      this.entity.transform.worldPosition
        .clone()
        .subtract(pos.clone())
        .length() < 4
    ) {
      this.dom.style.display = "block";
    } else {
      this.dom.style.display = "none";
    }
  }
  check() {
    let pos = this.npc.transform.worldPosition;
    // console.log(pos);
    let forword = new Vector3();
    this.npc.transform.getWorldForward(forword);
    let ray = new Ray(pos, forword.clone().normalize().scale(-1));
    const hit = new HitResult();
    let result = this.engine.physicsManager.raycast(
      ray,
      4,
      Layer.Everything,
      hit
    );

    this.entity.transform.lookAt(this.npc.transform.worldPosition);
    // this.entity.parent.transform.lookAt(this.npc.transform.worldPosition);
    // console.log(v);
    // console.log(pos);
    if (result && hit.entity.name == "person_node") {
      let dis = hit.distance;

      if (dis < 3) {
        this.dom.style.display = "block";
      }
    } else {
      if (this.dom) {
        this.dom.style.display = "none";
      }
    }
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
  createEle() {
    console.log(this.entity);
    let div = document.createElement("div");
    div.className = "tip_screan_play";
    div.style.position = "absolute";
    div.style.width = 367 / 2 + "px";
    div.style.height = 250 / 2 + "px";

    div.style.transform = "translateX(-58.5px) translateY(-250px) scale(1)";
    div.style.display = "none";
    document.body.appendChild(div);
    this.dom = div;
    let that = this;
    let app = createApp({
      render() {
        return h(PlayScrean, { engin: that.engine });
      },
    });
    this.engine.on("look_screan", () => {
      this.tweenMove(
        this.camera.entity.transform.worldPosition.clone(),
        new Vector3(
          6.176318168640137,
          -0.9697064757347107,
          -10.693305015563965
        ),
        (res) => {
          this.camera.entity.transform.worldPosition = res;
        }
      )();
      this.tweenMove(
        this.camera.entity.transform.worldRotation.clone(),
        new Vector3(-0.1738361690466456, 122.36571740262042, 0),
        (res) => {
          this.camera.entity.transform.worldRotation = res;
        }
      )();

      // console.log(this.npc.parent);
      /*
      弧度 = 角度 * Math.PI / 180 角度 = 弧度 * 180 / Math.PI 
      */
      let pos = this.screan.transform.worldPosition.clone();
      let npcPos = this.npc.transform.worldPosition.clone();
      let dirNormal = pos.subtract(npcPos).normalize();
      let npcNormal = new Vector3();
      this.npc.transform.getWorldRight(npcNormal);
      let cos = Vector3.dot(npcNormal, dirNormal);
      let sin = Math.sqrt(1 - cos * cos);
      let tan = Math.atan2(sin, cos);

      let q = new Quaternion();
      q.rotateY(tan);
      this.npc.transform.rotationQuaternion = q;
    });

    app.mount(this.dom);
  }
  onUpdate() {
    TWEEN.update();
    if (this.npcControl == undefined) {
      // RootNode
      let npc = this.rootEntity.findByName("RootNode");

      if (npc) {
        // console.log(npc.parent);
        this.npcControl = npc.parent.getComponent(ControllerScript);
        this.npc = npc;
      }
    }
    if (this.npcControl) {
      this.check();
    }
    if (this.dom) {
      let p2 = this.entity.transform.worldPosition.clone(); //new Vector3();
      var screen = new Vector3();
      this.camera.worldToScreenPoint(p2, screen);
      this.dom.style.left = `${screen.x / this.widthRatio}px`;
      this.dom.style.top = `${screen.y / this.heightRatio}px`;
    }

    // this.check();
    // if (this.npc == undefined) {
    //   this.npc = this.entity.parent.findByName("person_node");
    // }
    // if (this.npc) {
    //   this.check();
    // }
  }
}
class PersonScript2 extends Script {
  animator: Animator;
  animationList: string[];
  ray: Ray;
  npc: Entity;

  npcControl: ControllerScript;
  rootEntity: Entity;

  idle = true;

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
  }
  onAwake() {
    // this.entity.transform.scale.set(-1, -1, -1);

    let rootEntity = (this.rootEntity = this.entity.parent.parent);
    this.camera = rootEntity.findByName("Camera").getComponent(Camera);
    let wireframe = rootEntity.addComponent(WireframeManager);
    const physicsCapsule = new CapsuleColliderShape();
    physicsCapsule.radius = 1;
    physicsCapsule.height = 4;

    const capsuleCollider = this.entity.parent.addComponent(StaticCollider);
    capsuleCollider.addShape(physicsCapsule);
    if (import.meta.env.MODE == "development") {
      wireframe.addEntityWireframe(this.entity.parent);
    }

    console.log(this.entity);

    this.animator = this.entity.getComponent(Animator);
    if (this.animator) {
      this.animator.play("Idle");
    }
    this.createEle();

    // const { animatorController } = this.animator;
  }

  setAnimationList(list: AnimationClip[]) {
    this.animationList = list.map((item) => item.name);
    console.log(this.animationList);
  }

  check() {
    let pos = this.npc.transform.worldPosition;
    // console.log(pos);
    let forword = new Vector3();
    this.npc.transform.getWorldForward(forword);
    let ray = new Ray(pos, forword.clone().normalize().scale(-1));
    const hit = new HitResult();
    let result = this.engine.physicsManager.raycast(
      ray,
      2,
      Layer.Everything,
      hit
    );

    this.entity.transform.lookAt(this.npc.transform.worldPosition);

    // console.log(v);
    // console.log(pos);
    if (result && hit.entity.name == "person_node") {
      let state = this.animator.getCurrentAnimatorState(0);

      let dis = hit.distance;
      if (state.name == "Idle" && this.idle == true && dis < 1.4 && dis > 1) {
        this.animator.play("Wave");
        this.idle = false;
        let state = this.animator.getCurrentAnimatorState(0);
        state.wrapMode = WrapMode.Once;
        console.log(hit.distance);
        this.dom.style.display = "block";
      }
    } else {
      let state = this.animator.getCurrentAnimatorState(0);
      if (this.animator && state.name == "Wave" && this.idle == false) {
        this.animator.play("Idle");
        this.idle = true;
        state.wrapMode = WrapMode.Loop;
      }
      if (this.dom) {
        this.dom.style.display = "none";
      }
    }
  }

  createEle() {
    console.log(this.entity);
    let div = document.createElement("div");
    div.className = "tip_screan_play";
    div.style.position = "absolute";
    div.style.width = 367 / 2 + "px";
    div.style.height = 250 / 2 + "px";

    div.style.transform = "translateX(-58.5px) translateY(-210px) scale(1)";
    div.style.display = "none";
    document.body.appendChild(div);
    this.dom = div;
    let app = createApp({
      render() {
        return h(PlayScrean);
      },
    });
    app.mount(this.dom);
  }
  onUpdate() {
    if (this.npcControl == undefined) {
      // RootNode
      let npc = this.rootEntity.findByName("RootNode");

      if (npc) {
        // console.log(npc.parent);
        this.npcControl = npc.parent.getComponent(ControllerScript);
        this.npc = npc;
      }
    }
    if (this.npcControl) {
      this.check();
    }
    if (this.dom) {
      let p2 = this.entity.transform.worldPosition.clone(); //new Vector3();
      var screen = new Vector3();
      this.camera.worldToScreenPoint(p2, screen);
      this.dom.style.left = `${screen.x / this.widthRatio}px`;
      this.dom.style.top = `${screen.y / this.heightRatio}px`;
    }

    // this.check();
    // if (this.npc == undefined) {
    //   this.npc = this.entity.parent.findByName("person_node");
    // }
    // if (this.npc) {
    //   this.check();
    // }
  }
}
