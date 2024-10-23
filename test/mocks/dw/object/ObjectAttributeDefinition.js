var ObjectAttributeDefinition = function(){};

ObjectAttributeDefinition.prototype.getDefaultValue = function(){};
ObjectAttributeDefinition.prototype.getDisplayName = function(){};
ObjectAttributeDefinition.prototype.getID = function(){};
ObjectAttributeDefinition.prototype.isKey = function(){};
ObjectAttributeDefinition.prototype.getObjectTypeDefinition = function(){};
ObjectAttributeDefinition.prototype.getUnit = function(){};
ObjectAttributeDefinition.prototype.getAttributeGroups = function(){};
ObjectAttributeDefinition.prototype.getValueTypeCode = function(){};
ObjectAttributeDefinition.prototype.isSystem = function(){};
ObjectAttributeDefinition.prototype.getValues = function(){};
ObjectAttributeDefinition.prototype.requiresEncoding = function(){};
ObjectAttributeDefinition.prototype.isMultiValueType = function(){};
ObjectAttributeDefinition.prototype.isSetValueType = function(){};
ObjectAttributeDefinition.prototype.defaultValue=null;
ObjectAttributeDefinition.prototype.displayName=null;
ObjectAttributeDefinition.prototype.ID=null;
ObjectAttributeDefinition.prototype.objectTypeDefinition=null;
ObjectAttributeDefinition.prototype.unit=null;
ObjectAttributeDefinition.prototype.attributeGroups=null;
ObjectAttributeDefinition.prototype.valueTypeCode=null;
ObjectAttributeDefinition.prototype.values=null;

ObjectAttributeDefinition.VALUE_TYPE_STRING = 0;
ObjectAttributeDefinition.VALUE_TYPE_INT = 1;
ObjectAttributeDefinition.VALUE_TYPE_NUMBER = 2;
ObjectAttributeDefinition.VALUE_TYPE_TEXT = 3;
ObjectAttributeDefinition.VALUE_TYPE_HTML = 4;
ObjectAttributeDefinition.VALUE_TYPE_DATE = 5;
ObjectAttributeDefinition.VALUE_TYPE_DATETIME = 6;
ObjectAttributeDefinition.VALUE_TYPE_IMAGE = 7;
ObjectAttributeDefinition.VALUE_TYPE_EMAIL = 8;
ObjectAttributeDefinition.VALUE_TYPE_PASSWORD = 9;
ObjectAttributeDefinition.VALUE_TYPE_BOOLEAN = 10;
ObjectAttributeDefinition.VALUE_TYPE_MONEY = 11;
ObjectAttributeDefinition.VALUE_TYPE_QUANTITY = 12;
ObjectAttributeDefinition.VALUE_TYPE_SET_OF_STRING = 13;
ObjectAttributeDefinition.VALUE_TYPE_SET_OF_INT = 14;
ObjectAttributeDefinition.VALUE_TYPE_SET_OF_NUMBER = 15;
ObjectAttributeDefinition.VALUE_TYPE_ENUM_OF_STRING = 16;
ObjectAttributeDefinition.VALUE_TYPE_ENUM_OF_INT = 17;

module.exports = ObjectAttributeDefinition;