import { AppBaseClass } from "src/base";

import { platform, isWeb, isExt } from "api/common/env";

declare global {
  module globalThis {
    var _app: AppClass;
  }
}

/**
 * App main controller
 */
export default class AppClass extends AppBaseClass {
  
  isWeChat = !!process.env.WECHAT;

  constructor() {
    super();
  }


}

export function getAppInstance() {
  if (process.env.WECHAT) {
    return getApp<AppClass>();
  } else {
    return _app;
  }
}

if (process.env.WECHAT) {
  App(new AppClass());
} else {
  globalThis._app = new AppClass();
}