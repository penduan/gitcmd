// Base 人口

import { AppBaseClass as WXApp } from "./wxBase/app";
import { AppBaseClass as WEBApp } from "./webBase/app";


let App_
if (process.env.WECHAT) {
  App_ = WXApp
} else {
  App_ = WEBApp
}

export let AppBaseClass = App_;
