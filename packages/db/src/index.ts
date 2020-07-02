import * as mongoose from 'mongoose';

export namespace CidaroDatabase {
    /**
     * Returns a Promise for connecting to a MongoDB database
     * using the input {@link dbConnection} string.
     * @param dbConnection database connection string
     */
    export function connectToMongoDB(dbConnection: string) {
        return new Promise((resolve, reject) => {
            mongoose.connect(
                dbConnection,
                {
                    useNewUrlParser: true,
                    useCreateIndex: true,
                    useUnifiedTopology: true,
                },
                (err) => (err ? reject(err) : resolve(`Successfully connected to MongoDB`)),
            );
        })
    }
}