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
  info?: any;
  height?: string;
  width?: string;
  noDataRow?: JSX.Element;
  logo? : ILogo;
  onPullUp(): any;
  onPullDown(): any;
  onScroll(clientHeight: number, scrollTop: number, scrollHeight: number): any;
  row({index, info}: {index: number, info: any}, data: any): any;
}

const VirtualizedScroll: React.FC<any> = ({
  children,
  hasMore = true,
  refreshDistance = 120,
  loading = false,
  data = [],
  info,
  height = '100vh',
  width = '100vw',
  noDataRow,
  onPullDown,
  onPullUp,
  onScroll,
  row,
  logo = {}
}: IVirtualized, ref: any) => {

  const [STATS, setSTATS] = useState<string>('init')
  const [startY, setStartY] = useState<number>(0)
  const [offset, setOffset] = useState<number>(0)
  const vListRef = useRef<any>()
  const timer = useRef<any>()
  const disabledTag = useRef(false)
  const pullingDown = useRef(false)
  const pullingUp = useRef(false)
  
  const hasMoreRef = useRef(true)

  useEffect(() => {
    hasMoreRef.current = hasMore
  }, [hasMore])

  const cantMove = useMemo(() => {
    return STATS === 'refreshing' || STATS === 'refreshed'
  }, [STATS])

  const initState = () => {
    setOffset(0)
    setStartY(0)
  }

  const onTouchStart = ($event: TouchEvent) => {
    if (cantMove || disabledTag.current || pullingDown.current) return
    setStartY($event.nativeEvent.touches[0].pageY)
  }
  const onTouchMove = useCallback(
    ($event: TouchEvent) => {
      if (cantMove || disabledTag.current || pullingDown.current) return
      if (!startY) {
        setStartY($event.nativeEvent.touches[0].pageY)
        return
      }
      const offsetComputed = $event.nativeEvent.touches[0].pageY - startY
      if (0 < offsetComputed && offsetComputed <= refreshDistance) setOffset(offsetComputed)
      else if (offsetComputed < 0) setOffset(0)
      else if (offsetComputed > refreshDistance) setOffset(refreshDistance)
  
      if (offset < refreshDistance && STATS !== 'pull') setSTATS('pull')
      else if (offset >= refreshDistance) setSTATS('preRefreshing')
    },
    [startY, cantMove, offset, STATS],
  )
  const onTouchEnd = useCallback(
    ($event: TouchEvent) => {
      if (cantMove || disabledTag.current || pullingDown.current) {
        initState()
        return
      }
      if (STATS === 'preRefreshing') {
        setSTATS('refreshing')
        if (!onPullDown) return
        pullingDown.current = true
        onPullDown().then(() => {
          setSTATS('refreshed')
          pullingDown.current = false
          vListRef.current.scrollToRow(0)
          if (timer.current) clearTimeout(timer.current)
          timer.current = setTimeout(() => {
            setSTATS('init')
            initState()
          }, 500)
        })
      } else {
        initState()
        setSTATS('pre-init')
        if (timer.current) clearTimeout(timer.current)
        timer.current = setTimeout(() => {
          setSTATS('init')
        }, 500)
      }
  
    },
    [timer, STATS, cantMove],
  )

  const onScrollCurrent = ({ clientHeight, scrollTop, scrollHeight }: any) => {
    disabledTag.current = !disabledTag.current
    if (scrollTop === 0) disabledTag.current = false
    else disabledTag.current = true

    if ((clientHeight+scrollTop === scrollHeight) && onPullUp) onPullUp()
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
              row({
                index, info
              }, data)
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
    },
    [data, hasMoreRef],
  )

  const VirtualScroll = useMemo(() => (
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
                      onScroll={onScrollCurrent}
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
  ), [data])

  return (
    <div id="virtualized-scroll-panel" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      <div className="list-box">
        <div className="pull-down-box" style={{
          top: `${offset - 45}px`,
          transition: STATS === 'pull' ? 'none' : 'all .3s',
          zIndex: 999
        }}>
          <div className="pull-down-round">
            <div className="inner" style={{
              transform: `rotate(${(offset / refreshDistance) * 720}deg)`,
              transition: STATS === 'refreshing' || STATS === 'pull' ? 'none' : 'all .3s',
              animation: STATS === 'refreshing' ? 'self_rotate 1s infinite linear' : ''
            }}>
              {
                STATS === 'refreshed' || STATS === 'init' ? 
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
