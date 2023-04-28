
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