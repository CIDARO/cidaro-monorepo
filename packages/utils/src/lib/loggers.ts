import * as bull from 'bull';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

interface QueueLogMessage {
    system: string; // name of the system that is sending the log
    message: any; // message object (can be an error too)
    level: string; // logging level (default is 'info')
}

interface WinstonLogMessage {
    level: string; // level of the message (optional sometimes)
    message: string; // message that will be logged
    callback: winston.LogCallback; // winston log callback
}

export class QueueLogger {
    $queue: bull.Queue;

    constructor(queueName: string, redisConnection: string) {
        this.$queue = new bull(queueName, redisConnection);
    }

    log({ system, message, level }: QueueLogMessage, opts?: bull.JobOptions) { 
        if (!level || !['debug', 'info', 'warn', 'error', 'fatal'].includes(level.toLowerCase())) {
            level = 'info';
        }
        this.$queue.add({system, message, level}, opts);
    }
}

/**
 * DefaultWinstonLogger that wraps up all the logging methods for the subclasses. 
 */
class DefaultWinstonLogger {
    // winston logger initialized in the subclasses constructor
    $logger: winston.Logger;

    constructor() {}

    /**
     * Logs the input message and lets the user choose the level. 
     * @param level logging level
     * @param message message that will be logged
     * @param callback winston log callback
     */
    log({ level, message, callback }: WinstonLogMessage) {
        this.$logger.log(level, message, callback);
    }

    /**
     * Logs the input message as debug.
     * @param message message that will be logged
     * @param callback winston log callback
     */
    debug({ message, callback }: WinstonLogMessage) {
        this.$logger.debug(message, callback);
    }

    /**
     * Logs the input message as info.
     * @param message message that will be logged
     * @param callback winston log callback
     */
    info({ message, callback }: WinstonLogMessage) {
        this.$logger.info(message, callback);
    }

    /**
     * Logs the input message as notice.
     * @param message message that will be logged
     * @param callback winston log callback
     */
    notice({ message, callback }: WinstonLogMessage) {
        this.$logger.notice(message, callback);
    }

    /**
     * Logs the input message as warning.
     * @param message message that will be logged
     * @param callback winston log callback
     */
    warning({ message, callback }: WinstonLogMessage) {
        this.$logger.warning(message, callback);
    }

    /**
     * Logs the input message as error.
     * @param message message that will be logged
     * @param callback winston log callback
     */
    error({ message, callback }: WinstonLogMessage) {
        this.$logger.error(message, callback);
    }

    /**
     * Logs the input message as crit.
     * @param message message that will be logged
     * @param callback winston log callback
     */
    crit({ message, callback }: WinstonLogMessage) {
        this.$logger.crit(message, callback);
    }

    /**
     * Logs the input message as alert.
     * @param message message that will be logged
     * @param callback winston log callback
     */
    alert({ message, callback }: WinstonLogMessage) {
        this.$logger.alert(message, callback);
    }

    /**
     * Logs the input message as emerg.
     * @param message message that will be logged
     * @param callback winston log callback
     */
    emerg({ message, callback }: WinstonLogMessage) {
        this.$logger.emerg(message, callback);
    }
}

export class CombinedLogger extends DefaultWinstonLogger {

    constructor(errorFilepath: string, combinedFilepath: string, production: boolean, level?: string) {
        super();

        this.$logger = winston.createLogger({
            level: level || 'info',
            format: winston.format.json(),
            transports: [
                new winston.transports.File({filename: errorFilepath, level: 'error'}),
                new winston.transports.File({filename: combinedFilepath, level: level || 'info'})
            ],
            exitOnError: false,
        });

        if (!production) {
            this.$logger.add(
                new winston.transports.Console({
                    format: winston.format.simple(),
                })
            );
        };
    }
}

export class RotatingLogger extends DefaultWinstonLogger {

    constructor(filenameBase: string, datePattern: string = 'YYYY-MM-DD-HH', dirname: string = '.', zippedArchive: boolean = true, maxSize: string = '20m', maxFiles: string = '14d') {
        super();

        const transport = new winston.transports.DailyRotateFile({
            filename: `${filenameBase}-%DATE%.log`,
            dirname,
            datePattern,
            zippedArchive,
            maxSize,
            maxFiles,
        });

        this.$logger = winston.createLogger({
            transports: [transport],
        });
    }
}