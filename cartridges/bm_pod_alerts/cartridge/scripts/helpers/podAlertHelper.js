'use strict';

const Transaction = require('dw/system/Transaction');

/**
 * Map API Status with cartridge status icon's name.
 */
const INSTANCE_STATUS = {
    OK : 'available',
    MAJOR_INCIDENT_CORE : 'disruption',
    MINOR_INCIDENT_CORE : 'degradation',
    MAINTENANCE_CORE : 'maintenance',
    MAJOR_INCIDENT_NONCORE : 'degradation',
    MINOR_INCIDENT_NONCORE : 'minor-degradation',
    MAINTENANCE_NONCORE : 'maintenance'
};

const MINUTES_15 = 15 * 60 * 1000;
const HOUR = 1 * 60 * 60 * 1000;

/**
 * Transforms the maintenance object into a HashMap.
 * @param {Object} maintenance - The maintenance object to transform.
 * @returns {dw.util.HashMap} - The transformed maintenance as a HashMap.
 */
const transformMaintenanceAsMap = (maintenance) => {
    const HashMap = require('dw/util/HashMap');
    const result = new HashMap();

    result.ID = maintenance.ID;
    result.plannedStartTime = maintenance.plannedStartTime;
    result.plannedEndTime = maintenance.plannedEndTime;
    result.date = maintenance.date;
    result.startTime = maintenance.startTime;
    result.status = maintenance.status;
    result.type = maintenance.type;
    result.subject = maintenance.subject;
    result.additionalInformation = maintenance.additionalInformation;
    result.services = maintenance.services;
    result.pods = maintenance.pods;
    result.availability = maintenance.availability;
    result.endTime = maintenance.endTime;
    result.endDate = maintenance.endDate;
    return result;
};

/**
 * Transforms the general message object into a HashMap.
 * @param {Object} message - The general message object to transform.
 * @returns {dw.util.HashMap} - The transformed general message as a HashMap.
 */
const transformMessageAsMap = (message) => {
    const HashMap = require('dw/util/HashMap');
    const result = new HashMap();

    result.ID = message.ID;
    result.subject = message.subject;
    result.date = message.date;
    result.hour = message.hour;
    result.updatedDate = message.updatedDate;
    result.updatedHour = message.updatedHour;
    result.body = message.body;
    result.status = message.status;

    return result;
};

/**
 * Transforms POD instance object into a HashMap.
 * @param {Object} podData - The POD object to transform.
 * @returns {dw.util.HashMap} - The transformed pod instance as a HashMap.
 */
const transformPodDataAsMap = (podData) => {
    const HashMap = require('dw/util/HashMap');
    const result = new HashMap();

    result.ID = podData.ID;
    result.services = podData.services;
    result.affectedServices = podData.affectedServices;
    result.status = podData.status;
    result.instanceStatuses = INSTANCE_STATUS

    return result;
};

/**
 * Transform date into an instance timezone date.
 * @param {Date} date - GMT date
 * @returns {Date} Date in same timezone as the configured in current instance.
 */
const formatDate = (date) => {
    const Calendar = require('dw/util/Calendar');
    const System = require('dw/system/System');
    const currentTimeZone = System.instanceTimeZone;

    const timeZoneDate = new Calendar(date);
    timeZoneDate.setTimeZone(currentTimeZone);

    return timeZoneDate;
};

/**
 * Retrieves a Custom Global Preference
 * @param {string} preference - Preference id to retrieve
 * @returns {object} preference value.
 */
const getPreference = (preference) => {
    const System = require('dw/system/System');
    return System.getPreferences().getCustom()[preference];
};

/**
 * Calls a service using Service Framework and if everything worked well, callback function is executed
 * with service response as a parameter.
 *
 * @param {string} method - Service exported method to execute.
 * @param {function} callback - Callback function to execute after service call.
 * @returns {Object} Object with formated data from Trust Status API.
 */
