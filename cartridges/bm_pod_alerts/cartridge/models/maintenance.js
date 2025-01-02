'use strict';

/**
 * Formats an input string by converting uppercase letters into spaces followed by lowercase letters.
 * It also capitalizes the first letter of each sentence separated by a period and space.
 * @param {string} inputString - The input string to be formatted.
 * @returns {string} - The formatted string.
 */
const formatAvailability = (inputString) => {
    let modifiedString = inputString.replace(/([A-Z])/g, ' $1');
    modifiedString = modifiedString.toLowerCase();

    modifiedString = modifiedString.replace(/(^|\.\s+)([a-z])/g, function(match, p1, p2) {
        return p1 + p2.toUpperCase();
    });

    return modifiedString;
};

/**
 * Maintenance model
 */
module.exports = function (maintenance) {
    const podAlertHelper = require('*/cartridge/scripts/helpers/podAlertHelper');
    const StringUtils = require('dw/util/StringUtils');

    const plannedStartTime = new Date(maintenance.plannedStartTime);
    const startTimeCalendar = podAlertHelper.formatDate(plannedStartTime);

    const plannedEndTime = new Date(maintenance.plannedEndTime);
    const plannedEndTimeCalendar = podAlertHelper.formatDate(plannedEndTime);

    this.ID = maintenance.id;
    this.date = StringUtils.formatCalendar(startTimeCalendar, 'MMMMM dd');
    this.startTime = StringUtils.formatCalendar(startTimeCalendar, 'hh:mm a z');
    this.plannedStartTime = plannedStartTime;
    this.plannedEndTime = plannedEndTime;
    this.endTime = StringUtils.formatCalendar(plannedEndTimeCalendar, 'hh:mm a z');
    this.endDate = StringUtils.formatCalendar(plannedEndTimeCalendar, 'MMMMM dd');
    this.status = maintenance.message.eventStatus;
    this.availability = formatAvailability(maintenance.message.availability);
    this.type = maintenance.message.maintenanceType;
    this.subject = maintenance.name;
    this.additionalInformation = !empty(maintenance.additionalInformation) ? maintenance.additionalInformation.replace(/\\n/g, '<br />').replace(/\n/g, '<br />') : maintenance.additionalInformation;
    this.services = maintenance.serviceKeys;
    this.pods = maintenance.instanceKeys;
};
