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
}

export const locations = new Locations();