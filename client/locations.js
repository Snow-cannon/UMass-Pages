/**
 * Contains the list of all UMass Amherst buildings
 */
class Locations {

    constructor() {
        this.places = [];
        this.isloaded = false;
    }

    async loadLocations() {
        let response = await fetch('/locations.json');
        if (response.ok) {
            this.places = await response.json();
            this.isloaded = true;
        } else {
            console.error('failed response');
        }
    }

    /**
     * Returns the address of the result if it exists. returns null otherwise
     * 
     * @param {String} name 
     * @returns {String|null}
     */
    getAddress(name) {
        let result = this.places.filter(p => p.name === name)[0];
        return result ? result.address : null;
    }
}

export const locations = new Locations();