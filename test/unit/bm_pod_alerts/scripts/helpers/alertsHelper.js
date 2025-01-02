'use strict';

const { assert } = require('chai');
const proxyquire = require('proxyquire').noCallThru().noPreserveCache();

const MODULE_PATH = '../../../../../cartridges/bm_pod_alerts/cartridge/scripts/helpers/alertsHelper';

describe('alertsHelper', () => {

    const alertsHelpers = proxyquire(MODULE_PATH, {
        'dw/alert/Alerts' : {},
        'dw/system/Transaction' : require('../../../../mocks/dw/system/Transaction')
    });

    describe('removeAlert', () => {
        // TODO
        it('should return true', () => {
            assert.equal(1, 1);
        });
    });

    describe('getNewData', () => {
        it('should return null if no pastData received', () => {
            const pastData = null;
            const currentData = require('./data.json');

            assert.isNull(alertsHelpers.getNewData(pastData, currentData, 'ID'));
        });

        it('should return null if no currentData received', () => {
            const pastData = require('./data.json');
            const currentData = null;

            assert.isNull(alertsHelpers.getNewData(pastData, currentData, 'ID'));
        });

        it('should return null if currentData its the same as pastData', () => {
            const pastData = require('./data.json');
            const currentData = require('./data.json');

            assert.isNull(alertsHelpers.getNewData(pastData, currentData, 'ID'));
        });

        it('should return an object if currentData has data not present in pastData', () => {
            const data = require('./data.json');

            const currentData = data;
            const pastData = data.slice(1, data.length);

            assert.isObject(alertsHelpers.getNewData(pastData, currentData, 'ID'));
        });
    });
});