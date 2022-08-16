/**
 * Returns a randomly generated string of 10 characters
 * 
 * @returns {string}
 */
export function makeID(len) {
    let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    for(let i = 0; i < len; i++){
        id += chars[Math.floor(Math.random() * chars.length)];
    }
    return id;
}