
module.exports = {
  mp: {
    copy: [
      {from: "./wasm/mp/lg2.wasm.br", to: "../assets"}
    ]
  },
  web: {
    page: [],
    copy: [
      {from: "./wasm/web/lg2.wasm", to: "./"}
    ]
  }
}