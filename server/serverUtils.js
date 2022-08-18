import { database } from "./database.js";

/**
 * Returns a randomly generated string of 10 characters
 * 
 * @returns {string}
 */
export function makeID(len) {
    let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    for (let i = 0; i < len; i++) {
        id += chars[Math.floor(Math.random() * chars.length)];
    }
    return id;
}

/**
 * Takes in an object and maps the valid keys to column points in the database.
 * All missing data or data of incorrect types are converted to null.
 * Genrerates a random key as well.
 * 
 * @param {object} data 
 */
export function buildQueryData(data, create) {
    return database.cols.map(c => {
        //generate a random ID
        if (create && c.id === 'id') {
            return makeID(10);
        }

        //Import all valid data from the object
        if (data.hasOwnProperty(c.id)) {
            return fromString(c.type, data[c.id], create);
        } else {
            //All invalid or missing data is repaced with null
            return null;
        }
    });
}

/**
 * Converts the input string to the expected data type if possible.
 * Returns null if the conversion does not work
 * 
 * @param {String} expected 
 * @param {string} value 
 * @returns {any}
 */
function fromString(expected, value, correct) {
    //For cases where the input is already correct (string is string)
    if (typeof value === expected) {
        return value;
    } else if (expected === 'boolean') {
        return (value === 'true' ? true : (value === 'false' ? false : null));
    } else if (expected === 'number') {
        //An empty string is 0 on extreme correction
        let num = parseInt(value);
        return isNaN(num) ? (value === '' && correct ? 0 : null) : num;
    } else {
        return null;
    }
}