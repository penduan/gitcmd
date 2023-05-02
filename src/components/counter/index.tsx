import React, { useState } from 'react'
import './index.css'

function Counter() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <button onClick={() => setCount(count - 1)}>-</button>
      <span>{count}</span>
      <button onClick={() => setCount(count + 1)}>+</button>
      <div onClick={clickHandle}>跳转</div>
      <div onClick={goToMain}>跳转到main页面</div>
    </div>
  )
}

function goToMain() {
  console.log(process.env.WECHAT);
  if (process.env.WECHAT) {
    wx.navigateTo({url: "../main/index"})
  } else {
    location.href = "main.html"
  }
}

function clickHandle() {
  if ('undefined' != typeof wx && "getSystemInfoSync" in wx) {
    wx.navigateTo({
      url: '../log/index?id=1',
    })
  } else {
    location.href = 'log.html'
  }
}

export default Counter
