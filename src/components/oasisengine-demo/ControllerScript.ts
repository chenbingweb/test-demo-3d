import {
  Animator,
  CharacterController,
  ControllerCollisionFlag,
  Entity,
  Keys,
  Matrix,
  Quaternion,
  Script,
  Transform,
  Vector2,
  Vector3,
} from "oasis-engine";
import { OrbitControl } from "@oasis-engine-toolkit/controls";
export enum State {
  Run = "Run",
  Idle = "Idle",
  Jump = "Jump_In",
  Fall = "Fall",
  Landing = "Landing",
}
export class AnimationState {
  private _state: State = State.Idle;
  private _lastKey: Keys = null;

  get state(): State {
    return this._state;
  }

  setMoveKey(value: Keys) {
    this._lastKey = value;
    if (this._state === State.Fall || this._state === State.Jump) {
      return;
    }

    if (
      this._lastKey === null &&
      (this._state === State.Run || this._state === State.Idle)
    ) {
      this._state = State.Idle;
    } else {
      this._state = State.Run;
    }
  }

  setJumpKey() {
    this._state = State.Jump;
  }

  setFallKey() {
    this._state = State.Fall;
  }

  setIdleKey() {
    if (this._state == State.Jump) {
      return;
    }

    if (this._state === State.Fall) {
      this._state = State.Landing;
    }

    if (this._state === State.Landing) {
      this._state = State.Idle;
    }
  }
}

export default class ControllerScript extends Script {
  _camera: Entity;
  _character: Entity;
  _controller: CharacterController;
  canMove: boolean = false;

  _displacement = new Vector3();
  _forward = new Vector3();
  _cross = new Vector3();
  _fallAccumulateTime = 0;

  _yAxisMove = new Vector3(0, 0, 0);

  dir = new Vector2();
  deg: number = 0;
  isPc: boolean =
    !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  speed: number = 0.05;
  orb: OrbitControl = null;

  quaternion: Vector3 = new Vector3();

  _predictPosition = new Vector3();
  _rotMat = new Matrix();
  _rotation = new Quaternion();
  _newRotation = new Quaternion();

  _up = new Vector3(0, 1, 0);
  _isInit = false;

  lenDirNormal: Vector3 = new Vector3();
  len: number = 0;

  currentPos: Vector3;

  animator: Animator;
  flag: boolean = true;

  onEnable() {
    if (this.currentPos) {
      this.entity.transform.position = this.currentPos;
    } else {
      this.currentPos = this.entity.transform.position;
    }
  }
  isMobile() {
    let flag =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    return flag;
  }

