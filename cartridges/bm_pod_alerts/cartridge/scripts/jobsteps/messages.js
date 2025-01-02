'use strict';

/**
 * Current JOB exist status defined in steptypes.json file.
 */
const JOB_EXIST_STATUS = {
    ERROR : 'ERROR',
    ALERT : 'ALERT',
    FINISHED : 'FINISHED'
};

/**
 * Main entry for the POD Status Checker Job.
 * It will create Business Manager alerts and send notifications by e-mail if configured.
 */
const execute = () => {
    const Status = require('dw/system/Status');

    const fileHelper = require('*/cartridge/scripts/helpers/fileHelper');
    const podAlertHelper = require('*/cartridge/scripts/helpers/podAlertHelper');
    const alertsHelper = require('*/cartridge/scripts/helpers/alertsHelper');
    const emailHelper = require('*/cartridge/scripts/helpers/emailHelper');

    const pastData = fileHelper.getPastInformation(fileHelper.POD_STATUS_FILES.GENERAL_MESSAGES);

    const result = podAlertHelper.getServiceResponse('getGeneralMessages', {
        callback : (serviceResponse) => {
            if (!empty(serviceResponse.success)) {
                const currentData = serviceResponse.messages;
                fileHelper.setCurrentInformation(fileHelper.POD_STATUS_FILES.GENERAL_MESSAGES, currentData);

                const alertsEnabled = podAlertHelper.getPreference('podalerts_bmAlertsGeneralMessages');
                if(!alertsEnabled) {
                    return new Status(Status.OK, JOB_EXIST_STATUS.FINISHED);
                }

                // If there is a new message between current and last job execution an alert will be created.
                const newMessage = alertsHelper.getNewData(pastData, currentData, 'ID');
                if(!empty(newMessage)) {
                    alertsHelper.createAlert(alertsHelper.ALERT_TYPES.GENERAL_MESSAGE, [newMessage.subject]);
                    emailHelper.sendGeneralMessageEmail(newMessage);
                    return new Status(Status.OK, JOB_EXIST_STATUS.ALERT);
                }

                return new Status(Status.OK, JOB_EXIST_STATUS.FINISHED);
            }

            // TODO Log error
            return new Status(Status.ERROR, JOB_EXIST_STATUS.ERROR);
        }
    });

    return !empty(result.callbackResult) ? result.callbackResult : new Status(Status.ERROR, JOB_EXIST_STATUS.ERROR);
};

module.exports = {
    execute : execute
};
