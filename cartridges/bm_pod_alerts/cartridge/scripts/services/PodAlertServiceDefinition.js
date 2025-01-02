'use strict';

const Status = require('dw/system/Status');
const serviceHelper = require('*/cartridge/scripts/helpers/serviceHelper');
const success = new Status(Status.OK);

/**
 * Service Callbacks for B2C Commerce Status API request.
 */
const B2CCommerceStatus = {
    createRequest : (service, parameters) => {
        service.setRequestMethod('GET');
        service.setURL(service.getURL() + parameters.endpoint);

        service.addParam('products', parameters.params.products);
        service.addParam('childProducts', parameters.params.childProducts);
    },
    parseResponse: (service, response) => {
        if(response.statusMessage == success.message) {
            try {
                const serviceResponse = JSON.parse(response.text);
                const result = {
                    success : true,
                    instances : serviceHelper.cleanUpInstancesStatus(serviceResponse)
                };

                return result;
            } catch(error) {
                // Log error message and do something
                return { success : false};
            }
        } else {
            // Log error message and do something
            return { success : false};
        }
    }
};

/**
 * Service Callbacks for B2C Commerce Maintenances API request.
 */
const Maintenances = {
    createRequest : (service, parameters) => {
        service.setRequestMethod('GET');
        service.setURL(service.getURL() + parameters.endpoint);

        service.addParam('limit', parameters.params.limit);
        service.addParam('offset', parameters.params.offset);
        service.addParam('product', parameters.params.product);
        service.addParam('sort', parameters.params.sort);
        service.addParam('order', parameters.params.order);
    },
    parseResponse: (service, response) => {
        if(response.statusMessage == success.message) {
            try {
                const serviceResponse = JSON.parse(response.text);
                const maintenances = serviceHelper.cleanUpMaintenances(serviceResponse);
                const result = {
                    success : true,
                    past : maintenances.past,
                    next : maintenances.next
                };

                return result;
            } catch(error) {
                // Log error message and do something
                return { success : false};
            }
        } else {
            // Log error message and do something
            return { success : false};
        }
    }
};

/**
 * Service Callbacks for B2C Commerce Maintenance API request.
 */
const Maintenance = {
    createRequest : (service, parameters) => {
        service.setRequestMethod('GET');
        service.setURL(service.getURL() + parameters.endpoint);

        service.addParam('id', parameters.params.id);
    },
    parseResponse: (service, response) => {
        if(response.statusMessage == success.message) {
            try {
                const maintenanceModel = require('*/cartridge/models/maintenance');
                const serviceResponse = JSON.parse(response.text);

                const result = {
                    success : true,
                    maintenance : new maintenanceModel(serviceResponse)
                };

                return result;
            } catch(error) {
                // Log error message and do something
                return { success : false};
            }
        } else {
            // Log error message and do something
            return { success : false};
        }
    }
};

/**
 * Service Callback for B2C Commerce POD Status API request.
 */
