import { Route } from "react-router-dom";

// 根据路由配置实现 Route 渲染
// 这里使用了箭头函数, 省去了很多的 return
/** 这里返回的其实就是要渲染的 Route 列表，大概像下面这样
* [<Route/>, <Route/>...]
* 就是用下面的函数代替了手动写 Route
*/
export const renderRoutes = (routerConfig) => 

    // 将需要用到的属性component,children解构出来,其他直接根据配置渲染到 Route 上
    (routerConfig || []).map(({ component: Component, children, ...routeProps }) =>
        /* render() 是component={} 的替代写法,
        * 这里使用render进行渲染是为了将 当前路由的子路由 children 绑定到 routes 属性,
        * 这样子元素的props终究会出现 routes,也就是当前组建的子路由,再合适的位置进行`渲染`就可以了
        */
        <Route {...routeProps}
            render={(props) => <Component {...props} routes={children} />} />
    )

