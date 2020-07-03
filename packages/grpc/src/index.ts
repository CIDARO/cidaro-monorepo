import * as grpc from 'grpc';
import * as protoLoader from '@grpc/proto-loader';
import * as grpc_promise from 'grpc-promisify';
import { GrpcCredentials, GrpcService } from './lib';

export namespace CidaroGrpc {
    /**
     * Creates a new gRPC client using all the input parameters and promisifies all its functions.
     * @param protoPath path where the .proto file is stored
     * @param packageName name of the package
     * @param serviceName name of the service
     * @param serviceHost host of the gRPC server
     * @param sslCredentials if ssl must be used, then ssl credentials must be provided
     */
    export function createClient(protoPath: string, packageName: string, serviceName: string, serviceHost: string, sslCredentials?: GrpcCredentials): grpc.GrpcObject {
        const Service = loadService(protoPath, packageName, serviceName);
        const { rootCerts, privateKey, certChain, verifyOptions } = sslCredentials || { rootCerts: null, privateKey: null, certChain: null, verifyOptions: null };
        const client = new Service(serviceHost, sslCredentials ? grpc.credentials.createSsl(rootCerts, privateKey, certChain, verifyOptions) : grpc.credentials.createInsecure());
        grpc_promise.promisify_all(client);
        return client;
    }

    /**
     * Creates a new gRPC server using all the input parameters and services.
     * @param port port where to bind the gRPC server
     * @param services array of GrpcServices to add to the server
     * @param sslCredentials if ssl must be used, then ssl credentials must be provided
     */
    export function createServer(port: number, services: GrpcService[], sslCredentials?: GrpcCredentials): grpc.Server {
        const server = new grpc.Server();
        services.forEach((s: GrpcService) => {
            const { protoPath, packageName, serviceName, methods } = s;
            const methodsObject = {};
            methods.forEach((method) => {
                const { name, handler } = method; 
                methodsObject[name] = handler; 
            })
            server.addService(loadService(protoPath, packageName, serviceName), methodsObject);
        });
        const { rootCerts, privateKey, certChain, verifyOptions } = sslCredentials || { rootCerts: null, privateKey: null, certChain: null, verifyOptions: null };
        server.bind(`0.0.0.0:${port}`, sslCredentials ? grpc.credentials.createSsl(rootCerts, privateKey, certChain, verifyOptions) : grpc.credentials.createInsecure());
        return server;
    }

    /**
     * Loads a service using its proto filepath, the package name and service name.
     * @param protoPath path where the .proto file is stored
     * @param packageName name of the package
     * @param serviceName name of the service
     * @param longsAsNum true/false whether the longs must be treated as Numbers (default is String)
     * @param enumsAsNum true/false whether the enums must be treated as Numbers (default is String)
     */
    function loadService(protoPath: string, packageName: string, serviceName: string, longsAsNum?: boolean, enumsAsNum?: boolean): any {
        const packageDefinition = protoLoader.loadSync(
            protoPath,
            {
                keepCase: true,
                longs: longsAsNum ? Number : String,
                enums: enumsAsNum ? Number : String,
                defaults: true,
                oneofs: true
            },
        );
        return grpc.loadPackageDefinition(packageDefinition)[packageName][serviceName];
    }
}