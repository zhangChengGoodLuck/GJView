import asyncLoadComponent from './asyncLoadComponent'
import { menu } from '@/assets/js/api'
import { genID } from '@/assets/js/util'

// 将项目中的路由关系配置成数组
/**
 * path 匹配的路径，就是 Route 的 path
 * component 要渲染的组件（这里先采用上面导入方式，后面进行lazy()懒加载优化）
 * children 需要在当前页面渲染的子路由，也是个数组和外层路由结构基本一致
 */

const routerConfig = async () => {
  let { data } = await menu()
  addCustomChildrenUrl(data)
  let routersConfig = _getRouters([...data])
  console.log(routersConfig);
  return routersConfig || []
}


const addCustomChildrenUrl = (data) => {
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (item.children.length) {
      addCustomChildrenUrl(item.children)
    } else {
      if (item.menuPath === "monitoringTaskManagement") {
        item.children.push({
          children: [],
          iconPath: null,
          id: genID(),
          menuName: "详情",
          menuPath: "detail",
          pid: item.id,
        }, {
          children: [],
          iconPath: null,
          id: genID(),
          menuName: "首页",
          menuPath: "home",
          pid: item.id,
        })
      }
    }
  }
}


export function _getRouters(
  data,
  componentUrl = "",
  isChildren = "/",
  childrenTitle = ""
) {
  let _url = "";
  _url = componentUrl ? _url + componentUrl + "/" : "";

  return data.map((item) => {
    return {
      path: `${isChildren}${item.menuPath}`,
      key: item.id,
      meta: {
        title: item.menuName,
        fullTitle: childrenTitle ? childrenTitle + "/" + item.menuName : item.menuName,
      },
      component: asyncLoadComponent(() => import("@/pages/" + _url + item.menuPath + "")),
      children: item.children.length
        ? _getRouters(
          item.children,
          _url + item.menuPath,
          isChildren + item.menuPath + '/',
          childrenTitle + "/" + item.menuName
        )
        : [],
    };
  });
}

export function _getMenuRouters(data, prefix = "/") {
  return data.map((item) => {
    let len = item.children.length;
    let menu = {
      path: prefix + item.menuPath,
      name: item.menuName,
      children: len
        ? _getMenuRouters(item.children, prefix + item.menuPath + "/")
        : [],
    };
    return menu;
  });
}

export default routerConfig