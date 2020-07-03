import * as express from 'express';

export interface Route {
    handler: string; // defines the route handler
    method: string; // either 'get', 'post', 'put', 'delete' or 'all'
    middlewares: any[]; // array of middlewares to use in the route (can be empty)
    routeFunc: any; // function used to handle the route
}

export interface Router {
    handler: string; // where to mount the router
    router: express.Router; // express Router
}