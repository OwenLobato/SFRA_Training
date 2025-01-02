'use strict';

const server = require('server');
const URLUtils = require('dw/web/URLUtils');
const environment = require('*/cartridge/scripts/middleware/environment');
const podAlertHelper = require('*/cartridge/scripts/helpers/podAlertHelper');
const loggingHelper = require('*/cartridge/scripts/helpers/loggingHelper');

/**
 * PODAlerts-Status: From this page you can see the status of all B2C Commerce instances.
 * @param {renders} - isml
 * @param {serverfunction} - get
 */
server.get('Status', (req, res, next) => {
    const statusData = podAlertHelper.retrieveB2CCommerceStatusData();

    // TODO Remove this line, it's just for testing purposes.
    loggingHelper.logMessagesForTestingPurposes();

    res.render('alerts/status', {
        commerceStatus : statusData.data,
        services : ['available', 'degradation', 'disruption', 'maintenance'],
        icons : podAlertHelper.INSTANCE_STATUS,
        update : {
            url : URLUtils.https('PODAlerts-Refresh', 'section', 'status').toString(),
            refreshurl : URLUtils.https('PODAlerts-Status', 'SelectedMenuItem', 'pod_alerts', 'CurrentMenuItemId', 'pod_alerts', 'menuname', 'Status').toString(),
            date : statusData.date
        }
    });

    next();
});

/**
 * PODAlerts-Maintenances: From this page you can find information about instances that underwent maintenance in
 * the past 33 days or have maintenance scheduled in the next 12 months.
 * @param {renders} - isml
 * @param {serverfunction} - get
 */
server.get('Maintenances', (req, res, next) => {
    const maintenanceData = podAlertHelper.retrieveB2CCommerceMaintenancesData();

    res.render('alerts/maintenances', {
        maintenances : maintenanceData.data,
        update : {
            url : URLUtils.https('PODAlerts-Refresh', 'section', 'maintenances').toString(),
            refreshurl : URLUtils.https('PODAlerts-Maintenances', 'SelectedMenuItem', 'pod_alerts', 'CurrentMenuItemId', 'pod_alerts', 'menuname', 'Maintenances').toString(),
            date : maintenanceData.date
        }
    });
    next();
});

/**
 * PODAlerts-Maintenances: From this page you can find information about instances that underwent maintenance in
 * the past 33 days or have maintenance scheduled in the next 12 months.
 * @param {renders} - isml
 * @param {serverfunction} - get
*/
server.get('MyPOD', (req, res, next) => {
    const currentPodID = podAlertHelper.getPreference('podalerts_podNumber');
    const podData = podAlertHelper.retrieveB2CCommercePodData(currentPodID);

    res.render('alerts/mypod', {
        pod : podData.data,
        status : podAlertHelper.INSTANCE_STATUS,
        update : {
            url : URLUtils.https('PODAlerts-Refresh', 'section', 'pod').toString(),
            refreshurl : URLUtils.https('PODAlerts-MyPOD', 'SelectedMenuItem', 'pod_alerts', 'CurrentMenuItemId', 'pod_alerts', 'menuname', 'My POD Status').toString(),
            date : podData.date
        }
    });
    next();
});

/**
 * PODAlerts-Messages: General Messages are general announcements that communicate important information to
 * customers about a product, service, or feature that is cross cloud in nature, limited to a specific
 * subset of customers on multiple instances, or not limited to a specific instance
 * @param {renders} - isml
 * @param {serverfunction} - get
 */
server.get('Messages', (req, res, next) => {
    const generalMessagesData = podAlertHelper.retrieveGeneralMessagesData();

    res.render('alerts/messages', {
        messages : generalMessagesData.data,
        update : {
            url : URLUtils.https('PODAlerts-Refresh', 'section', 'messages').toString(),
            refreshurl : URLUtils.https('PODAlerts-Messages', 'SelectedMenuItem', 'pod_alerts', 'CurrentMenuItemId', 'pod_alerts', 'menuname', 'Messages').toString(),
            date : generalMessagesData.date
        }
    });
    next();
});

/**
 * PODAlerts-Refresh: AJAX Request for refresh data by removing custom objects.
 * @param {renders} - json
 * @param {serverfunction} - get
 */
server.get('Refresh', (req, res, next) => {
    const CUSTOM_OBJECT_DATA = require('*/cartridge/config/customObjects.json');
    const sectionToRefresh = req.httpParameterMap['section'].value;

    if(Object.prototype.hasOwnProperty.call(CUSTOM_OBJECT_DATA, sectionToRefresh)) {
        podAlertHelper.removeCustomObject(sectionToRefresh);
        res.json({success : true});
    } else {
        res.json({success : false});
    }

    next();
});

