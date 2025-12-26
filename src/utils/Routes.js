const routes ={
    VOLUNTEER_ADD: '/volunteer/add',
    VOLUNTEER_DETAILS:'/volunteer',
    DONOR_ADD: '/donor/add',
    DONOR_DETAILS:'/donor',
    EVENT:'/event',
    EVENT_DETAILS:'/event',
    EVENT_ADD:'/event/add',
    EVENT_EDIT:'/event/[id]/edit'
}
export const getRoute = (routeName) => {
    return routes[routeName] || '/';
}

export default routes;