const getServiceResponse = (method, params) => {
    const Status = require('dw/system/Status');
    const PodAlertService = require('*/cartridge/scripts/services/PodAlertService');
    const success = new Status(Status.OK);

    const serviceResponse = !empty(params.id) ? PodAlertService[method](params.id) : PodAlertService[method]();
    if(serviceResponse.msg == success.message) {
        const callbackResult = params.callback(serviceResponse.object);
        return {
            data : serviceResponse.object,
            date : formatDate(new Date()),
            callbackResult : callbackResult
        }
    }

    return {
        success : false
    };
}

/**
 * Retrieve the status information of B2C Commerce instances from a custom object 'B2CCommerceStatus'
 * if the information was saved less than 15 minutes ago, and if not, make a request to the API,
 * updating the custom object immediately afterwards
 * @returns {object} with the desired data and success property
 */
const retrieveB2CCommerceStatusData = () => {
    const CustomObjectMgr = require('dw/object/CustomObjectMgr');
    const CUSTOM_OBJECT_DATA = require('*/cartridge/config/customObjects.json');

    let statusObj = CustomObjectMgr.getCustomObject(CUSTOM_OBJECT_DATA.status.object_type, CUSTOM_OBJECT_DATA.status.key);
    if(!empty(statusObj) && ((statusObj.creationDate).getTime() + MINUTES_15 - (new Date()).getTime() > 0)) {
        return {
            data : JSON.parse(statusObj.custom.data),
            date : formatDate(statusObj.creationDate)
        };
    } else {
        return getServiceResponse('getB2CCommerceStatus', {
            callback : (response) => {
                if(!empty(response.success)) {
                    Transaction.wrap(() => {
                        if(!empty(statusObj)) {
                            CustomObjectMgr.remove(statusObj);
                        }

                        statusObj = CustomObjectMgr.createCustomObject(CUSTOM_OBJECT_DATA.status.object_type, CUSTOM_OBJECT_DATA.status.key);
                        statusObj.custom.data = JSON.stringify(response);
                    });
                }
            }
        });
    }
};

/**
 * Retrieve the status information of B2C Commerce maintenances from a custom object 'B2CCommerceMaintenances'
 * if the information was saved less than an hour ago, and if not, make a request to the API, updating the
 * custom object immediately afterwards.
 * @returns {object} with the desired data and success property
 */
const retrieveB2CCommerceMaintenancesData = () => {
    const CustomObjectMgr = require('dw/object/CustomObjectMgr');
    const CUSTOM_OBJECT_DATA = require('*/cartridge/config/customObjects.json');

    let maintenanceObj = CustomObjectMgr.getCustomObject(CUSTOM_OBJECT_DATA.maintenances.object_type, CUSTOM_OBJECT_DATA.maintenances.key);
    if(!empty(maintenanceObj) && (maintenanceObj.creationDate.getTime() + HOUR - (new Date()).getTime()) > 0) {
        return {
            data : JSON.parse(maintenanceObj.custom.data),
            date : formatDate(maintenanceObj.creationDate)
        };
    } else {
        return getServiceResponse('getB2CCommerceMaintenances', {
            callback : (response) => {
                if(!empty(response.success)) {
                    Transaction.wrap(() => {
                        if(!empty(maintenanceObj)) {
                            CustomObjectMgr.remove(maintenanceObj);
                        }

                        maintenanceObj = CustomObjectMgr.createCustomObject(CUSTOM_OBJECT_DATA.maintenances.object_type, CUSTOM_OBJECT_DATA.maintenances.key);
                        maintenanceObj.custom.data = JSON.stringify(response);
                    });
                }
            }
        });
    }
};

/**
 * Retrieve the status information of B2C Commerce POD from a custom object 'PodStatus'
 * if the information was saved less than 15 minutes ago, and if not, make a request
 * to the API, updating the custom object immediately afterwards.
 * @param {string} currentPodID - POD Id to retrive data
 * @returns {object} with the desired data and success property
 */
