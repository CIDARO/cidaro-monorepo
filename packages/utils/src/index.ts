import * as ethUtil from 'ethjs-util'
import * as lib from './lib';

export namespace CidaroUtils {
    /**
     * Converts the input value into a Buffer.
     * @param value value to convert to a Buffer
     */
    export function toBuffer(value: any): Buffer {
        if (Buffer.isBuffer(value)) return value;
        if (Array.isArray(value) || value instanceof Uint8Array) return Buffer.from(value);
        if (typeof value === 'string') {
            if (ethUtil.isHexString(value)) return Buffer.from(ethUtil.padToEven(ethUtil.stripHexPrefix(value)), 'hex');
        } else if (typeof value === 'number') {
            return ethUtil.intToBuffer(value);
        } else if (value === null || value === undefined) {
            return Buffer.allocUnsafe(0);
        } else if (value.toArray) {
            return Buffer.from(value.toArray());
        }
        throw new Error('invalid type for buffer conversion')
    }

    /**
     * Creates a new QueueLogger used to log messages on a Redis Queue using Bull.
     * @param queueName queue name where to send the logs
     * @param redisConnection redis connection string
     */
    export function newQueueLogger(queueName: string, redisConnection: string): lib.QueueLogger {
        return new lib.QueueLogger(queueName, redisConnection);
    }

    /**
     * Creates a new CombinedLogger that logs messages on an error file and a combined file.
     * @param errorFilepath filepath where to save the error logs
     * @param combinedFilepath filepath where to save the combined logs (from 'level' param and below)
     * @param production whether the logging is in production mode or not
     * @param level level used for the combined log
     */
    export function newCombinedLogger(errorFilepath: string, combinedFilepath: string, production?: boolean, level?: string): lib.CombinedLogger {
        return new lib.CombinedLogger(errorFilepath, combinedFilepath, production || false, level);
    }

    /**
     * Creates a new RotatingLogger that logs messages while rotating files using the input parameters.
     * @param filenameBase this string will be prepended in the following way ${filenameBase}-%DATE%.log so choose wisely
     * @param datePattern pattern for the dates (default: 'YYYY-MM-DD-HH')
     * @param dirname directory name where to save the log files to (default '.')
     * @param zippedArchive whether or not to gzip archived log files (default 'true')
     * @param maxSize maximum size of the file after which it will rotate (default '20m')
     * @param maxFiles maximum number of logs to keep (default '14d')
     */
    export function newRotatingLogger(filenameBase: string, datePattern?: string, dirname?: string, zippedArchive?: boolean, maxSize?: string, maxFiles?: string): lib.RotatingLogger {
        return new lib.RotatingLogger(filenameBase, datePattern, dirname, zippedArchive, maxSize, maxFiles);
    }
}