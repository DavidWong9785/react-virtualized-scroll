"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var react_virtualized_1 = require("react-virtualized");
var svg_1 = require("./svg");
require("../../assets/iconfont.css");
require("./style.css");
var VirtualizedScroll = function (_a, ref) {
    var children = _a.children, _b = _a.hasMore, hasMore = _b === void 0 ? true : _b, _c = _a.refreshDistance, refreshDistance = _c === void 0 ? 120 : _c, _d = _a.loading, loading = _d === void 0 ? false : _d, _e = _a.data, data = _e === void 0 ? [] : _e, info = _a.info, _f = _a.height, height = _f === void 0 ? '100vh' : _f, _g = _a.width, width = _g === void 0 ? '100vw' : _g, noDataRow = _a.noDataRow, onPullDown = _a.onPullDown, onPullUp = _a.onPullUp, onScroll = _a.onScroll, row = _a.row, _h = _a.logo, logo = _h === void 0 ? {} : _h;
    // 下拉状态
    var _j = react_1.useState('init'), STATS = _j[0], setSTATS = _j[1];
    // touch数据
    var _k = react_1.useState(0), startY = _k[0], setStartY = _k[1];
    var _l = react_1.useState(0), offset = _l[0], setOffset = _l[1];
    // vList容器
    var vListRef = react_1.useRef();
    var timer = react_1.useRef();
    // 上滑时，scrollTop为0禁止滑动
    var scrollingDisable = react_1.useRef(false);
    var hasMoreRef = react_1.useRef(true);
    var canNotDrag = react_1.useRef(false);
    react_1.useEffect(function () {
        hasMoreRef.current = hasMore;
    }, [hasMore]);
    react_1.useEffect(function () {
        canNotDrag.current = STATS === 'refreshing' || STATS === 'success' || STATS == 'scroll';
    }, [STATS]);
    var initState = function () {
        setOffset(0);
        setStartY(0);
    };
    var onTouchStart = function ($event) {
        if (canNotDrag.current || scrollingDisable.current)
            return;
        setStartY($event.nativeEvent.touches[0].pageY);
    };
    var onTouchMove = react_1.useCallback(function ($event) {
        if (canNotDrag.current || scrollingDisable.current)
            return;
        // if (!startY) {
        //   setStartY($event.nativeEvent.touches[0].pageY)
        //   return
        // }
        var offsetComputed = $event.nativeEvent.touches[0].pageY - startY;
        if (0 < offsetComputed && offsetComputed <= refreshDistance)
            setOffset(offsetComputed);
        else if (offsetComputed < 0)
            setOffset(0);
        else if (offsetComputed > refreshDistance)
            setOffset(refreshDistance);
        if (offset < refreshDistance && STATS !== 'dragging')
            setSTATS('dragging');
        else if (offset >= refreshDistance)
            setSTATS('pre-refresh');
    }, [startY, canNotDrag, offset, STATS]);
    var onTouchEnd = react_1.useCallback(function ($event) {
        if (canNotDrag.current)
            return;
        if (scrollingDisable.current) {
            initState();
            return;
        }
        if (STATS === 'pre-refresh') {
            setSTATS('refreshing');
            if (!onPullDown)
                return;
            onPullDown().then(function () {
                setSTATS('success');
                vListRef.current.scrollToRow(0);
                if (timer.current)
                    clearTimeout(timer.current);
                timer.current = setTimeout(function () {
                    setSTATS('init');
                    initState();
                }, 5000);
            });
        }
        else {
            initState();
            setSTATS('not-enough');
            if (timer.current)
                clearTimeout(timer.current);
            timer.current = setTimeout(function () {
                setSTATS('init');
            }, 5000);
        }
    }, [timer, STATS, canNotDrag]);
    var onScrollCallback = function (_a) {
        var clientHeight = _a.clientHeight, scrollTop = _a.scrollTop, scrollHeight = _a.scrollHeight;
        if (scrollTop === 0)
            scrollingDisable.current = false;
        else
            scrollingDisable.current = true;
        if ((clientHeight + scrollTop === scrollHeight) && onPullUp)
            onPullUp();
        if (onScroll)
            onScroll(clientHeight, scrollTop, scrollHeight);
    };
    var cache = new react_virtualized_1.CellMeasurerCache({ defaultHeight: 400, fixedWidth: true });
    react_1.useImperativeHandle(ref, function () { return ({
        vListRef: vListRef.current
    }); }, [vListRef]);
    var renderRow = react_1.useCallback(function (_a) {
        var index = _a.index, key = _a.key, parent = _a.parent, style = _a.style;
        return (react_1.default.createElement(react_virtualized_1.CellMeasurer, { cache: cache, columnIndex: 0, key: key, parent: parent, rowIndex: index },
            react_1.default.createElement("div", { className: "card-content", style: __assign({}, style), key: key },
                row({
                    index: index, info: info
                }, data),
                index === data.length - 1 ? !hasMoreRef.current ?
                    (react_1.default.createElement("div", { className: "load-item", style: { height: '50px', width: '100%' } }, logo.pullup_success ? logo.pullup_success : '没有更多了')) :
                    (react_1.default.createElement("div", { className: "load-item", style: { height: '50px', width: '100%' } }, logo.pullup_loading ? logo.pullup_loading : react_1.default.createElement("img", { src: svg_1.loading_pullup, alt: "" }))) : '')));
    }, [data, hasMoreRef]);
    var VirtualScroll = react_1.useMemo(function () { return (react_1.default.createElement("div", { className: "content-wrap", style: {
            width: width,
            height: height,
            position: 'relative'
        } },
        children,
        !data.length ? noDataRow ? noDataRow : '' :
            (react_1.default.createElement(react_virtualized_1.AutoSizer, null, function (_a) {
                var height = _a.height, width = _a.width;
                return (react_1.default.createElement(react_virtualized_1.List, { ref: function (ref) { return vListRef.current = ref; }, onScroll: onScrollCallback, height: height, width: width, rowHeight: cache.rowHeight, rowCount: data.length, rowRenderer: renderRow }));
            })))); }, [data]);
    return (react_1.default.createElement("div", { id: "virtualized-scroll-panel", onTouchStart: onTouchStart, onTouchMove: onTouchMove, onTouchEnd: onTouchEnd },
        react_1.default.createElement("div", { className: "list-box" },
            react_1.default.createElement("div", { className: "pull-down-box", style: {
                    top: offset - 45 + "px",
                    transition: STATS === 'dragging' ? 'none' : 'all .3s',
                    zIndex: 999
                } },
                react_1.default.createElement("div", { className: "pull-down-round" },
                    react_1.default.createElement("div", { className: "inner", style: {
                            transform: "rotate(" + (offset / refreshDistance) * 720 + "deg)",
                            transition: STATS === 'refreshing' || STATS === 'dragging' ? 'none' : 'all .3s',
                            animation: STATS === 'refreshing' ? 'self_rotate 1s infinite linear' : ''
                        } }, STATS === 'success' || STATS === 'init' ?
                        logo.pulldown_success ? logo.pulldown_success : react_1.default.createElement("i", { className: "icon iconfont iconcheck-circle" })
                        : logo.pulldown_loading ? logo.pulldown_loading : react_1.default.createElement("i", { className: "icon iconfont iconshuaxin" })))),
            VirtualScroll)));
};
exports.default = react_1.forwardRef(VirtualizedScroll);
