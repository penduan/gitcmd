/**
 * lg2 Module test.
 */

import { Lg2 } from "src/libs/lg2";
import { Deps } from "src/api/common/deps";
import assert from "assert";

let lg2_: Lg2;

before(function(done){
  let deps = new Deps();
  lg2_ = new Lg2(deps);
  deps.awaitDeps().then(() => done());
});

describe("Lg2 module test", function() {  

  it("Instance test", () => {
    assert(typeof lg2_ !== "undefined");
  });
})

