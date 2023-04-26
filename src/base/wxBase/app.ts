import { BaseClass, InstanceBaseEvent, InstanceType, AppEventType } from "../base";

class AppBase extends BaseClass<AppEventType> {
  constructor() {
    super(InstanceType.App);
  }

  onLaunch = (() => {
    const self = this;
    return function (this: AppBase, options: WechatMiniprogram.LaunchOptionsApp) {
      self.instance = this as any;
      self.emit(InstanceBaseEvent.Lifecycle, "onLaunch", options);
    }
  })();

  onShow = (() => {
    const self = this;
    return function (this: AppBase, options: WechatMiniprogram.LaunchOptionsApp) {
      self.emit(InstanceBaseEvent.Lifecycle, "onShow", options);
    }
  })();

  onHide = (() => {
    const self = this;
    return function (this: AppBase) {
      self.emit(InstanceBaseEvent.Lifecycle, "onHide");
    }
  })();

  onError = (() => {
    const self = this;

    return function(this: AppBase, error: string) {
      self.emit(InstanceBaseEvent.Lifecycle, "onError", error);
    }
  })();
}

interface IApp {
  new (): AppBase & WechatMiniprogram.App.Option;
  prototype: AppBase;
}

export const AppBaseClass = AppBase as any as IApp;
