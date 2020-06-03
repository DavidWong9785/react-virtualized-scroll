"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStateAndRef = void 0;
var react_1 = require("react");
exports.useStateAndRef = function (data) {
    var _a = react_1.useState(data), data = _a[0], setData = _a[1];
    var dataRef = react_1.useRef(data);
    react_1.useEffect(function () {
        dataRef.current = data;
    }, [data]);
    return [data, setData, dataRef];
};
