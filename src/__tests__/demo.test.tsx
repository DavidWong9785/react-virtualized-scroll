import React from 'react'
import { shallow, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import ReactVirtualizedScroll from '../component/ReactVirtualizedScroll/index'

configure({ adapter: new Adapter() })

const setup = () => {
    // 模拟 props
    const props = {
        height: '100vh',
        row: () => {},
        hasMore: true
    }
    // 通过 enzyme 提供的 shallow(浅渲染) 创建组件
    const wrapper = shallow(<ReactVirtualizedScroll {...props} />)
    return {
        props,
        wrapper,
    }
}

describe('测试height属性', () => {
    const { wrapper, props } = setup()
    it('props', () => {
        expect(props.height).toEqual('100vh')
    })
})
