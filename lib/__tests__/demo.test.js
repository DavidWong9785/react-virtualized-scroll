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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var enzyme_1 = require("enzyme");
var enzyme_adapter_react_16_1 = __importDefault(require("enzyme-adapter-react-16"));
var index_1 = require("../component/ReactVirtualizedScroll/index");
enzyme_1.configure({ adapter: new enzyme_adapter_react_16_1.default() });
var setup = function () {
    // 模拟 props
    var props = {
        height: '100vh',
    };
    // 通过 enzyme 提供的 shallow(浅渲染) 创建组件
    var wrapper = enzyme_1.shallow(react_1.default.createElement(index_1.ReactVirtualizedScroll, __assign({}, props)));
    return {
        props: props,
        wrapper: wrapper,
    };
};
describe('测试height属性', function () {
    var _a = setup(), wrapper = _a.wrapper, props = _a.props;
    it('props', function () {
        expect(props.height).toEqual('100vh');
    });
});
