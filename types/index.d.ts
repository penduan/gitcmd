
type TODOType = any;

interface MessageObject {
  data: {
    type: string,
    value: any
  }
}

declare module "wasm/*" {
  let Module: any;
  export default Module;
}

declare module "css/*" {
  
}

/** @todo 待完善 */
declare module "weui.js" {
  var loading: any;
}

declare module "mp-webpack-plugin" {
  const _: any;
  export default _;
}

declare module "terser-webpack-plugin" {
  const _: any;
  export default _;
}