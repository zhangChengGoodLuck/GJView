import { Component } from "react"
import { Spin } from 'antd';

const asyncLoadComponent = (loadComponent) => class AsyncComponent extends Component {
    constructor(props) {
        super(props)
        this.state = { component: null }
    }
    componentDidMount() {
        loadComponent()
            .then(res => res).then(res => {
                this.setState({ component: res.default || res })
            })
    }
    render() {
        const { component: Component } = this.state
        //注意: 这里一定要把 props 传下去 (里面包含了子路由routes信息, 不传递的话会导致子路由无法渲染哦)
        return Component ? <Component {...this.props} /> :
            <div style={{ width: '100vw', height: '100vh' }}>
                <Spin />
            </div>
    }
}

export default asyncLoadComponent