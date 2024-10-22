'use strict';

const Template = require('dw/util/Template');
const HashMap = require('dw/util/HashMap');
const Mail = require('dw/net/Mail');
const Resource = require('dw/web/Resource');

const podAlertHelper = require('*/cartridge/scripts/helpers/podAlertHelper');

/**
 * Sends an email with the specified content and subject.
 *
 * @param {string} content - The content of the email to be sent.
 * @param {string} subject - The subject of the email.
 * @returns {boolean} - Returns true if the email is sent successfully, false otherwise.
 */
const sendMail = (content, subject) => {
    let email = new Mail();
    const emails = podAlertHelper.getPreference('podalerts_email');

    email.addTo(emails);
    email.setFrom(podAlertHelper.getPreference('podalerts_sendEmailFrom'));
    email.setSubject(subject);
    email.setContent(content);

    return email.send();
};

/**
 * Sends a maintenance alert email.
 *
 * @param {Object} maintenance - The maintenance information.
 * @param {string} maintenance.subject - The email subject.
 * @param {string} maintenance.additionalInformation - Additional information for the maintenance.
 * @param {string} maintenance.startTime - The start time of the maintenance.
 * @param {string} maintenance.date - The date of the maintenance.
 * @param {string} maintenance.status - The status of the maintenance.
 * @returns {boolean} - Returns true if the email is sent successfully, false otherwise.
 */
const sendPODAlertMaintenanceEmail = (maintenance) => {
    let template = new Template('email/maintenance');

    let viewData = new HashMap();
    viewData.put('subject', maintenance.subject);
    viewData.put('additionalInformation', maintenance.additionalInformation);
    viewData.put('date', maintenance.startTime + ', ' + maintenance.date);
    viewData.put('status', Resource.msg('pod.alerts.section.maintenance.status.' + maintenance.status, 'podalerts', maintenance.status));

    return sendMail(template.render(viewData), newMaintenance.subject);
};

/**
 * Sends a general message email.
 * @param {object} generalMessage - The general message object.
 * @param {string} generalMessage.subject - The subject of the email.
 * @param {string} generalMessage.body - The body of the email.
 * @param {string} generalMessage.hour - The hour of the message.
 * @param {string} generalMessage.date - The date of the message.
 * @param {string} generalMessage.status - The status of the message.
 * @returns {boolean} - Returns true if the email was sent successfully, otherwise false.
 */
const sendGeneralMessageEmail = (generalMessage) => {
    let template = new Template('email/generalMessage');

    let viewData = new HashMap();
    viewData.put('subject', generalMessage.subject);
    viewData.put('body', generalMessage.body);
    viewData.put('date', generalMessage.hour + ', ' + generalMessage.date);
    viewData.put('status', Resource.msg('pod.alerts.section.messages.table.active.' + generalMessage.status, 'podalerts', generalMessage.status));

    return sendMail(template.render(viewData), generalMessage.subject);
};

module.exports = {
    sendPODAlertMaintenanceEmail : sendPODAlertMaintenanceEmail,
    sendGeneralMessageEmail : sendGeneralMessageEmail
};
