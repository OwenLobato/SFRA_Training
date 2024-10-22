'use strict';

const File = require('dw/io/File');

const workingFolder = new File([File.IMPEX, 'src', 'podalerts'].join(File.SEPARATOR));
const POD_STATUS_FILES = {
    POD_STATUS : 'podstatus.json',
    GENERAL_MESSAGES : 'generalmessages.json'
};

/**
 * Retrieves the content of a file.
 *
 * @param {File} file - The file from which to retrieve the content.
 * @returns {string} The content of the file.
 */
const getFileContent = (file) => {
    const FileReader = require('dw/io/FileReader');

    const reader = new FileReader(file);
    let content = reader.readString();
    reader.close();

    return content;
};

/**
 * Sets the current information by writing it to a file.
 *
 * @param {string} fileName - The name of the file to write the information to.
 * @param {any} content - The content to be written to the file.
 */
const setCurrentInformation = (fileName, content) => {
    const FileWriter = require('dw/io/FileWriter');
    const file = new File([workingFolder.fullPath, fileName].join(File.SEPARATOR));
    const fileWriter = new FileWriter(file);

    fileWriter.write(JSON.stringify(content));
    fileWriter.close();
};

/**
 * Retrieves past information from a file.
 *
 * @param {string} fileName - The name of the file to retrieve the information from.
 * @returns {any|null} The past information parsed from the file, or null if the file doesn't exist.
 */
const getPastInformation = (fileName) => {
    if (!workingFolder.exists()) {
        workingFolder.mkdirs();
    }

    const file = new File([workingFolder.fullPath, fileName].join(File.SEPARATOR));
    if (file.exists()) {
        return JSON.parse(getFileContent(file))
    }

    return null;
};

module.exports = {
    getPastInformation : getPastInformation,
    setCurrentInformation : setCurrentInformation,
    POD_STATUS_FILES : POD_STATUS_FILES
};
