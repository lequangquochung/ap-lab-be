import { Logger, QueryRunner, AdvancedConsoleLogger, LoggerOptions } from "typeorm";
import log from '$helpers/log';

const logger = log('Query');

export class CustomLogger extends AdvancedConsoleLogger implements Logger {

    constructor(options?: LoggerOptions) {
        super(options);
    }

    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
        const requestUrl = queryRunner && queryRunner.data["request"] ? "(" + queryRunner.data["request"].url + ") " : "";
        if (query.includes('Booking') || query.includes('Plan') || query.includes('MedicalRecord'))
            logger.info(requestUrl + "query: " + query + "---- Parameters:" + parameters)
    }
}