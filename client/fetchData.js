import { makeQuery } from "./clientUtils.js";

/**
 * Takes in an object and sends it to the server for querying
 * 
 * @param {object} data
 * @returns {object}
 */
export async function fetchCreate(data) {
    let response = await fetch('createArea', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data)
    });
    
    if (response.ok) {
        return { ok: true, value: `Successfully uploaded ${data.name} to the server` };
    } else {
        return { ok: false, error: `Failed to upload ${data.name} to the server` }
    }
}

/**
 * Sends a query to the server to search for areas based on the input data
 * 
 * @param {object} data 
 * @returns {object}
 */
export async function fetchSearch(data) {
    let valid = 0;
    for (const k in data) {
        valid += data[k] ? 1 : 0;
    }
    
    if (valid >= 2) {
        let response = await fetch(makeQuery('searchArea', data));
        
        if (response.ok) {
            return { ok: true, value: await response.json() };
        } else {
            return { ok: false, error: 'Response not ok' };
        }
    } else {
        return { ok: false, error: 'Require at least 2 parameters' };
    }
}

/**
 * Sends a request to the server to update an area in the database
 * 
 * @param {string} id 
 */
export async function fetchUpdate(data) {
    let response = await fetch('updateArea', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data)
    });
    
    if (response.ok) {
        return { ok: true, msg: `Successfully uploaded ${data.name} to the server` };
    } else {
        return { ok: false, error: `Failed to upload ${data.name} to the server` }
    }
}

/**
 * Sends a request to the server to delete an area from the database
 * 
 * @param {string} id 
 */
export async function fetchDelete(id) {
    let response = await fetch('deleteArea', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ id: id })
    });
    
    if (response.ok) {
        return { ok: true, msg: `Successfully deleted ${id} from the server` };
    } else {
        return { ok: false, error: `Failed to delete ${id} from the server` }
    }
}