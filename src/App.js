import React, { Component } from "react";
import { BrowserRouter, Redirect } from "react-router-dom"
import Headers from '@/components//bus/headers/index'
import MyMenu from '@/components/bus/menu/index'
import { renderRoutes } from "@/config/util"
import routerConfig from "@/config/router"
import { getUser } from "@api"
import storeLocal from 'storejs';
import { Layout } from 'antd';
import "./App.scss"
import style from './index.module.scss'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routers: []
    }
  }

  componentDidMount() {
    getUser().then(({ data }) => {
      storeLocal.set("user", data)
    })
    routerConfig().then(data => {
      this.setState({
        routers: data
      })
    })
  }

  render() {
    const { routers } = this.state
    return (
      routers.length &&
      <BrowserRouter>
        <Layout>
          <Headers></Headers>
          <Layout>
            <div className={style.container}>
              <div className={style.menu}>
                <MyMenu></MyMenu>
              </div>
              <div className={style.content}>
                {renderRoutes(routers)}
                <Redirect from='/' to='/collectionOverview' exact></Redirect>
              </div>
            </div>
          </Layout>
        </Layout>
      </BrowserRouter>)
  }
}

export default App;