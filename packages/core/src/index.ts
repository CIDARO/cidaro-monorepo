import * as express from 'express';
import * as cors from 'cors';
import { Route } from './lib';

export namespace CidaroCore {
    /**
     * Performs the basic setup of an express application by disabling 'etag'/'x-powered-by' headers,
     * by adding JSON and URLEncoded middleware and by adding the '/ping' heartbeat route.
     * Also it adds any cors options to the express application.
     * @param app express application
     * @param corsOptions cors options object 
     * @param jsonLimit limit for json body as string (default '1mb')
     * @param urlencodedLimit limit for urlencoded body as string (default '1mb')
     * @param extended bool true/false
     * @param auth bool true/false if the app uses the auth middleware on all requests
     */
    export function setupExpressApp(app: express.Application, corsOptions: cors.CorsOptions, jsonLimit: string = '1mb', urlencodedLimit: string = '1mb', extended: boolean = true, auth: boolean = true): express.Application {
        // Implement the cors options
        app.use(cors(corsOptions));
        // Disable etag and x-powered-by for performance purposes
        app.disable('etag').disable('x-powered-by');
        // JSON and URLEncoded middlewares
        app.use(express.json({limit: jsonLimit}));
        app.use(express.urlencoded({limit: urlencodedLimit, extended}))
        // Heartbeat route
        app.get('/ping', async (req, res) => res.status(200).send('pong'));
        // Check if auth must be used on all requests
        if (auth) app.use(authMiddleware);
        // Return the application
        return app;
    }

    /**
     * Creates a basic auth middleware that checks for the 'Bearer' authorization token.
     * Validation of the token is not done in this middleware.
     *  
     * @param req express request
     * @param res express response
     * @param next express next middleware function
     */
    export async function authMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
        const token = req.headers.authorization.replace('Bearer', '');
        try {
            if (!token) res.status(401).send({error: 'Not authorized.'});
            req['token'] = token;
            next();
        } catch (error) {
            res.status(401).send({error: 'Not authorized.'});
        }
    }

    /**
     * Creates a new express Router using the input Routes.
     * @param routes array with all the routes to register
     */
    export async function createRouter(routes: Route[]): Promise<express.Router> {
        const router = express.Router();
        routes.forEach((route: Route) => {
            const { handler, method, middlewares, routeFunc } = route;
            switch (method) {
                case 'get':
                    router.get(handler, middlewares, routeFunc);
                case 'post':
                    router.post(handler, middlewares, routeFunc);
                case 'put':
                    router.put(handler, middlewares, routeFunc);
                case 'delete':
                    router.delete(handler, middlewares, routeFunc);
                default:
                    router.all(handler, middlewares, routeFunc);
            }
        })
        return router;
    }
}