const PODStatus = {
    createRequest : (service, parameters) => {
        service.setRequestMethod('GET');
        service.setURL(service.getURL() + parameters.endpoint);

        service.addParam('key', parameters.params.key);
        service.addParam('productKey', parameters.params.productKey);
        service.addParam('childProducts', parameters.params.childProducts);
    },
    parseResponse: (service, response) => {
        if(response.statusMessage == success.message) {
            try {
                const instanceModel = require('*/cartridge/models/instance');
                const serviceResponse = JSON.parse(response.text);

                // Add maintenances and services to current podData stored from B2CCommerceStatus Service.
                let podData = serviceHelper.getPODPreviewData(serviceResponse.key);
                podData.maintenances = instanceModel.getMaintenances(serviceResponse);
                podData.services = instanceModel.getServices(serviceResponse);

                const result = {
                    success : true,
                    instance : podData
                };

                return result;
            } catch(error) {
                // Log error message and do something
                return { success : false};
            }
        } else {
            // Log error message and do something
            return { success : false};
        }
    },
    mockCall: function (svc, params) {
        return {
            statusCode: 200,
            statusMessage: 'OK',
            text: JSON.stringify({
                "key": "POD114",
                "status": "MINOR_INCIDENT_NONCORE",
                "isActive": true,
                "Services": [{
                        "key": "CartService",
                        "order": 310,
                        "isCore": false
                    }, {
                        "key": "B2CCore",
                        "order": 300,
                        "isCore": true
                    }, {
                        "key": "AccountManager",
                        "order": 305,
                        "isCore": false
                    }, {
                        "key": "eCDN",
                        "order": 315,
                        "isCore": false
                    }, {
                        "key": "PaymentService",
                        "order": 400,
                        "isCore": false
                    }
                ],
                "Incidents": [{
                    "id": 10967,
                    "isCore": true,
                    "affectsAll": true,
                    "createdAt": "2023-04-02T03:39:01.680Z",
                    "updatedAt": "2023-04-02T03:47:10.152Z",
                    "IncidentImpacts": [{
                        "id": 11937,
                        "startTime": "2023-04-02T02:38:00.000Z",
                        "endTime": null,
                        "type": "performanceDegradation",
                        "severity": "minor",
                        "createdAt": "2023-04-02T03:39:01.727Z",
                        "updatedAt": "2023-04-02T04:19:33.793Z",
                        "startTimeCreatedAt": "2023-04-02T03:39:01.728Z",
                        "startTimeModifiedAt": "2023-04-02T04:19:33.794Z",
                        "endTimeCreatedAt": "2023-04-02T04:19:33.794Z",
                        "endTimeModifiedAt": null
                    }],
                    "IncidentEvents": [{
                            "id": 9202,
                            "type": "update",
                            "message": "The Salesforce Technology team has declared that the intermittent performance degradation was resolved as of 04:06 UTC. This was following the successful completion of the restarts performed. Engineers have validated that the services have returned to a healthy state.",
                            "createdAt": "2023-04-02T04:19:33.808Z",
                            "updatedAt": "2023-04-02T04:19:33.821Z"
                        }, {
                            "id": 9201,
                            "type": "update",
                            "message": "At 02:38 UTC, on April 2, 2023, the Salesforce Technology team was notified of an issue intermittently impacting customers ability to access Business Manager for the Salesforce Commerce Cloud Service. \n\nEngineers are investigating the issue and are proactively restarting the impacted hardware.\n\nWe’ll provide an update in 30 minutes or sooner if additional information becomes available.\n",
                            "createdAt": "2023-04-02T03:47:10.212Z",
                            "updatedAt": "2023-04-02T04:19:33.811Z"
                        }
                    ],
                    "serviceKeys": [
                        "B2CCore"
                    ]}
                ],
                "Maintenances": [{
                    "id": 636660,
                    "message": {
                        "maintenanceType": "release",
                        "availability": "storefrontDowntimeShouldNotExceed15MinutesActiveJobsAndReplicationsWillBeInterruptedDuringThisMaintenance",
                        "eventStatus": "confirmed"
                    },
                    "externalId": "a3GEE000000ALw32AG",
                    "name": "23.4 B2C GA - Tuesday April 4, 2023",
                    "plannedStartTime": "2023-04-04T06:00:00.000Z",
                    "plannedEndTime": "2023-04-04T11:00:00.000Z",
                    "additionalInformation": "23.4 B2C GA - Tuesday April 4, 2023 \\n\n\\n\nSalesforce B2C Commerce GA is scheduled to be deployed to PIG instances. \\n\nAll impacted instances will be restarted when the deployment is done. \\n\n\\n\nYou may review the Salesforce B2C Commerce Release Notes in the Salesforce Help portal: https://help.salesforce.com/articleView?id=b2c_rn_release_notes.htm&type=5 \\n\n\\n\nIf you have any further questions, please contact your local representative or Salesforce Commerce Cloud Support via the Support Community. \\n\n\\n\nEnvironment \\n\nPrimary Instance Group (PIG) \\n\n\\n\nTime: 0200 - 0700 (Local POD Time) \\n\n\\n\nImpact \\n\nShould not exceed 15 minutes of downtime. All PIG instances will be restarted following the update. \\n\nActive jobs and replications will be interrupted. We make our best effort to minimize downtime through this process. However, there are rare occasions when manual intervention is required, increasing impact of the deployment.",
                    "isCore": true,
                    "affectsAll": false,
                    "createdAt": "2023-03-27T11:13:28.540Z",
                    "updatedAt": "2023-03-27T11:13:28.540Z",
                    "MaintenanceImpacts": [],
                    "MaintenanceEvents": [{
                        "id": 177053,
                        "type": "scheduled",
                        "message": "This maintenance is scheduled.",
                        "createdAt": "2023-03-27T11:21:29.793Z",
                        "updatedAt": "2023-03-27T11:21:29.793Z"
                    }],
                    "instanceKeys": [
                        "POD114"
                    ],
                    "serviceKeys": [
                        "B2CCore"
                    ]
                }]
            })
        }
    }
};

/**
 * Service Callback for General Messages Status API request.
 */
const GeneralMessages = {
    createRequest : (service, params) => {
        service.setRequestMethod('GET');
        service.setURL(service.getURL() + params.endpoint);
    },
    parseResponse: (service, response) => {
        if(response.statusMessage == success.message) {
            try {
                const serviceResponse = JSON.parse(response.text);
                const result = {
                    success : true,
                    messages : serviceHelper.cleanUpMessages(serviceResponse)
                };

                return result;
            } catch(error) {
                // Log error message and do something
                return { success : false};
            }
        } else {
            // Log error message and do something
            return { success : false};
        }
    }
};

/**
 * Service Callback for General Message Status API request.
 */
const GeneralMessage = {
    createRequest : (service, parameters) => {
        service.setRequestMethod('GET');
        service.setURL(service.getURL() + parameters.endpoint);

        service.addParam('id', parameters.params.id);
    },
    parseResponse: (service, response) => {
        if(response.statusMessage == success.message) {
            try {
                const messageModel = require('*/cartridge/models/message');
                const serviceResponse = JSON.parse(response.text);
                const result = {
                    success : true,
                    message : new messageModel(serviceResponse)
                };

                return result;
            } catch(error) {
                // Log error message and do something
                return { success : false};
            }
        } else {
            // Log error message and do something
            return { success : false};
        }
    }
};

module.exports = {
    B2CCommerceStatus : B2CCommerceStatus,
    Maintenances : Maintenances,
    PODStatus : PODStatus,
    GeneralMessages : GeneralMessages,
    Maintenance : Maintenance,
    GeneralMessage : GeneralMessage
};
