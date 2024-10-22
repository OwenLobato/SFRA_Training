'use strict';

const Alerts = require('dw/alert/Alerts');
const Transaction = require('dw/system/Transaction');

/**
 * Enum representing alert types.
 * @enum {string}
 */
const ALERT_TYPES = {
    'SERVICE_INCIDENT' : 'podalerts_pod_service_incident',
    'SERVICE_INCIDENT_RESOLVED' : 'podalerts_pod_service_incident_solved',
    'PLANNED_MAINTENANCE' : 'podalerts_pod_maintenance',
    'GENERAL_MESSAGE' : 'podalerts_general_message'
};

/**
 * Creates an alert of the specified type with the provided parameters.
 *
 * @param {string} alertType - The type of the alert to create.
 * @param {array} params - The parameters for the alert.
 */
const createAlert = (alertType, params) => {
    Transaction.wrap(() => {
        Alerts.addAlert(alertType, params);
    });
};

/**
 * Removes the alert of the specified type.
 *
 * @param {string} alertType - The type of the alert to remove.
 */
const removeAlert = (alertType) => {
    Transaction.wrap(() => {
        Alerts.removeAlert(alertType);
    });
};

/**
 * Finds the first message, maintenance or incident in the `currentData` array that does not exist in the `pastData` array based on the ID.
 * @param {Array<Object>} pastData - The array of past data messages.
 * @param {Array<Object>} currentData - The array of current data messages.
 * @param {string} paramName - Param name to check if new info is available.
 * @returns {Object|null} The first object from `currentData` that is not present in `pastData` based on ID, or null if no new object is found.
 */
const getNewData = (pastData, currentData, paramName) => {
    if (pastData && currentData) {
        for (let i = 0; i < currentData.length; i++) {
            const currentObj = currentData[i];
            const found = pastData.some(pastObj => pastObj[paramName] === currentObj[paramName]);
            if (!found) {
                return currentObj;
            }
        }
    }

    return null;
};

/**
 * Finds the first incident object in the `pastData` array that does not exist in the `currentData` array based on the incidentId.
 * @param {Array<Object>} pastData - The array of past incident objects.
 * @param {Array<Object>} currentData - The array of current incident objects.
 * @returns {Object|null} The first incident object from `pastData` that is not present in `currentData` based on incidentId, or null if no solved incident object is found.
 */
const getSolvedIncident = (pastData, currentData) => {
    if (pastData && currentData) {
        for (let i = 0; i < pastData.length; i++) {
            const pastObj = pastData[i];
            const found = currentData.some(currentObj => currentObj.incidentId === pastObj.incidentId);
            if (!found) {
                return pastObj;
            }
        }
    }

    return null;
};

module.exports = {
    createAlert : createAlert,
    removeAlert : removeAlert,
    ALERT_TYPES : ALERT_TYPES,
    getNewData : getNewData,
    getSolvedIncident : getSolvedIncident
};
