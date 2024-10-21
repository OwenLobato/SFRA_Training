'use strict';

const TYPES = {
    INCIDENT : 'INCIDENT',
    MAINTENANCE : 'MAINTENANCE'
};

/**
 * Retrieves services for the instance.
 * @returns {array} of services.
 */
const getServices = (instance) => {
    const services = [];

    if(Object.prototype.hasOwnProperty.call(instance, 'Services')) {
        instance.Services.forEach(service => {
            services.push({
                key : service.key,
                status : 'OK',
                incidentEventId : null,
                incidentMessage : []
            });
        });
    }

    return services;
};

/**
 * Retrieves maintenances for the instance
 * @returns {array} of maintenances
 */
const getMaintenances = (instance) => {
    const maintenaces = [];

    if(Object.prototype.hasOwnProperty.call(instance, 'Maintenances')) {
        const maintenanceModel = require('*/cartridge/models/maintenance');
        instance.Maintenances.forEach(maintenance => {
            maintenaces.push(new maintenanceModel(maintenance));
        });

        maintenaces.reverse();
    }

    return maintenaces;
};

/**
 * Retrieves if there is any affected service for the instance and the incidents or maintenances
 * associated if any.
 * @returns {object} affectedServices
 */
const getAffectedServices = (instance) => {
    const affectedServices = {};

    if(instance.status.includes(TYPES.INCIDENT)) {
        if(Object.prototype.hasOwnProperty.call(instance, 'Incidents')) {
            for (let i = 0; i < instance.Incidents.length; i++) {
                let incident = instance.Incidents[i];
                for (let j = 0; j < incident.serviceKeys.length; j++) {
                    let service = incident.serviceKeys[j];

                    if (!affectedServices[service]) {
                        affectedServices[service] = [];
                    }

                    affectedServices[service].push({
                        id: incident.id,
                        type: TYPES.INCIDENT,
                        startTime: incident.IncidentImpacts[0] ? incident.IncidentImpacts[0].startTime : null,
                        endTime: incident.IncidentImpacts[0] ? incident.IncidentImpacts[0].endTime : null,
                        message: incident.IncidentEvents[0] ? incident.IncidentEvents[0].message : null,
                    });
                }
            }
        }
    }

    if(instance.status.includes(TYPES.MAINTENANCE)) {
        if(Object.prototype.hasOwnProperty.call(instance, 'Maintenances')) {
            for (let i = 0; i < instance.Maintenances.length; i++) {
                let maintenance = instance.Maintenances[i];

                for (let j = 0; j < maintenance.serviceKeys.length; j++) {
                    let service = maintenance.serviceKeys[j];

                    if (!affectedServices[service]) {
                        affectedServices[service] = [];
                    }

                    affectedServices[service].push({
                        id: maintenance.id,
                        type: TYPES.MAINTENANCE,
                        startTime: maintenance.plannedStartTime,
                        endTime: maintenance.plannedEndTime,
                        subject: maintenance.name,
                        message: maintenance.additionalInformation,
                    });
                }
            }
        }
    }

    return affectedServices;
};

module.exports = {
    getMaintenances : getMaintenances,
    getServices : getServices,
    newInstance : (instance) => {
        return {
            ID : instance.key,
            status : instance.status,
            affectedServices : getAffectedServices(instance)
        }
    }
};
