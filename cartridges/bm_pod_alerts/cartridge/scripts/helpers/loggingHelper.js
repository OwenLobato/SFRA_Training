'use strict';

/**
 * Logs various messages for testing purposes using the Demandware (Salesforce Commerce Cloud)
 * Logger framework.
 *
 * This function retrieves various loggers and logs messages with different log levels
 * to test the logging configuration.
 *
 * @function
 */
const logMessagesForTestingPurposes = () => {
    const Logger = require('dw/system/Logger');

    const PODALERTS_LOG = Logger.getLogger('podalerts');
    const PRUEBA_LOG = Logger.getLogger('prueba');

    const ROOT_LOG = Logger.getRootLogger();

    const CONTROLLERS_PODALERTS_LOG = Logger.getLogger('controllers', 'podalerts');
    const JOBS_PODALERTS_LOG = Logger.getLogger('jobs', 'podalerts');

    CONTROLLERS_PODALERTS_LOG.warn('Controller podalerts log message');
    JOBS_PODALERTS_LOG.warn('Jobs podalerts log message');

    PODALERTS_LOG.debug('Esto es un mensaje de debug');
    PODALERTS_LOG.info('Esto es un mensaje de info');
    PODALERTS_LOG.warn('Esto es un mensaje de Warning');
    PODALERTS_LOG.error('Esto es un mensaje de Error');

    ROOT_LOG.warn('ESTO ES UN WARNING EN LA CATEGORIA ROOT');

    PRUEBA_LOG.debug('debug prueba');
    PRUEBA_LOG.info('info prueba');
    PRUEBA_LOG.warn('warn prueba');
    PRUEBA_LOG.error('error prueba');
};

module.exports = {
    logMessagesForTestingPurposes : logMessagesForTestingPurposes
};