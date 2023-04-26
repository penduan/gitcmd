import { AppEventType, BaseClass, InstanceType } from "../base";

export class AppBaseClass extends BaseClass<AppEventType> {
  constructor() {
    super(InstanceType.App);

    this.registerAppEvent();
  }

  /**
   * 需要应用在Web和Background两种环境?
   */
  registerAppEvent() {
    
  }
}