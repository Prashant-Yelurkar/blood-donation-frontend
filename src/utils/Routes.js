const routes = {
  DASHBOARD: "/",
  ADMIN: "/admin",
  ADMIN_ADD: "/admin/add",
  ADMIN_DETAILS: "/admin/",
  AREA: "/area",
  AREA_ADD: "/area/add",
  AREA_DETAILS: "/area/",
  VOLUNTEER_ADD: "/volunteer/add",
  VOLUNTEER_DETAILS: "/volunteer",
  DONOR_ADD: "/donor/add",
  DONOR_DETAILS: "/donor",
  EVENT: "/event",
  EVENT_DETAILS: "/event",
  EVENT_ADD: "/event/add",
  EVENT_EDIT: "/event/[id]/edit", // dynamic
};

export const getRoute = (routeName, params = {}) => {
  let path = routes[routeName] || "/";

  Object.keys(params).forEach((key) => {
    path = path.replace(`[${key}]`, params[key]);
  });

  return path;
};

export default routes;
