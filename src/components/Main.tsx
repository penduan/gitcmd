import React, { useState, useRef, useEffect } from 'react'
import { render } from 'react-dom'
import 'css/main.css'

declare  global {
  namespace JSX {
    interface IntrinsicElements {
        'comp-a': any
        'comp-b': any,
        'comp-c': any
    }
  }
}


const App = (props: any, store: any) => {
  const [suffixA] = useState('suffix-a')
  const [prefixA, setPrefixA] = useState('')
  const [prefixB, setPrefixB] = useState('prefix-b')
  const [compAData, setCompAData] = useState(JSON.stringify({
    testObj: {a: 'bye', b: 'june'},
    testArr: [1, 2, 3],
  }))

  const compARef = useRef(null) as any;

  useEffect(() => {
    function onEvent(evt: any) {
      console.log('someevent', evt)
    }

    const compA = compARef.current as any;
    compA.addEventListener('someevent', onEvent)

    return () => {
      compA.removeEventListener('someevent', onEvent)
    }
  }, [])

  function doUpdate() {
    setPrefixA('prefix-new-a')
    setPrefixB('prefix-new-b')
    setCompAData(JSON.stringify({
      testObj: {a: 'hello', b: 'kbone'},
      testArr: [1, 2, 3, 4, 5, 6, 7],
    }))

    compARef.current._wxCustomComponent.printf()
  }

  function goOther() {
    window.open('/other')
  }

  return (
    <div className="cnt">
      <h2>kbone</h2>
      <comp-a ref={compARef} className="block" prefix={prefixA} suffix={suffixA} kbone-attribute-map={compAData}>
        <div>comp-a slot</div>
      </comp-a>
      <comp-b className="block" prefix={prefixB} name="test" my-class="external-red">
        <div>comp-b slot</div>
      </comp-b>
      <comp-c
        className="block"
        onTouchStart={(evt: any) => console.log('touchstart', evt)}
        onTouchEnd={(evt: any) => console.log('touchend', evt)}
        onClick={(evt: any) => console.log('click', evt)}
      >
        <div>comp-c slot</div>
      </comp-c>
      <button className="btn" onClick={doUpdate}>update</button>
      <button className="btn" onClick={goOther}>进入 other 页面</button>
    </div>
  )
}

export default App