const retrieveB2CCommercePodData = (currentPodID) => {
    const CustomObjectMgr = require('dw/object/CustomObjectMgr');
    const CUSTOM_OBJECT_DATA = require('*/cartridge/config/customObjects.json');

    let podObj = CustomObjectMgr.getCustomObject(CUSTOM_OBJECT_DATA.pod.object_type, currentPodID);

    if(!empty(podObj) && (podObj.creationDate.getTime() + MINUTES_15 - (new Date()).getTime()) > 0) {
        return {
            data : JSON.parse(podObj.custom.data),
            date : formatDate(podObj.creationDate)
        };
    } else {
        return getServiceResponse('getB2CCommercePodStatus', {
            callback : (response) => {
                if(!empty(response.success)) {
                    Transaction.wrap(() => {
                        if(!empty(podObj)) {
                            CustomObjectMgr.remove(podObj);
                        }

                        podObj = CustomObjectMgr.createCustomObject(CUSTOM_OBJECT_DATA.pod.object_type, currentPodID);
                        podObj.custom.data = JSON.stringify(response);
                    });
                }
            },
            id : currentPodID
        });
    }
};

/**
 * Retrieve general messages of Salesforce from a custom object 'B2CCommerceMaintenances' if the
 * information was saved less an hour ago, and if not, make a request to the API, updating the
 * custom object immediately afterwards
 * @returns {object} with the desired data and success property.
 */
const retrieveGeneralMessagesData = () => {
    const CustomObjectMgr = require('dw/object/CustomObjectMgr');
    const CUSTOM_OBJECT_DATA = require('*/cartridge/config/customObjects.json');

    let messagesObj = CustomObjectMgr.getCustomObject(CUSTOM_OBJECT_DATA.messages.object_type, CUSTOM_OBJECT_DATA.messages.key);
    if(!empty(messagesObj) && (messagesObj.creationDate.getTime() + HOUR - (new Date()).getTime()) > 0) {
        return {
            data : JSON.parse(messagesObj.custom.data),
            date : formatDate(messagesObj.creationDate)
        };
    } else {
        return getServiceResponse('getGeneralMessages', {
            callback : (response) => {
                if(!empty(response.success)) {
                    Transaction.wrap(() => {
                        if(!empty(messagesObj)) {
                            CustomObjectMgr.remove(messagesObj);
                        }

                        messagesObj = CustomObjectMgr.createCustomObject(CUSTOM_OBJECT_DATA.messages.object_type, CUSTOM_OBJECT_DATA.messages.key);
                        messagesObj.custom.data = JSON.stringify(response);
                    });
                }
            }
        });
    }
};

/**
 * Retrieve maintenance data of Salesforce from a custom object 'B2CCommerceMaintenances' if the
 * information was saved less an hour ago, and if not, make a request to the API, updating the
 * custom object immediately afterwards
 * @returns {object} with the desired data and success property.
 */
const retrieveMaintenanceData = (maintenanceID) => {
    const CustomObjectMgr = require('dw/object/CustomObjectMgr');
    const CUSTOM_OBJECT_DATA = require('*/cartridge/config/customObjects.json');
    const serviceHelper = require('*/cartridge/scripts/helpers/serviceHelper');

    let maintenanceData = serviceHelper.getMaintenanceData(maintenanceID);
    if(!empty(maintenanceData)) {
        return maintenanceData;
    }

    let maintenanceObj = CustomObjectMgr.getCustomObject(CUSTOM_OBJECT_DATA.maintenances.object_type, maintenanceID);
    if(!empty(maintenanceObj) && (maintenanceObj.creationDate.getTime() + HOUR - (new Date()).getTime()) > 0) {
        maintenanceData = JSON.parse(maintenanceObj.custom.data);
        return maintenanceData.maintenance;
    } else {
        maintenanceData = getServiceResponse('getB2CCommerceMaintenance', {
            callback : (response) => {
                if(!empty(response.success)) {
                    Transaction.wrap(() => {
                        if(!empty(maintenanceObj)) {
                            CustomObjectMgr.remove(maintenanceObj);
                        }

                        maintenanceObj = CustomObjectMgr.createCustomObject(CUSTOM_OBJECT_DATA.maintenances.object_type, maintenanceID);
                        maintenanceObj.custom.data = JSON.stringify(response);
                    });
                }
            },
            id : maintenanceID
        });

        return maintenanceData.data.maintenance;
    }
};

