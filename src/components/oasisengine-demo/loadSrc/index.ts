// import axios from "axios";
import { createApp, h } from "vue";
import LoadingComponent from "../components/process-bar.vue";
interface IPrama {
  url: string;
  method?: string;
  responseType?: string;
  onDownloadProgress?: (res: IProcess) => void;
}
interface IProcess {
  progress: number;
}
function axios(param: IPrama) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", param.url);
  xhr.onprogress = (event) => {
    if (event.lengthComputable) {
      let percentComplete = event.loaded / event.total;
      if (param.onDownloadProgress) {
        param.onDownloadProgress({ progress: percentComplete });
      }
    }
  };
  xhr.send();

  return new Promise((resolve) => {
    xhr.onloadend = () => {
      resolve(true);
    };
  });
}

const delay = () => {
  return new Promise((reslove) => {
    setTimeout(() => {
      reslove(true);
      console.log("start");
    }, 2000);
  });
};
export default class LoadSrc {
  static async loadAll(list: string[]) {
    let div = document.createElement("div");
    document.body.append(div);
    div.setAttribute("data-url", "loading");
    const app = createApp({
      data() {
        return {
          progress: 0,
          url: "",
          barpercent: 0,
        };
      },
      render() {
        return h(LoadingComponent, {
          percent: this.progress,
          url: this.url,
          barpercent: this.barpercent,
        });
      },
    });
    app.mount(div);
    let promiseAll = [];

    list.forEach((item) => {
      promiseAll.push(LoadSrc.loadItem(item, app));
    });

    return Promise.all(promiseAll).then(() => {
      app.unmount();
      document.body.removeChild(div);
      return Promise.resolve();
    });
  }
  static loadItem(url: string, app) {
    return axios({
      url: url,
      method: "get",
      responseType: "blob",
      onDownloadProgress(progress) {
        if (app._instance?.data) {
          // app._instance.data.progress = progress.progress;
          app._instance.data.url = url;
          app._instance.data.barpercent = progress.progress;
        } else {
          let dom = document.querySelector(".percent") as HTMLElement;
          let urlDom = document.querySelector(".url_text") as HTMLElement;

          if (dom) {
            dom.style.width = progress.progress * 100 + "%";
          }
          if (urlDom) {
            urlDom.textContent = "source:" + url;
          }
        }
      },
    });
  }
}
