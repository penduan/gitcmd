import { EventDisposable, IDisposable } from "api/common/disposable";
import { IPort } from "./port";

export interface IEventDispatcherHandler {
  verifyAuth?(name: string, type: string): boolean;
}

export interface IEventDispatcher {
  dispatchMessage(type: string, value: any[]): boolean[];
}

export class RemoteEventDispatcher extends EventDisposable<"add" | "dispatchMessage"> implements IEventDispatcher {

  constructor(public handler: IEventDispatcherHandler = {}) {
    super();
  }

  get ports() {
    return this.getDisposables() as Map<string | symbol, IPort>;
  }

  add(port: IPort) {
    this.setDisposableId(port.name);
    this.disposable = port;
  }

  // connects() {
  //   this.ports.forEach((item) => (item as IPort).connect());
  // }

  dispatchMessage(type: string, value: any[]) {
    let msg = {data: {type, value}};
    let status: boolean[] = [];
    this.ports.forEach((item) => {
      if (this.handler.verifyAuth && !this.handler.verifyAuth(item.name, type)) {
        status.push(false);
        return ;
      }

      if (item.postMessage(msg)) status.push(true);
      else status.push(false);
    });
    return status;
  }

  // dispose() {
  //   this.ports.forEach((port) => port.disconnect());
  // }

  [Symbol.toStringTag]() {
    return "RemoteEventDispatcher";
  }

}

export class EventDispatcher extends EventDisposable<null> implements IEventDispatcher {
  dispatchMessage(type: string, value: any[]) {
    return [true];
  }
}

export function registerEventEmitterDisposable<T extends Function>(eventObj: {
  on: (eventName: string, handler: any) => void, off:(eventName: string) => void}, eventName: string, callback: T): IDisposable {
  eventObj.on(eventName, callback);
  return {
    dispose() {
      eventObj.off(eventName);
    }
  }
}

export function registerGlobalEventDisposable<T extends Function>(eventObj: any, eventName: string, callback: T): IDisposable {
  eventObj[eventName] = callback;
  return {
    dispose() {
      eventObj[eventName] = null;
    }
  }
}

export function registerEventTargetDisposable<T extends Function>(eventObj: EventTarget, eventName: string, callback: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
  eventObj.addEventListener(eventName, callback, options);
  return {
    dispose() {
      eventObj.removeEventListener(eventName, callback, options);
    }
  }
}