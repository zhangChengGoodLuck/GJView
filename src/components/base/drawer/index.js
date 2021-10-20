import React from 'react';
import { Drawer, Button } from 'antd';
import style from './index.module.scss'

class MyDrawer extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            visible: false
        }
    }



    render() {
        const { content, footer: footerNode, title, ...config } = this.props

        const titleNode = (
            <div className={style.header}>
                <div className={style.circle}></div>
                <h4>{title}</h4>
            </div>
        )

       

        return (
            <Drawer maskClosable={false} width={500} title={titleNode} footer={footerNode} {...config}>
                {content}
            </Drawer>
        );
    }

};

export default MyDrawer