import { Menu } from 'antd';
import { Component } from 'react'
import { menu } from '@/assets/js/api'
import { _getMenuRouters } from '@/config/router'
import { withRouter } from 'react-router-dom'
import './index.scss'

const { SubMenu } = Menu;

class MyMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuData: []
        }
    }
    handleClick(event) {
        const { key: path } = event
        this.props.history.push(path)
    };

    getMenuTree(menuArr) {
        if (menuArr.length) {
            return menuArr.map(item => {
                return (
                    <Menu.Item key={item.path}>{item.name}</Menu.Item>
                )
            })
        }
    }

    async componentDidMount() {
        let { data } = await menu()
        let menuData = _getMenuRouters(data)
        this.setState({
            menuData
        })
    }

    render() {
        const { menuData } = this.state
        return (
            <div className='leftMenu'>
                <Menu
                    onClick={this.handleClick.bind(this)}
                    style={{ width: 200, height: '100%' }}
                    defaultSelectedKeys={['1']}
                    mode="inline"
                >
                    {
                        menuData.length && menuData.map((menu) => {
                            if (menu.children.length) {
                                return (
                                    <SubMenu key={menu.path} title={menu.name}>
                                        {this.getMenuTree(menu.children)}
                                    </SubMenu>
                                )
                            } else {
                                return (
                                    <Menu.Item key={menu.path}>{menu.name}</Menu.Item>
                                )
                            }
                        })
                    }
                </Menu>
            </div>
        );
    }
}

export default withRouter(MyMenu);