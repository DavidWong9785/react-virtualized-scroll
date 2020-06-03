import React, { useState, useMemo, TouchEvent, useRef, useCallback, forwardRef, useImperativeHandle, useEffect } from 'react';
import { List as VList, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import { loading_pullup } from './svg';
import '../../assets/iconfont.css'
import './style.css'

interface ILogo {
  pulldown_loading?: JSX.Element;
  pulldown_success?: JSX.Element;
  pullup_loading?: JSX.Element;
  pullup_success?: JSX.Element;
}

interface IVirtualized {
  children? : JSX.Element;
  hasMore : boolean;
  refreshDistance? : number;
  loading? : boolean;
  data? : any;
  info? : any;
  height? : string;
  width? : string;
  noDataRow? : JSX.Element;
  logo? : ILogo;
  onPullUp? : any;
  onPullDown? : any;
  onScroll?: any;
  row({index, info}: {index: number, info: any, data: any}): any;
}

const Row = ({ row, data, index, info }:any) => {
  return useMemo(() => {
      return row({ data: data, index, info })
  }, [JSON.stringify(data[index])])
}

const VirtualizedScroll = ({
  children,
  hasMore = true,
  refreshDistance = 120,
  loading = false,
  data = [],
  info,
  height = '100vh',
  width = '100vw',
  noDataRow,
  onPullDown = null,
  onPullUp = null,
  onScroll = null,
  row,
  logo = {}
}: IVirtualized, ref: any) => {

  // 下拉状态
  const [STATS, setSTATS] = useState<string>('init')
  // touch数据
  const [startY, setStartY] = useState<number>(0)
  const [offset, setOffset] = useState<number>(0)
  // vList容器
  const vListRef = useRef<any>()
  const timer = useRef<any>()
  // 上滑时，scrollTop为0禁止滑动
  const scrollingDisable = useRef(false)
  
  const hasMoreRef = useRef(true)
  const canNotDrag = useRef(false)
  const isPullUpLoading = useRef(false)

  useEffect(() => {
    hasMoreRef.current = hasMore
  }, [hasMore])

  useEffect(() => {
    canNotDrag.current = STATS === 'refreshing' || STATS === 'success' || STATS == 'scroll' || !onPullDown
  }, [STATS])

  const initState = () => {
    setOffset(0)
    setStartY(0)
  }

  const onTouchStart = ($event: TouchEvent) => {
    if (canNotDrag.current || scrollingDisable.current) return
    setStartY($event.nativeEvent.touches[0].pageY)
  }

  const onTouchMove = useCallback(
    ($event: TouchEvent) => {
      if (canNotDrag.current || scrollingDisable.current) return

      const offsetComputed = $event.nativeEvent.touches[0].pageY - startY
      if (0 < offsetComputed && offsetComputed <= refreshDistance) setOffset(offsetComputed)
      else if (offsetComputed < 0) setOffset(0)
      else if (offsetComputed > refreshDistance) setOffset(refreshDistance)
  
      if (offset < refreshDistance && STATS !== 'dragging') setSTATS('dragging')
      else if (offset >= refreshDistance) setSTATS('pre-refresh')
    },
    [startY, canNotDrag, offset, STATS],
  )

  const onTouchEnd = useCallback(
    ($event: TouchEvent) => {
      if (canNotDrag.current) return
      if (scrollingDisable.current) {
        initState()
        return
      }
      if (STATS === 'pre-refresh') {
        setSTATS('refreshing')
        if (!onPullDown) return
        onPullDown().then(() => {
          setSTATS('success')
          if (vListRef.current) vListRef.current.scrollToRow(0)
          if (timer.current) clearTimeout(timer.current)
          timer.current = setTimeout(() => {
            setSTATS('init')
            initState()
          }, 500)
        })
      } else {
        initState()
        setSTATS('not-enough')
        if (timer.current) clearTimeout(timer.current)
        timer.current = setTimeout(() => {
          setSTATS('init')
        }, 500)
      }
  
    },
    [timer, STATS, canNotDrag],
  )

  const onScrollCallback = ({ clientHeight, scrollTop, scrollHeight }: any) => {

    if (scrollTop === 0) scrollingDisable.current = false
    else scrollingDisable.current = true

    if ((clientHeight + scrollTop === scrollHeight) && onPullUp && !isPullUpLoading.current) {
      isPullUpLoading.current = true
      onPullUp().then(() => {
        isPullUpLoading.current = false
        if (vListRef.current) vListRef.current.scrollToRow(data.length + 1)
      }).catch(() => {
        isPullUpLoading.current = false
      })
    }
    if (onScroll) onScroll(clientHeight, scrollTop, scrollHeight)
  }

  const cache = new CellMeasurerCache({ defaultHeight: 400,fixedWidth: true});

  useImperativeHandle(
    ref,
    () => ({
      vListRef: vListRef.current
    }),
    [vListRef],
  )

  const renderRow = useCallback(
    ({ index, key, parent, style }: any) => {
      return (
        <CellMeasurer
          cache={cache}
          columnIndex={0}
          key={key}
          parent={parent}
          rowIndex={index}>
          <div className="card-content" style={ { ...style } } key={key}>
            {
              <Row
                row={row}
                data={data}
                index={index}
                info={info}></Row>

            }
            {
                index === data.length - 1 ? !hasMoreRef.current ? 
                (
                  <div className="load-item" style={{ height: '50px', width: '100%' }}>
                    { logo.pullup_success ? logo.pullup_success : '没有更多了' }
                  </div>
                ) :
                (
                  <div className="load-item" style={{ height: '50px', width: '100%' }}>
                    { logo.pullup_loading ? logo.pullup_loading : <img src={loading_pullup} alt=""/> }
                  </div>
                ) : ''
            }
          </div>
        </CellMeasurer>
      )
    }, [data, hasMoreRef]
  )

  const VirtualScroll = useMemo(() => {
    return (
      <div className="content-wrap" style={{
          width,
          height,
          position: 'relative'
      }}>
          { children }
          {
            !data.length ? noDataRow ? noDataRow : '' :
            (
                <AutoSizer>
                {
                    ({ height, width }: any) => (
                    <VList
                        ref={(ref: any) => vListRef.current = ref}
                        onScroll={onScrollCallback}
                        height={height}
                        width={width}
                        rowHeight={cache.rowHeight}
                        rowCount={data.length}
                        rowRenderer={renderRow}
                    />
                    )
                }
                </AutoSizer>
            )
          }
      </div>
    )
  }, [data])

  return (
    <div id="virtualized-scroll-panel" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      <div className="list-box">
        <div className="pull-down-box" style={{
          top: `${offset - 45}px`,
          transition: STATS === 'dragging' ? 'none' : 'all .3s',
          zIndex: 999
        }}>
          <div className="pull-down-round">
            <div className="inner" style={{
              transform: `rotate(${(offset / refreshDistance) * 720}deg)`,
              transition: STATS === 'refreshing' || STATS === 'dragging' ? 'none' : 'all .3s',
              animation: STATS === 'refreshing' ? 'self_rotate 1s infinite linear' : ''
            }}>
              {
                STATS === 'success' || STATS === 'init' ? 
                  logo.pulldown_success ? logo.pulldown_success : <i className="icon iconfont iconcheck-circle"></i> 
                 : logo.pulldown_loading ? logo.pulldown_loading : <i className="icon iconfont iconshuaxin"></i>
              }
            </div>
          </div>
        </div>
        { VirtualScroll }
      </div>
    </div>
  );
};

export default forwardRef(VirtualizedScroll);
