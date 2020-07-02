import * as grpc from 'grpc';

export interface GrpcCredentials {
    rootCerts?: Buffer; // file buffer for the root certs
    privateKey?: Buffer; // file buffer for the private key
    certChain?: Buffer; // file buffer for the cert chain
    verifyOptions?: grpc.VerifyOptions; // grpc verify options object
}

export interface GrpcService {
    protoPath: string; // path for the proto object
    packageName: string; // name of the package
    serviceName: string; // name of the service
    methods: GrpcMethod[]; // array containing name/handler pairs
}

export interface GrpcMethod {
    name: string; // name of the method
    handler: any; // handler function
}