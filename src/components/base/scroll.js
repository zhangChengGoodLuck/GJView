import React, { Component } from 'react'
import BScroll from 'better-scroll'

export default class AppScroll extends Component {
    //利用ref精准的获取dom元素
    wrapper = React.createRef();

    render() {
        const wrapper = {
            width: '100%',
            height: '100%',
            overflow: 'hidden',
        }
        return (
            <div className='wrapper' style={wrapper} ref={this.wrapper}>
                <div className="scroll-content">
                    {this.props.children}
                </div>
            </div>
        )
    }

    componentDidMount() {
        let scroll = new BScroll('.wrapper', {
            scrollbar: true,
        })
        // 在用户需要滚动前及时更新滚动视图
        scroll.on('beforeScrollStart', () => {
            scroll.refresh();
        })
    }
}