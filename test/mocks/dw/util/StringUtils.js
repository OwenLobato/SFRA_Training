var StringUtils = function(){};

StringUtils.format = function(pattern, params) {
    params = Array.prototype.slice.call(arguments, 1);

    params.forEach((param, idx) => {
        pattern = pattern.replace(`{${idx}}`, param);
    });

    return pattern;
};
StringUtils.trim = function(){};
StringUtils.truncate = function(){};
StringUtils.encodeBase64 = function(){};
StringUtils.decodeBase64 = function(){};
StringUtils.pad = function(){};
StringUtils.encodeString = function(){};
StringUtils.decodeString = function(){};
StringUtils.stringToHtml = function(){};
StringUtils.stringToXml = function(){};
StringUtils.stringToWml = function(){};
StringUtils.ltrim = function(){};
StringUtils.rtrim = function(){};
StringUtils.formatInteger = function(){};
StringUtils.formatNumber = function(){};
StringUtils.formatMoney = function(){};
StringUtils.formatDate = function(){};
StringUtils.formatCalendar = function(){};
StringUtils.garble = function(){};

module.exports = StringUtils;