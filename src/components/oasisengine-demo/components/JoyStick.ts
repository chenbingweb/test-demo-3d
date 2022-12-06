import { Vector2 } from "oasis-engine";
import { reactive } from "vue";
export interface Ipos {
  x: number;
  y: number;
}

export interface IMovePos extends Ipos {
  normal: Vector2;
  deg: number;
}

export default class JoyStick {
  windowWidth: number = window.screen.width;
  windowHeight: number = window.screen.height;
  eleW: number = 0;
  eleH: number = 0;
  ele: HTMLElement | null = null;
  circleEle: HTMLElement | null = null;
  eleT: number = 0;
  eleL: number = 0;
  pointStart: Vector2 = new Vector2();
  baseVector: Vector2 = new Vector2();
  originVec: Vector2 = new Vector2();
  constructor(ele: HTMLElement, circle: HTMLElement) {
    this.circleEle = circle;
    this.ele = ele;
    this.init();
  }
  init() {
    this.eleW = this.ele.offsetWidth;
    this.eleH = this.ele.offsetHeight;
    this.eleT = this.ele.offsetTop;
    this.eleL = this.ele.offsetLeft;
    this.baseVector.set(this.eleL, this.eleT);
    this.originVec.set(this.eleW / 2, this.eleH / 2);
  }
  touchStart(position: Ipos) {
    // console.log(position);
    let pos = new Vector2(position.x, position.y).subtract(
      this.baseVector.clone()
    );
    this.pointStart.set(pos.x, pos.y);
    return { x: pos.x, y: pos.y };
  }
  touchMove(position: Ipos): IMovePos {
    // console.log("position", position);
    let move = new Vector2(position.x, position.y).subtract(
      this.baseVector.clone()
    );
    let dis = move.clone().subtract(this.pointStart.clone()).length();
    let normal = move.subtract(this.originVec).normalize();
    let len = this.eleW / 2;
    let deg = Math.atan2(normal.x, normal.y);
    if (dis > len) {
      let { x, y } = new Vector2(normal.x * len, normal.y * len).add(
        this.originVec
      );
      let _normal = new Vector2(x, y).subtract(this.originVec).normalize();
      return { x, y, normal: _normal, deg };
    } else {
      let { x, y } = new Vector2(normal.x * dis, normal.y * dis).add(
        this.originVec
      );
      return { x, y, normal, deg };
    }
  }

  touchEnd(position: Ipos) {
    console.log(position);
  }
}