  onAwake() {
    console.log(232323 + "onAwake");
    this._controller = this.entity.getComponent(CharacterController);
    // const physicsManager = this.engine.physicsManager;
  }
  targetCamera(camera: Entity) {
    this._camera = camera;
    this.orb = this._camera && this._camera.getComponent(OrbitControl);
    this.cameraDis();
  }
  targetCharacter(character: Entity) {
    this._character = character;
    this.orb.target = this._character.transform.position.clone();
    // this._animator = character.getComponent(Animator);
  }
  controlMove({ dir, deg }: { dir: Vector2; deg: number }) {
    this.canMove = dir.length() > 0;
    this.dir.set(dir.x, dir.y).normalize();
    this.deg = deg;
    // this.orb.maxPolarAngle = (70 * Math.PI) / 180;
  }
  controlStart() {
    if (this._camera) {
      this._isInit = true;
      // this.orb.maxPolarAngle = (70 * Math.PI) / 180;
    }
    this._fallAccumulateTime = 0;
  }
  cameraDis() {
    this.lenDirNormal = this._camera.transform.worldPosition
      .clone()
      .subtract(this.entity.transform.worldPosition.clone())
      .normalize();
    if (this.len == 0) {
      this.len = this._camera.transform.worldPosition
        .clone()
        .subtract(this.entity.transform.worldPosition.clone())
        .length();
    }
  }
  controalEnd() {
    this._isInit = false;
    // this.orb.maxPolarAngle = (90 * Math.PI) / 180;
    // this.orb.rotateSpeed = 1;
  }
  onUpdate(deltaTime: number) {
    // console.log(deltaTime);

    const inputManager = this.engine.inputManager;
    if (this.animator == undefined) {
      this.animator = this.entity.findByName("RootNode").getComponent(Animator);
    }
    if (this.isPc == false) {
      this.mobilePlayMove();
      return;
    }
    if (inputManager.isKeyHeldDown()) {
      // if(this.canMove){

      this._camera.transform.getWorldForward(this._forward);
      this.orb.target = this.entity.transform.worldPosition.clone();
      this._forward.y = 0;
      this._forward.normalize();

      this._cross.set(this._forward.z, 0, -this._forward.x);
      const animationSpeed = 0.04;
      const displacement = this._displacement;
      // console.log(displacement);
      if (inputManager.isKeyHeldDown(Keys.KeyW)) {
        Vector3.scale(this._forward, animationSpeed, displacement);
      }
      if (inputManager.isKeyHeldDown(Keys.KeyS)) {
        Vector3.scale(this._forward, -animationSpeed, displacement);
      }
      if (inputManager.isKeyHeldDown(Keys.KeyA)) {
        Vector3.scale(this._cross, animationSpeed, displacement);
      }
      if (inputManager.isKeyHeldDown(Keys.KeyD)) {
        Vector3.scale(this._cross, -animationSpeed, displacement);
      }
      if (inputManager.isKeyDown(Keys.Space)) {
        displacement.set(0, 0.05, 0);
      }
      if (this.animator) {
        if (this.flag) {
          this.flag = false;
          this.animator.play(State.Run);
        }
      }
    } else {
      this._displacement.set(0, 0, 0);
      if (this.flag == false) {
        this.flag = true;
        this.animator.play(State.Idle);
      }
    }
  }
  onPhysicsUpdate() {
    const physicsManager = this.engine.physicsManager;
    const gravity = physicsManager.gravity;

    const fixedTimeStep = physicsManager.fixedTimeStep;
    const character = this._controller;
    if (this._isInit == false) {
      this._fallAccumulateTime = 0;
    } else {
      this._fallAccumulateTime += fixedTimeStep;
    }

    this._isInit = true;

    character.move(this._displacement, 0.0001, fixedTimeStep);
    const transform = this._character.transform;
    const yAxisMove = this._yAxisMove;
    yAxisMove.set(0, gravity.y * fixedTimeStep * this._fallAccumulateTime, 0);
    // console.log(yAxisMove);
    const flag = character.move(yAxisMove, 0.0001, fixedTimeStep);

    if (flag & ControllerCollisionFlag.Down) {
      this._fallAccumulateTime = 0;
      // this._animationState.setIdleKey();
    } else {
      // this._animationState.setFallKey();
    }

    // this._playAnimation();

    if (this._displacement.x != 0 || this._displacement.z != 0) {
      this._predictPosition.copyFrom(transform.worldPosition);
      this._predictPosition.subtract(this._displacement);
      Matrix.lookAt(
        transform.worldPosition, // 人物当前坐标
        this._predictPosition, // 要移动距离
        this._up,
        this._rotMat //
      );

      this._rotMat.getRotation(this._rotation).invert();
      // const currentRot = transform.rotationQuaternion;
      // Quaternion.slerp(currentRot, this._rotation, 0.01, this._newRotation);
      transform.rotationQuaternion = this._rotation; //this._newRotation;
      this.cameraDis();
      let pos = this.entity.transform.worldPosition.clone();
      let dis = new Vector3();
      Vector3.scale(this.lenDirNormal, this.len, dis);

      this._camera.transform.worldPosition = new Vector3(
        pos.x,
        pos.y,
        pos.z
      ).add(dis);
      // this.currentTransform = this.entity.transform;
      this.currentPos = this.entity.transform.position.clone();
    }
  }
  mobilePlayMove() {
    if (this.canMove) {
      if (this.orb) {
        this.orb.target = this.entity.transform.worldPosition.clone();
        // @ts-ignore
        let theta = this.orb._spherical.theta;

        let x = Math.cos(this.deg + theta);
        let y = Math.sin(this.deg + theta);
        let dir = new Vector3(y, 0, x);
        this._forward = dir;
      } else {
        this._forward = new Vector3(this.dir.x, 0, this.dir.y);
      }

      this._forward.y = 0;

      this._forward.normalize();

      const animationSpeed = 0.05;
      const displacement = this._displacement;
      Vector3.scale(this._forward, animationSpeed, displacement);
    } else {
      this._displacement.set(0, 0, 0);
    }
  }
}
export class UserClick extends Script {
  onAwake() {
    console.log(23);
  }
  onPointerClick() {
    console.log(232);
  }
}
