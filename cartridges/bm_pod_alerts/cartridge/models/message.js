'use strict';

/**
 * General Message model
 */
module.exports = function (generalMessage) {
    const podAlertHelper = require('*/cartridge/scripts/helpers/podAlertHelper');
    const StringUtils = require('dw/util/StringUtils');

    const startDate = new Date(generalMessage.startDate);
    const startDateCalendar = podAlertHelper.formatDate(startDate);

    const updatedDate = new Date(generalMessage.updatedAt);
    const updatedDateCalendar = podAlertHelper.formatDate(updatedDate);

    this.ID = generalMessage.id;
    this.subject = generalMessage.subject;
    this.date = StringUtils.formatCalendar(startDateCalendar, 'MMMMM dd');
    this.hour = StringUtils.formatCalendar(startDateCalendar, 'hh:mm a z');
    this.updatedDate = StringUtils.formatCalendar(updatedDateCalendar, 'MMMMM dd');
    this.updatedHour = StringUtils.formatCalendar(updatedDateCalendar, 'hh:mm a z');
    this.body = !empty(generalMessage.body) ? generalMessage.body.replace(/\\n/g, '<br />').replace(/\n/g, '<br />') : generalMessage.body;

    this.status = 'closed';
    if ((new Date()).getTime() < new Date(generalMessage.endDate).getTime()) {
        this.status = 'ongoing';
    }
};
