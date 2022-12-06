import {
  BoxColliderShape,
  Camera,
  CapsuleColliderShape,
  CharacterController,
  DynamicCollider,
  Entity,
  MathUtil,
  Matrix,
  Quaternion,
  Script,
  Vector2,
  Vector3,
  Vector4,
} from "oasis-engine";
/*
 弧度 = 角度 * Math.PI / 180 角度 = 弧度 * 180 / Math.PI 
*/
import { OrbitControl } from "@oasis-engine-toolkit/controls";
import { WireframeManager } from "@oasis-engine-toolkit/auxiliary-lines";
export default class Player extends Script {
  speed: number = 0.05;
  canMove: boolean = false;
  dir: Vector2 = new Vector2(0, 0);
  deg: number = 0;
  cameraNode: Entity = null;
  orb: OrbitControl = null;
  quaternion: Vector3 = new Vector3();

  onStart() {
    console.log("start");
    this.cameraNode = this.entity.parent.findByName("Camera");
    this.orb = this.cameraNode.getComponent(OrbitControl);

    this.quaternion = this.cameraNode.transform.position
      .clone()
      .subtract(this.entity.transform.position);
    this.setCapsuleColliderShape();
  }
  controlMove({ dir, deg }: { dir: Vector2; deg: number }) {
    this.canMove = dir.length() > 0;
    this.dir.set(dir.x, dir.y);

    this.deg = deg;
  }
  setCapsuleColliderShape() {
    const wireframe = this.entity.parent.addComponent(WireframeManager);
    const physicsCapsule = new CapsuleColliderShape();
    physicsCapsule.radius = 0.15;
    physicsCapsule.height = 0.5;
    physicsCapsule.position.set(0, -0.5, 0);

    const characterController = this.entity.addComponent(CharacterController);
    characterController.addShape(physicsCapsule);

    // let playerCollider = this.entity.addComponent(DynamicCollider);
    // playerCollider.isKinematic = false;

    // playerCollider.addShape(physicsCapsule);

    wireframe.addEntityWireframe(this.entity);
    this.addPlanColliderShape();
  }
  addPlanColliderShape() {
    let plan = this.entity.parent.findByName("Square_BasicGround_uv2");

    console.log(plan);
  }

  controlStart() {
    if (this.cameraNode) {
      this.quaternion = this.cameraNode.transform.position
        .clone()
        .subtract(this.entity.transform.position);
    }
  }
  theta() {
    let v1 = this.entity.transform.position.clone();
    let v2 = this.cameraNode.transform.position.clone();
    let dis = v2.subtract(v1).normalize();
    let a = Math.sqrt(1 - dis.y * dis.y);
    console.log(dis.y, dis.y);
    let b = Math.sqrt(1 - dis.y * dis.y - dis.x * dis.x);

    let deg = Math.asin(dis.x / b); //Math.atan2(dis.x, b);

    return deg;
  }
  onUpdate() {
    if (this.canMove) {
      this.quaternion = this.cameraNode.transform.position
        .clone()
        .subtract(this.entity.transform.position);
      let q = new Quaternion();
      // @ts-ignore
      q.rotateY(this.deg + this.orb._spherical.theta);

      this.entity.transform.rotationQuaternion = q;

      this.entity.transform.translate(0, 0, this.speed);
      this.orb.target = this.entity.transform.worldPosition;
      let pos = this.entity.transform.worldPosition.clone();
      this.cameraNode.transform.position = new Vector3(pos.x, pos.y, pos.z).add(
        this.quaternion
      );
    }
  }
}
