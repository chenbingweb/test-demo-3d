import {
  CullMode,
  Engine,
  Material,
  Script,
  Shader,
  Texture2D,
  CompareFunction,
  Entity,
  TextureFormat,
} from "oasis-engine";
Shader.create(
  "video",
  `
  attribute vec3 POSITION;
  attribute vec2 TEXCOORD_0;
  varying vec2 v_uv;
  
  uniform mat4 u_VPMat;
  uniform mat4 u_VPMat2;
  
  void main() {
      v_uv = TEXCOORD_0;
      gl_Position = u_VPMat*u_VPMat2  * vec4( POSITION, 1.0 );
  }
    `,
  `
    uniform sampler2D u_texture;
    varying vec2 v_uv;
  
    void main(){
      gl_FragColor = texture2D(u_texture, vec2(v_uv.x,v_uv.y));
      
    }
    `
);

export class VideoMaterial extends Material {
  // 视频地址
  _videosrc = "";
  // video元素
  video: HTMLVideoElement | null = null;
  // 节点
  screanEntity: Entity | null = null;
  hasPlay = false;
  constructor(engine: Engine, screan: Entity) {
    super(engine, Shader.find("video"));
    this.screanEntity = screan;
    this.renderState.rasterState.cullMode = CullMode.Off;
    this.renderState.depthState.compareFunction = CompareFunction.LessEqual;
    this.shaderData.setMatrix("u_VPMat2", screan.transform.worldMatrix);
    this.createVideo();
    screan.addComponent(PlayVideo);
  }
  // 创建video
  createVideo() {
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
    video.src = this._videosrc;

    video.onloadedmetadata = () => {
      console.log(video.videoWidth);
    };

    video.onplay = () => {
      // 视频源宽度
      let width = this.video.videoWidth;
      // 视频源高度
      let height = this.video.videoHeight;
      // 创建2D纹理

      if (this.hasPlay == false) {
        let texture = new Texture2D(
          this.engine,
          width,
          height,
          TextureFormat.R8G8B8,
          false
        );
        this.texture = texture;
        this.texture.setImageSource(video);
        this.hasPlay = true;
        // setTimeout(() => {  }, 0);
        if ("requestVideoFrameCallback" in video && false) {
          (video as any).requestVideoFrameCallback(this.updateVideo.bind(this));
          console.log("requestVideoFrameCallback");
        } else {
          // 目的是更新视频没一帧
          let script = this.screanEntity.addComponent(UpdateVideoScript);
          script.video = video;
          script.texture = this.texture;
          console.log("addComponent");
        }
      } else {
        this.texture.setImageSource(video);
      }

      console.log("oncanplay");
    };

    video.onpause = () => {
      console.log("pause");
    };
    this.video = video;
  }
  updateVideo() {
    this.texture.setImageSource(this.video);
    (this.video as any).requestVideoFrameCallback(this.updateVideo.bind(this));
  }
  get src(): string {
    return this._videosrc;
  }
  // 设置视频地址
  set src(val: string) {
    if (this.video) {
      this.video.src = val;
      this.video.pause();
    }
  }

  get texture(): Texture2D {
    return this.shaderData.getTexture("u_texture") as Texture2D;
  }

  set texture(v: Texture2D) {
    this.shaderData.setTexture("u_texture", v);
  }
}

export default class UpdateVideoScript extends Script {
  video: HTMLVideoElement;
  texture: Texture2D;

  onUpdate() {
    if (this.texture && this.video) {
      this.texture.setImageSource(this.video);
      // console.log(this.texture.width);
    }
    // console.log(this.video);
  }
}

export class PlayVideo extends Script {
  video: HTMLVideoElement = null;
  onAwake() {
    // @ts-ignore
    this.video = document.querySelector("video");
  }
  onPointerClick() {
    console.log(2);
    if (this.video.paused) {
      this.video.play();
    } else {
      this.video.pause();
    }
  }
}
export class VideoMaterial2 extends Material {
  constructor(engine: Engine, screan: Entity) {
    super(engine, Shader.find("video"));

    this.renderState.rasterState.cullMode = CullMode.Off;
    this.renderState.depthState.compareFunction = CompareFunction.LessEqual;
    this.shaderData.setMatrix("u_VPMat2", screan.transform.worldMatrix);
  }
  get texture(): Texture2D {
    return this.shaderData.getTexture("u_texture") as Texture2D;
  }

  set texture(v: Texture2D) {
    this.shaderData.setTexture("u_texture", v);
  }
}
