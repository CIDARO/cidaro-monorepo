import * as mongoose from 'mongoose';

export namespace CidaroDatabase {
    /**
     * Returns a Promise for connecting to a MongoDB database
     * using the input {@link dbConnection} string.
     * @param dbConnection database connection string
     * @param useNewUrlParser true/false whether to use or not new url parser
     * @param useCreateIndex true/false whether to use or not create index
     * @param useUnifiedTopology true/false whether to use or not unified typology
     */
    export function connectToMongoDB(dbConnection: string, useNewUrlParser?: boolean, useCreateIndex?: boolean, useUnifiedTopology?: boolean) {
        return new Promise((resolve, reject) => {
            mongoose.connect(
                dbConnection,
                {
                    useNewUrlParser: useNewUrlParser || true,
                    useCreateIndex: useCreateIndex || true,
                    useUnifiedTopology: useUnifiedTopology || true,
                },
                (err) => (err ? reject(err) : resolve(`Successfully connected to MongoDB`)),
            );
        })
    }
}