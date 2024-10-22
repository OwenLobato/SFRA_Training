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
 * Retrieves the current data from a service response.
 *
 * @param {object} serviceResponse - The service response object.
 * @returns {object} The current data object containing affected services and maintenances.
 */
const getCurrentData = (serviceResponse) => {
    let data = {
        affectedServices : [],
        maintenances : []
    };

    if(Object.prototype.hasOwnProperty.call(serviceResponse.instance, 'affectedServices')) {
        if(!empty(serviceResponse.instance.affectedServices)) {
            Object.entries(serviceResponse.instance.affectedServices).forEach(([serviceName, serviceData]) => {
                data.affectedServices.push({
                    serviceName : serviceName,
                    incidentId : serviceData[0].id,
                    startTime : serviceData[0].startTime,
                    incidentSubject : serviceData[0].message
                });
            });
        }
    }

    if(Object.prototype.hasOwnProperty.call(serviceResponse.instance, 'maintenances')) {
        if(!empty(serviceResponse.instance.maintenances)) {
            serviceResponse.instance.maintenances.forEach((maintenance) => {
                data.maintenances.push({
                    maintenanceID : maintenance.ID,
                    subject : maintenance.subject,
                    date : maintenance.date + ' ' + maintenance.startTime,
                    services : !empty(maintenance.services) ? maintenance.services.join(', ') : '',
                    availability : maintenance.availability,
                    additionalInformation : maintenance.additionalInformation
                });
            });
        }
    }

    return data;
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

    const pastData = fileHelper.getPastInformation(fileHelper.POD_STATUS_FILES.POD_STATUS);
    const currentPodID = podAlertHelper.getPreference('podalerts_podNumber');

    const result = podAlertHelper.getServiceResponse('getB2CCommercePodStatus', {
        callback : (serviceResponse) => {
            if (!empty(serviceResponse.success)) {
                const currentData = getCurrentData(serviceResponse);
                fileHelper.setCurrentInformation(fileHelper.POD_STATUS_FILES.POD_STATUS, currentData);

                const alertsEnabled = podAlertHelper.getPreference('podalerts_bmAlerts');
                if(!alertsEnabled) {
                    return new Status(Status.OK, JOB_EXIST_STATUS.FINISHED);
                }

                // If there is a new maintenance for our POD between current and last job execution an alert will be created.
                const newMaintenance = alertsHelper.getNewData(pastData.maintenances, currentData.maintenances, 'maintenanceID');
                if(!empty(newMaintenance)) {
                    alertsHelper.createAlert(alertsHelper.ALERT_TYPES.PLANNED_MAINTENANCE, [newMaintenance.subject, newMaintenance.date]);
                    return new Status(Status.OK, JOB_EXIST_STATUS.ALERT);
                }

                // If there is a new incident for our POD between current and last job execution an alert will be created.
                const newIncident = alertsHelper.getNewData(pastData.affectedServices, currentData.affectedServices, 'incidentId');
                if(!empty(newIncident)) {
                    alertsHelper.createAlert(alertsHelper.ALERT_TYPES.SERVICE_INCIDENT, [newIncident.incidentSubject, newIncident.serviceName, currentPodID]);
                    return new Status(Status.OK, JOB_EXIST_STATUS.ALERT);
                }

                // If there is any solved incident for our POD between current and last job execution an alert will be created.
                const solvedIncident = alertsHelper.getSolvedIncident(pastData.affectedServices, currentData.affectedServices);
                if(!empty(solvedIncident)) {
                    alertsHelper.removeAlert(alertsHelper.ALERT_TYPES.SERVICE_INCIDENT);
                    alertsHelper.createAlert(alertsHelper.ALERT_TYPES.SERVICE_INCIDENT_RESOLVED, [solvedIncident.incidentSubject, solvedIncident.serviceName, currentPodID]);
                    return new Status(Status.OK, JOB_EXIST_STATUS.ALERT);
                }

                return new Status(Status.OK, JOB_EXIST_STATUS.FINISHED);
            }

            // TODO Log error
            return new Status(Status.ERROR, JOB_EXIST_STATUS.ERROR);
        },
        id : currentPodID
    });

    return !empty(result.callbackResult) ? result.callbackResult : new Status(Status.ERROR, JOB_EXIST_STATUS.ERROR);
};

module.exports = {
    execute : execute
};
