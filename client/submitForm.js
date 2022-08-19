import { fetchCreate, fetchSearch, fetchUpdate } from "./fetchData.js";

/**
 * Makes a JSON obj out of the add-area form data
 */
export async function submitAddAreaForm(img) {
    //Collect all form data
    let data = {
        name: document.getElementById('location-name').value,
        img: img,
        location: document.getElementById('location-location').value,
        room: document.getElementById('location-room').value,
        floor: document.getElementById('location-floor').value,
        description: document.getElementById('location-description').value,
        seats: document.getElementById('location-seats').value,
        tables: document.getElementById('location-tables').value,
        ports: document.getElementById('location-ports').value,
        whiteboard: document.getElementById('location-whiteboard').checked,
        outside: document.getElementById('location-outside').checked,
        sun: document.getElementById('location-sun').checked,
        mon: document.getElementById('location-mon').checked,
        tue: document.getElementById('location-tue').checked,
        wed: document.getElementById('location-wed').checked,
        thu: document.getElementById('location-thu').checked,
        fri: document.getElementById('location-fri').checked,
        sat: document.getElementById('location-sat').checked
    };

    if (data.name === '') {
        window.alert('Name entry required');
    } else if (img === '') {
        window.alert('Image Required');
    } else {
        return fetchCreate(data);
    }
}

/**
 * Makes a JSON obj out of the update-area form data
 */
export async function submitUpdateAreaForm() {
    //Collect all form data
    let data = {
        id: document.getElementById('update-location-id').value,
        name: document.getElementById('update-location-name').value,
        location: document.getElementById('update-location-location').value,
        room: document.getElementById('update-location-room').value,
        floor: document.getElementById('update-location-floor').value,
        description: document.getElementById('update-location-description').value,
        seats: document.getElementById('update-location-seats').value,
        tables: document.getElementById('update-location-tables').value,
        ports: document.getElementById('update-location-ports').value,
        whiteboard: document.getElementById('update-location-whiteboard').checked,
        outside: document.getElementById('update-location-outside').checked,
        sun: document.getElementById('update-location-sun').checked,
        mon: document.getElementById('update-location-mon').checked,
        tue: document.getElementById('update-location-tue').checked,
        wed: document.getElementById('update-location-wed').checked,
        thu: document.getElementById('update-location-thu').checked,
        fri: document.getElementById('update-location-fri').checked,
        sat: document.getElementById('update-location-sat').checked
    };

    if (data.name === '') {
        window.alert('Name entry required');
    } else {
        return fetchUpdate(data);
    }
}

/**
 * Makes a JSON obj out of the search form data
 */
export async function submitSearchAreaForm() {
    //Collect all form data
    let data = {
        location: document.getElementById('search-location').value,
        room: document.getElementById('search-room').value,
        floor: document.getElementById('search-floor').value,
        seats: document.getElementById('search-seats').value,
        tables: document.getElementById('search-tables').value,
        ports: document.getElementById('search-ports').value,
        whiteboard: document.getElementById('search-whiteboard').checked,
        outside: document.getElementById('search-outside').checked,
        sun: document.getElementById('search-sun').checked,
        mon: document.getElementById('search-mon').checked,
        tue: document.getElementById('search-tue').checked,
        wed: document.getElementById('search-wed').checked,
        thu: document.getElementById('search-thu').checked,
        fri: document.getElementById('search-fri').checked,
        sat: document.getElementById('search-sat').checked
    };

    return await fetchSearch(data);
}