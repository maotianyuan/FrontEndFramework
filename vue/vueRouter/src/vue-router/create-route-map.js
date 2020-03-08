export default function createRouteMap (routes, oldPathList, oldPathMap) {
  let pathList = oldPathList || [];
  let pathMap = oldPathMap || Object.create(null);
  
  const addRouteRecord = (routes = [], path = [], parent) => {
    if(routes.length <= 0) return;
    routes.map(route => {
      const allPath = path.concat(route.path).join('/')
      let recode = {
        path: allPath,
        component: route.component,
        parent,
      }
      if (!pathMap[allPath]) {
        pathList.push(allPath)
        pathMap[allPath] = recode
      }
      if (route.children) {
        addRouteRecord(route.children, path.concat(route.path), recode)
      }
    })
  }
  addRouteRecord(routes)
  console.log('pathList', pathList)
  console.log('pathMap', pathMap)
  return {
    pathList, 
    pathMap
  }
}
////////////////////////////////////////////////////////////////
/*
  pathList [*, /list, /list/a, /list/a/a1, /list/b, /login]
  pathMap {
    * : {
      path: '*',
      component: component,
      parent: undefined,
    },
    /list: {
      path: '/list',
      component: component,
      parent: undefined,
    },
    /list/a: {
       path: '/list/a',
      component: component,
      parent: {
        path: '/list',
        component: component,
        parent: undefined,
      },
    }
  }
*/