/**
 * Retrieve maintenance data of Salesforce from a custom object 'B2CCommerceMaintenances' if the
 * information was saved less an hour ago, and if not, make a request to the API, updating the
 * custom object immediately afterwards
 * @returns {object} with the desired data and success property.
 */
const retrieveMessageData = (messageID) => {
    const CustomObjectMgr = require('dw/object/CustomObjectMgr');
    const CUSTOM_OBJECT_DATA = require('*/cartridge/config/customObjects.json');
    const serviceHelper = require('*/cartridge/scripts/helpers/serviceHelper');

    let messageData = serviceHelper.getMessageData(messageID);
    if(!empty(messageData)) {
        return messageData;
    }

    let messageObj = CustomObjectMgr.getCustomObject(CUSTOM_OBJECT_DATA.messages.object_type, messageID);
    if(!empty(messageObj) && (messageObj.creationDate.getTime() + HOUR - (new Date()).getTime()) > 0) {
        messageData = JSON.parse(messageObj.custom.data);
        return messageData.message;
    } else {
        messageData = getServiceResponse('getGeneralMessage', {
            callback : (response) => {
                if(!empty(response.success)) {
                    Transaction.wrap(() => {
                        if(!empty(messageObj)) {
                            CustomObjectMgr.remove(messageObj);
                        }

                        messageObj = CustomObjectMgr.createCustomObject(CUSTOM_OBJECT_DATA.messages.object_type, messageID);
                        messageObj.custom.data = JSON.stringify(response);
                    });
                }
            },
            id : messageID
        });

        return messageData.data.message;
    }
};

/**
 * Removes custom object for the main sections to force data to be updated.
 * @param {string} sectionToRefresh - Section user want to refresh
 */
const removeCustomObject = (sectionToRefresh) => {
    const CUSTOM_OBJECT_DATA = require('*/cartridge/config/customObjects.json');
    const Transaction = require('dw/system/Transaction');
    const CustomObjectMgr = require('dw/object/CustomObjectMgr');

    Transaction.wrap(() => {
        let key = CUSTOM_OBJECT_DATA[sectionToRefresh].key;
        if(sectionToRefresh == 'pod') {
            key = getPreference('podalerts_podNumber');
        }

        const customObject = CustomObjectMgr.getCustomObject(CUSTOM_OBJECT_DATA[sectionToRefresh].object_type, key);
        if(!empty(customObject)) {
            CustomObjectMgr.remove(customObject);
        }
    });
};

module.exports = {
    getPreference : getPreference,
    retrieveB2CCommerceStatusData : retrieveB2CCommerceStatusData,
    retrieveB2CCommerceMaintenancesData : retrieveB2CCommerceMaintenancesData,
    retrieveB2CCommercePodData : retrieveB2CCommercePodData,
    retrieveGeneralMessagesData : retrieveGeneralMessagesData,
    INSTANCE_STATUS : INSTANCE_STATUS,
    formatDate : formatDate,
    retrieveMaintenanceData : retrieveMaintenanceData,
    transformMaintenanceAsMap : transformMaintenanceAsMap,
    retrieveMessageData : retrieveMessageData,
    transformMessageAsMap : transformMessageAsMap,
    transformPodDataAsMap : transformPodDataAsMap,
    removeCustomObject : removeCustomObject,
    getServiceResponse : getServiceResponse
};
