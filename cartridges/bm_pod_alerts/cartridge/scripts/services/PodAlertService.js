'use strict';

const LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');
const PODServiceDefinitions = require('*/cartridge/scripts/services/PodAlertServiceDefinition');

const POD_SERVICE_ID = 'bm_pod_alerts.https.podstatus.get';
const SALESFORCE_B2C_COMMERCE_PRODUCT = 'B2C_Commerce_Cloud';

/**
 * Service definition to retrieve all B2C Commerce Instance status from the Salesforce Trust API.
 * @returns {dw.svc.Service} Service with desired data.
 */
const getB2CCommerceStatus = () => {
    const config = PODServiceDefinitions.B2CCommerceStatus;
    const B2CCommerceStatusService = LocalServiceRegistry.createService(POD_SERVICE_ID, config);
    return B2CCommerceStatusService.call({
        endpoint : '/instances/status/preview',
        params : {
            products : SALESFORCE_B2C_COMMERCE_PRODUCT,
            childProducts : true
        }
    });
};

/**
 * Service definition to retrieve all B2C Commerce Maintenances (next and past) from the Salesforce Trust API.
 * @returns {dw.svc.Service} Service with desired data.
 */
const getB2CCommerceMaintenances = () => {
    const config = PODServiceDefinitions.Maintenances;
    const MaintenancesService = LocalServiceRegistry.createService(POD_SERVICE_ID, config);
    return MaintenancesService.call({
        endpoint : '/maintenances',
        params : {
            limit : 500,
            offset : 0,
            product : SALESFORCE_B2C_COMMERCE_PRODUCT,
            sort : 'plannedStartTime',
            order: 'DESC'
        }
    });
};

/**
 * Service definition to retrieve  B2C Commerce Maintenance from the Salesforce Trust API.
 * @param {int} maintenanceID - Maintenance ID to retrieve.
 * @returns {dw.svc.Service} Service with desired data.
 */
const getB2CCommerceMaintenance = (maintenanceID) => {
    const config = PODServiceDefinitions.Maintenance;
    const MaintenancesService = LocalServiceRegistry.createService(POD_SERVICE_ID, config);
    return MaintenancesService.call({
        endpoint : '/maintenances/' + maintenanceID,
        params : {
            id : maintenanceID
        }
    });
};

/**
 * Service definition to retrieve Services Status for an specific POD from the Salesforce Trust API.
 * @param {string} currentPodID - POD ID to retrieve data from.
 * @returns {dw.svc.Service} Service with desired data.
 */
const getB2CCommercePodStatus = (currentPodID) => {
    const config = PODServiceDefinitions.PODStatus;
    const B2CCommercePodStatusService = LocalServiceRegistry.createService(POD_SERVICE_ID, config);

    const podAlertHelper = require('*/cartridge/scripts/helpers/podAlertHelper');

    return B2CCommercePodStatusService.call({
        endpoint : '/instances/' + currentPodID + '/status',
        params : {
            key : currentPodID,
            productKey : SALESFORCE_B2C_COMMERCE_PRODUCT,
            childProducts : true
        }
    });
};

/**
 * Service definition to retrieve General Messages from the Salesforce Trust API.
 * @returns {dw.svc.Service} Service with desired data.
 */
const getGeneralMessages = () => {
    const config = PODServiceDefinitions.GeneralMessages;
    const GeneralMessagesService = LocalServiceRegistry.createService(POD_SERVICE_ID, config);

    return GeneralMessagesService.call({
        endpoint : '/generalMessages'
    });
};

/**
 * Service definition to retrieve a General Message from the Salesforce Trust API.
 * @param {int} messageID - Message ID to retrieve.
 * @returns {dw.svc.Service} Service with desired data.
 */
const getGeneralMessage = (messageID) => {
    const config = PODServiceDefinitions.GeneralMessage;
    const GeneralMessagesService = LocalServiceRegistry.createService(POD_SERVICE_ID, config);

    return GeneralMessagesService.call({
        endpoint : '/generalMessages/' + messageID,
        params : {
            id : messageID
        }
    });
};

module.exports = {
    getB2CCommerceStatus : getB2CCommerceStatus,
    getB2CCommerceMaintenances : getB2CCommerceMaintenances,
    getB2CCommercePodStatus : getB2CCommercePodStatus,
    getGeneralMessages : getGeneralMessages,
    getB2CCommerceMaintenance : getB2CCommerceMaintenance,
    getGeneralMessage : getGeneralMessage
};
