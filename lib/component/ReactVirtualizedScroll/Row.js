"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Row = function (_a) {
    var row = _a.row, data = _a.data, index = _a.index, info = _a.info;
    var Render = row({ data: data, index: index, info: info });
    return react_1.useMemo(function () {
        console.log('data[index].value]', index, data[index].value);
        return Render;
    }, [JSON.stringify(data[index])]);
};
exports.default = Row;
