/**
 * Route interface used to build an express.Router
 * @param handler defines the route handler
 * @param method either 'get', 'post', 'put', 'delete' or 'all'
 * @param middlewares array of middlewares to use in the route (can be empty)
 * @param routeFunc function used to handle the route
 */
export interface Route {
    handler: string;
    method: string;
    middlewares: any[];
    routeFunc: any;
}