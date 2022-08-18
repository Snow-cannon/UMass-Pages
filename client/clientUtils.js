/**
 * Returns a url with the specified data as query parameters
 * 
 * @param {String} url 
 * @param {object} data 
 * @returns {String}
 */
export function makeQuery(url, data) {
    let query = new URLSearchParams();
    for (const d in data) {
        query.append(d, data[d]);
    }
    return `${url}/?${query}`;
}