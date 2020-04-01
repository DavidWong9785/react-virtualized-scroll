import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import rvs from '../../lib/component/ReactVirtualizedScroll/index.js'
// import ReactVirtualizedScroll from '../../src/component/ReactVirtualizedScroll/index.tsx'
import { loading_pullup } from '../../src/component/ReactVirtualizedScroll/svg'

const { ReactVirtualizedScroll, useStateAndRef } = rvs

const initState = [{
    key: 1,
    value: 1
}, {
    key: 2,
    value: 2
}, {
    key: 3,
    value: 3
}, {
    key: 4,
    value: 4
}, {
    key: 5,
    value: 5
}]

const example = () => {
    const [data, setData, dataRef] = useStateAndRef(initState)

    const [hasMore, setHasMore] = useState(true)
    const info = {
        title: 'VirtualizedScroll',
        desc: '虚拟滚动搭配上拉下滑加载的scroll组件'
    }
    const requestPullDown = () => {
        return new Promise(resolve => {
            setTimeout(() => {
                setData(initState)
                setHasMore(true)
                resolve()
            }, 2000);
        })
    }
    const requestPullUp = useCallback(
        () => {
            return new Promise(resolve => {
                if (data.length === 100) {
                    setHasMore(false)
                    resolve()
                }
                else {
                    setTimeout(() => {
                        const target: any = []
                        for (let i = data.length + 1; i < data.length + 6; i++) {
                            target.push({
                                key: i,
                                value: i
                            })
                        }
                        setData(data.concat(target))
                        resolve()
                    }, 3000);
                }
            })
        },
        [data],
    )
    const handlePullDown = async () => {
        await requestPullDown()
    }
    const handlePullUp = async () => {
        await requestPullUp()
    }
    const onScroll = (clientHeight: number, scrollTop: number, scrollHeight: number) => {
        // console.log('onScroll')
    }
    const logo = {
        pulldown_loading: <i className="icon iconfont iconshuaxin"></i>,
        pulldown_success: <i className="icon iconfont iconcheck-circle"></i>,
        pullup_loading:  <img src={loading_pullup}/>,
        pullup_success: '没有更多了',
    }
    const countAdd = ((index: number) => {
        const newData = dataRef.current
        newData[index].value += 100
        setData(JSON.parse(JSON.stringify(newData)))
    })

    const Row = ((args: any) => {
        const {index, info, data} = args
        return <div style={{
            width: '100vw',
            height: '200px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            background: '#6495ED',
            color: '#fff',
            marginBottom: '10px'
        }}
        onClick={() => countAdd(index)}>
            <p>{ info.title } - { data[index].value }</p>
            <p>{ info.desc }</p>
        </div>
    })

    return (
        <div>
            <ReactVirtualizedScroll
                onPullUp={handlePullUp}
                hasMore={hasMore}
                data={data}
                row={Row}
                height={"100vh"}
                onScroll={onScroll}
                info={info}
                logo={logo}>
            </ReactVirtualizedScroll>
        </div>
    )
}

export default example
