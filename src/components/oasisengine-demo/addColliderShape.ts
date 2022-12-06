import {
  Entity,
  Layer,
  MeshRenderer,
  PlaneColliderShape,
  StaticCollider,
} from "oasis-engine";
import { WireframeManager } from "@oasis-engine-toolkit/auxiliary-lines";
export default class AddColliderShape {
  constructor() {}
  static addPlan(entity: Entity, name) {
    let planeEntity = entity.findByName(name);

    console.log(planeEntity.getComponent(MeshRenderer));

    const physicsPlane = new PlaneColliderShape();

    physicsPlane.position.set(0, 0.1, 0);
    physicsPlane.isTrigger = false;
    const planeCollider = planeEntity.addComponent(StaticCollider);
    planeCollider.addShape(physicsPlane);
    return planeEntity;
  }
}
