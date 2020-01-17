# react-virtualized-scroll
虚拟滚动搭配上拉下滑加载的scroll组件

### 简介

- 搭配 ts 和 react-hooks 编写的虚拟滚动组件
- 基于 react-virtualized 进行再封装。
- 暴露了 react-virtualized 的 ref，可调用用 react-virtualized 的方法
- 除了渲染列表，你还可以传入其他的子组件（如悬浮球~等），只需要把定位设为 fixed

### 安装导入

> cnpm i react-virtualized react-virtualized-scroll --save

> import ReactVirtualizedScroll from 'react-virtualized-scroll'

### 使用

```
    <ReactVirtualizedScroll
        onPullDown={handlePullDown}
        onPullUp={handlePullUp}
        hasMore={hasMore}
        data={data}
        row={Row}
        height={"100vh"}
        width={"100vw"}
        onScroll={onScroll}
        info={info}
        logo={logo}>
        <div style="position: fixed;top: 50%">fixed element</div>
    </ReactVirtualizedScroll>
```

### 属性解释

| 名称     | 类型  | 说明                                                                                                                                                                             |
| ---------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| width      | string | 列表宽度，带单位                                                                                                                                                           |
| height     | string | 列表高度，带单位                                                                                                                                                           |
| hasMore    | boolean | 判断是否还可以下滑加载。                                                                                                                                               |
| data       | array  | 用于渲染列表的目标数组                                                                                                                                                  |
| info       | object  | 需要传入 row 渲染函数的数据，可选                                                                                                                                    |
| logo       | object  | 加载的logo，四个属性 |
| onPullDown | function  | 下拉加载回调，该方法需要返回一个promise对象，即您可以使用 async 方法或者直接返回 promise 对象。当 promise 状态完成之后（resolve/reject），下拉加载状态结束 |
| onPullUp   | function  | 上滑加载回调，目的同上，该方法需要返回一个 promise 对象                                                                                                     |
| onScroll   | function  | 滑动回调，参数（clientHeight: number, scrollTop: number, scrollHeight: number）                                                                         |
| row        | function  | 列表每一行的渲染函数，参数（{ index, info }, data），参数一为一个对象，属性包含该行索引 index 和自定义传入的 info ，参数二是用于渲染列表的目标数组 |

### logo属性（字符串，图片等等，只要是JSX.Element即可）

| 属性 | 说明 |
| ---------------- | --------------------- |
| pulldown_loading | 下拉加载loading的logo |
| pulldown_success | 下拉加载成功的logo |
| pullup_loading   | 上滑加载loading的logo |
| pullup_success   | 上滑加载成功的logo |