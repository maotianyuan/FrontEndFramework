import { createRoute } from './history/base'
import createRouteMap from './create-route-map'

export default function createMatcher (routes) {
  
  const { pathList, pathMap } = createRouteMap(routes)
  
  const addRoute = (routes) => {
    createMatcherMaps(value, pathList, pathMap)
  }
  const match = (location) => {
    let record = pathMap[location];
    return createRoute(record, {path: location})
  }

  return {
    addRoute,
    match
  }
}