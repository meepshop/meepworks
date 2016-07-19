/**
 * meepworks-initialize-class-application-getChildRoutes
 * initialize getChildRoutes
 *
 * @param {object} location - react-router location object
 * @param {Function} cb
 * @param {object} own - High Level Context Container by (route)
 */
function _getChildRoutes_initializer(location, cb, own) {
  if(own[_Routes]) {
    router_checker(own[_Routes], cb)
  } else if(own[_LoadingRoutes]) {

    (async () => {
      await own[_LoadingRoutes];
      router_checker(own[_Routes], cb)
    })();
  } else {
    own[_LoadingRoutes] = (async () => {
      let childRoutes = [];
      childRoutes = await asyncMap(own[_ChildRoutes], r => {
        try {
          let child = new r(own[_Ctx]);
          return child.routes;
        } catch (err) {
          warning(err)
        }
      });
      own[_Routes] = childRoutes.filter(r => !!r);
      router_checker(own[_Routes], cb)
    })();
  }
}

export default _getChildRoutes_initializer
