'use strict';

const POD_PREFIX = 'POD';

/**
 * Retrieves POD PreviewData from our POD received as parameter from the
 * B2CCommerceStatus CustomObject if present and if not is requested again to Trust Status Service.
 *
 * @param {string} currentPodID - POD to get data.
 * @returns {Object|null} POD Data or null if error.
 */
const getPODPreviewData = (currentPodID) => {
    const podAlertHelper = require('*/cartridge/scripts/helpers/podAlertHelper');

    const commerceStatusData = podAlertHelper.retrieveB2CCommerceStatusData();
    if(!empty(commerceStatusData.data.success)) {
        const instances = commerceStatusData.data.instances.filter(instance => instance.ID == currentPodID);
        if(!empty(instances)) {
            return instances[0];
        }
    }

    return null;
};

/**
 * Retrieves the maintenance data based on the maintenance ID.
 * @param {string} maintenanceID - The ID of the maintenance to retrieve.
 * @returns {Object|null} - The maintenance data object if found, or null if not found.
 */
const getMaintenanceData = (maintenanceID) => {
    const CustomObjectMgr = require('dw/object/CustomObjectMgr');
    const CUSTOM_OBJECT_DATA = require('*/cartridge/config/customObjects.json');
    const HOUR = 1 * 60 * 60 * 1000;
    let maintenance = null;

    let maintenanceObj = CustomObjectMgr.getCustomObject(CUSTOM_OBJECT_DATA.maintenances.object_type, CUSTOM_OBJECT_DATA.maintenances.key);
    if(!empty(maintenanceObj) && (maintenanceObj.creationDate.getTime() + HOUR - (new Date()).getTime()) > 0) {

        const maintenanceData = JSON.parse(maintenanceObj.custom.data);
        if(!empty(maintenanceData.success)) {
            let maintenances = maintenanceData.next.filter(maintenance => maintenance.ID == maintenanceID);
            if(!empty(maintenances)) {
                maintenance = maintenances[0];
            } else {
                maintenances = maintenanceData.past.filter(maintenance => maintenance.ID == maintenanceID);
                if(!empty(maintenances)) {
                    maintenance = maintenances[0];
                }
            }
        }
    }

    return maintenance;
};

/**
 * Retrieves the general message data based on the message ID.
 * @param {string} messageID - The ID of the general message to retrieve.
 * @returns {Object|null} - The general message data object if found, or null if not found.
 */
const getMessageData = (messageID) => {
    const CustomObjectMgr = require('dw/object/CustomObjectMgr');
    const CUSTOM_OBJECT_DATA = require('*/cartridge/config/customObjects.json');
    const HOUR = 1 * 60 * 60 * 1000;
    let message = null;

    let messageObj = CustomObjectMgr.getCustomObject(CUSTOM_OBJECT_DATA.messages.object_type, CUSTOM_OBJECT_DATA.messages.key);
    if(!empty(messageObj) && (messageObj.creationDate.getTime() + HOUR - (new Date()).getTime()) > 0) {

        const messageData = JSON.parse(messageObj.custom.data);
        if(!empty(messageData.success)) {
            let messages = messageData.messages.filter(generalMessage => generalMessage.ID == messageID);
            if(!empty(messages)) {
                message = messages[0];
            }
        }
    }

    return message;
};

/**
 * Puts the object with our POD Id at the first position in the array.
 * @param {Array} data - The array of objects to modify.
 * @param {string} podAttribute - The attribute of the object to search for.
 * @returns {Array} The modified array of objects.
 */
const placeMyPODFirstPosition = (data, podAttribute) => {
    const podAlertHelper = require('*/cartridge/scripts/helpers/podAlertHelper');
    const currentPodID = podAlertHelper.getPreference('podalerts_podNumber');

    const myPodIndex = data.findIndex(element => {
        if(!Array.isArray(element[podAttribute])) {
            return element[podAttribute] === currentPodID
        } else {
            return element[podAttribute][0] === currentPodID
        }
    });

    if (myPodIndex !== -1) {
        const myPod = data.splice(myPodIndex, 1)[0];
        data.unshift(myPod);
    }
};

/**
 * Clean ups the instances array provided by the Trust API.
 *  - Removing instances !active.
 *  - Sorting instances by POD
 *  - Placing our POD the first in the instances array.
 * @param {array} instances - Array of instances from Trust Status API.
 * @returns {array} Instances as we expect.
 */
const cleanUpInstancesStatus = (instances) => {
    let instances = instances.filter(instance => instance.isActive);
    instances.sort((a, b) => {
        if(a.status < b.status) return -1;
        if(a.status > b.status) return 1;

        const podA = parseInt(a.key.replace(POD_PREFIX, ''), 10);
        const podB = parseInt(b.key.replace(POD_PREFIX, ''), 10);
        return podA - podB;
    });

    placeMyPODFirstPosition(instances, 'key');

    const instanceModel = require('*/cartridge/models/instance');
    const podInstances = [];
    instances.forEach((instance) => {
        podInstances.push(instanceModel.newInstance(instance));
    });

    return podInstances;
};

/**
 * Clean ups the maintenances array provided by the Trust API.
 *  - Creating two groups, past a next maitenances
 *  - Sorting maintenances by date
 *  - Placing maintenances for our POD the first in the list.
 * @param {array} maintenances - Array of maintenances from Trust Status API.
 * @returns {array} Maintenances as we expect.
 */
const cleanUpMaintenances = (maintenances) => {
    const maintenanceModel = require('*/cartridge/models/maintenance');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let pastMaintenances = [];
    let nextMaintenances = [];

    maintenances.forEach((maintenance) => {
        const obj = new maintenanceModel(maintenance);
        const plannedStartTime = new Date(maintenance.plannedStartTime);
        plannedStartTime.setHours(0, 0, 0, 0);

        if(new Date(maintenance.plannedStartTime).getTime() < today.getTime()) {
            pastMaintenances.push(obj);
        } else {
            nextMaintenances.push(obj);
        }
    });

    nextMaintenances.sort((a, b) => a.plannedStartTime - b.plannedStartTime);

    placeMyPODFirstPosition(pastMaintenances, 'pods');
    placeMyPODFirstPosition(nextMaintenances, 'pods');

    return {
        past : pastMaintenances,
        next : nextMaintenances
    };
};

/**
 * Clean ups the general messages array provided by the Trust API.
 *  - Sorting general messages by date
 * @param {array} messages - Array of messages from Trust Status API.
 * @returns {array} messages as we expect.
 */
const cleanUpMessages = (messages) => {
    const messageModel = require('*/cartridge/models/message');
    messages.sort((a, b) => {
        return (new Date(b.startDate)).getTime() - (new Date(a.startDate)).getTime();
    });

    let generalMessages = [];
    messages.forEach((message) => {
        generalMessages.push(new messageModel(message));
    });

    return generalMessages;
};

module.exports = {
    cleanUpInstancesStatus : cleanUpInstancesStatus,
    cleanUpMaintenances : cleanUpMaintenances,
    cleanUpMessages : cleanUpMessages,
    getPODPreviewData : getPODPreviewData,
    getMaintenanceData : getMaintenanceData,
    getMessageData : getMessageData
};