/**
 * PODAlerts-Services: AJAX Requests for retrieving services status for the POD received as parameter.
 * @param {renders} - json
 * @param {serverfunction} - get
 */
server.get('Services', (req, res, next) => {
    const currentPodID = req.httpParameterMap['POD'].value;

    if(!empty(currentPodID)) {
        const Resource = require('dw/web/Resource');
        const Template = require('dw/util/Template');
        const podData = podAlertHelper.retrieveB2CCommercePodData(currentPodID);

        res.json({
            success : true,
            title : Resource.msgf('pod.alerts.status.services', 'podalerts', null, currentPodID),
            description : new Template('components/modals/podstatus').render(podAlertHelper.transformPodDataAsMap(podData.data.instance)).text
        });
    } else {
        res.json({ success : false});
    }
    next();
});

/**
 * PODAlerts-Maintenance: AJAX Request for retrieving information regarding a maintenance received as MaintenanceID parameter.
 * @param {renders} - json
 * @param {serverfunction} - get
 */
server.get('Maintenance', (req, res, next) => {
    const maintenanceID = req.httpParameterMap['MaintenanceID'].value;

    if(!empty(maintenanceID)) {
        const Template = require('dw/util/Template');
        const maintenanceData = podAlertHelper.retrieveMaintenanceData(maintenanceID);

        if(Object.prototype.hasOwnProperty.call(maintenanceData, 'success') && !empty(maintenanceData.success)) {
            res.json({ success : false});
        } else {
            res.json({
                success : true,
                title : maintenanceData.subject + ' : ' + maintenanceData.services.join(', ') + ' | ' + maintenanceData.pods.join(', '),
                description : new Template('components/modals/maintenance').render(podAlertHelper.transformMaintenanceAsMap(maintenanceData)).text
            });
        }
    } else {
        res.json({ success : false});
    }
    next();
});

/**
 * PODAlerts-Message: AJAX Request for retrieving information regarding a general message received as MessageID parameter.
 * @param {renders} - json
 * @param {serverfunction} - get
 */
server.get('Message', (req, res, next) => {
    const messageID = req.httpParameterMap['MessageID'].value;

    if(!empty(messageID)) {
        const Template = require('dw/util/Template');
        const messageData = podAlertHelper.retrieveMessageData(messageID);

        if(Object.prototype.hasOwnProperty.call(messageData, 'success') && !empty(messageData.success)) {
            res.json({ success : false});
        } else {
            const Resource = require('dw/web/Resource');

            res.json({
                success : true,
                title : messageData.subject + '#' + messageData.ID + ' | ' + Resource.msg('pod.alerts.section.messages.table.active.' + messageData.status, 'podalerts', messageData.status),
                description : new Template('components/modals/generalMessage').render(podAlertHelper.transformMessageAsMap(messageData)).text
            });
        }
    } else {
        res.json({ success : false});
    }
    next();
});

/**
 * PODAlerts-TestEmail: Endpoint for email testing purposes
 * @param {renders} - isml
 * @param {serverfunction} - get
 */
server.get('TestEmail', environment.isSecondaryInstanceGroup, (req, res, next) => {
    const Resource = require('dw/web/Resource');
    const emailType = req.httpParameterMap['email'].value || 'generalMessage';

    switch(emailType) {
        case 'incident' :
            // TODO
            break;
        case 'incidentSolved' :
            // TODO
            break;
        case 'maintenance' :
            const currentPodID = podAlertHelper.getPreference('podalerts_podNumber');
            const podData = podAlertHelper.retrieveB2CCommercePodData(currentPodID);
            const maintenance = podData.data.success && podData.data.instance.maintenances.length ? podData.data.instance.maintenances[0] : null;

            if(maintenance) {
                res.render('email/maintenance', {
                    subject : maintenance.subject,
                    additionalInformation : maintenance.additionalInformation,
                    date : maintenance.startTime + ', ' + maintenance.date,
                    status : Resource.msg('pod.alerts.section.maintenance.status.' + maintenance.status, 'podalerts', maintenance.status)
                });
            } else {
                res.json({success : false});
            }

            break;
        case 'generalMessage' :
        default :
            const generalMessagesData = podAlertHelper.retrieveGeneralMessagesData();
            const generalMessage = generalMessagesData && generalMessagesData.data && generalMessagesData.data.success ? generalMessagesData.data.messages[0] : null;

            if(generalMessage) {
                res.render('email/generalMessage', {
                    subject : generalMessage.subject,
                    body : generalMessage.body,
                    date : generalMessage.hour + ', ' + generalMessage.date,
                    status : Resource.msg('pod.alerts.section.messages.table.active.' + generalMessage.status, 'podalerts', generalMessage.status)
                });
            } else {
                res.json({success : false});
            }

            break;
    }
    next();
});

module.exports = server.exports();