import { fetchDelete } from "./fetchData.js";
import { submitAddAreaForm, submitSearchAreaForm, submitUpdateAreaForm } from './submitForm.js';
import { locations } from "./locations.js";

/** Determins if the user is logged in */
let LOGIN = false;

/**
 * Load building names to the client
 */
window.onload = async () => {
    let response = await fetch('/logged');
    if (response.ok) {
        let data = await response.json();
        if (data.ok) {
            document.getElementById('registerB').remove();
            document.getElementById('loginB').remove();
            let logout = document.getElementById('logoutB');
            logout.innerText = `Logout: ${data.name}`;
            LOGIN = true;
        } else {
            document.getElementById('logoutF').remove();
        }
    }
    if (!locations.isloaded) {
        await locations.loadLocations();
    }
    makeLocationList(document.getElementById('location-dropdown-list'), document.getElementById('location-location'), document.getElementById('location-dropdown-button'));
    makeLocationList(document.getElementById('search-dropdown-list'), document.getElementById('search-location'), document.getElementById('search-dropdown-button'));
    makeLocationList(document.getElementById('update-location-dropdown-list'), document.getElementById('search-location'), document.getElementById('search-dropdown-button'));
}

/**
 * 
 * Update Screen
 * 
 */

/**
 * Get viable locations
 */
function makeLocationList(list, output, focus) {
    const dropdown = list;
    const choice = output;

    //Add basic select option
    let li = document.createElement('li');
    let div = document.createElement('div');
    div.classList.add('dropdown-item');
    div.innerText = 'Select';
    li.onclick = () => {
        choice.value = '';
        focus.focus();
    }
    li.appendChild(div);
    dropdown.appendChild(li);

    //Add other locations
    locations.places.forEach(l => {
        li = document.createElement('li');
        div = document.createElement('div');
        div.classList.add('dropdown-item');
        div.innerText = l.name;
        li.onclick = () => {
            choice.value = l.name;
            focus.focus();
        }
        li.appendChild(div);
        dropdown.appendChild(li);
    });
}

/**
 * Takes in the data for a study area and outpusts it to a card format
 * 
 * @param {object} content
 * @param {number} container
 * @param {String} content.name
 * @param {String} content.img
 * @param {String} content.description
 * @param {String} content.location
 * @param {boolean[]} content.open
 * @param {number} content.room
 * @param {number} content.seats
 * @param {number} content.tables
 * @param {number} content.ports
 * @param {boolean} content.whiteboard
 * @param {outside} content.outside
 */
function addResult(content, container) {

    //Make card div
    let card = document.createElement('div');
    card.classList.add('card');
    card.classList.add('gsr-item');

    //Image of the card
    let img = document.createElement('img');
    img.classList.add('card-img-top');
    img.classList.add('gsr-img');
    img.src = content.img;
    img.alt = content.name;
    card.appendChild(img);

    //Add card body
    let body = document.createElement('div');
    body.classList.add('card-body');
    card.appendChild(body);

    //Add name
    let name = document.createElement('h5');
    name.classList.add('card-title');
    name.innerText = content.name;
    body.appendChild(name);

    //Add description
    let desc = document.createElement('p');
    desc.classList.add('card-text');
    desc.innerText = content.description;
    body.appendChild(desc);

    //Create List Structure
    let list = document.createElement('ul');
    list.classList.add('list-group');
    list.classList.add('list-group-flush');
    card.appendChild(list);

    //Ignore rendering all values that do not exist in the submission
    const addItem = (title, value, fancy) => {
        if (value !== null && value !== undefined && value !== '') {
            let elem = document.createElement('li');
            elem.classList.add('list-group-item');
            if (typeof value === 'boolean') { //Treat booleans differently
                elem.classList.add(`list-group-item-${value ? 'success' : 'danger'}`)
                elem.innerText = `${title}: ${value ? '✔️' : '❌'}`
            } else if (value === 0 && fancy) {
                elem.classList.add(`list-group-item-warning`)
                elem.innerText = `${title}: 0`
            } else {
                elem.innerText = `${title}: ${value}`;
            }
            list.appendChild(elem);
        }
    }

    //Add location data
    addItem('Location', content.location);
    addItem('Address', locations.getAddress(content.location));
    addItem('Room #', content.room);
    addItem('Floor #', content.floor);

    //Add open days
    let date = new Date();
    let days = [
        { open: content.sun, day: 'Sun' },
        { open: content.mon, day: 'Mon' },
        { open: content.tue, day: 'Tue' },
        { open: content.wed, day: 'Wed' },
        { open: content.thu, day: 'Thu' },
        { open: content.fri, day: 'Fri' },
        { open: content.sat, day: 'Sat' },
    ];

    addItem('Open Today', days[date.getDay()].open);

    //Create open day grid
    let openDays = document.createElement('li');
    openDays.classList.add('list-group-item');
    openDays.classList.add('list-group-flush');
    openDays.style.padding = '0px';

    //Create column list
    let cols = [];
    for (let i = 0; i < 7; i++) {
        let c = document.createElement('div')

        //Make column sizes
        if (i === 6) {
            c.classList.add('col');
        } else {
            c.classList.add('col-lg-4');
        }


        //Remove padding
        if (i % 3 < 2 && i !== 6) { //Left, middle
            c.style.paddingRight = 0;
        }

        if (i % 3 > 0) { //Right, middle, bottom
            c.style.paddingLeft = 0;
        }

        cols.push(c);
    }

    //Make row list
    let rows = [];
    for (let i = 0; i < 3; i++) {
        let r = document.createElement('div')
        r.classList.add('row');
        r.classList.add('justify-content-center');
        r.classList.add('text-center');
        rows.push(r);
    }

    //Add cols to rows
    cols.forEach((c, i) => {
        if (i === 6) {
            rows[2].appendChild(c);
        } else {
            rows[Math.floor(i / 3)].appendChild(c);
        }
    });

    days.forEach((d, i) => {
        let elem = document.createElement('div');
        elem.classList.add(`list-group-item-${d.open ? 'success' : 'danger'}`);
        elem.innerText += `${d.day}: ${d.open ? '✔️' : '❌'}`;
        cols[i].appendChild(elem);
    });

    rows.forEach(r => { openDays.appendChild(r); });
    list.appendChild(openDays);

    addItem('Seats', content.seats, true);
    addItem('Tables', content.tables, true);
    addItem('Wall Ports', content.ports, true);
    addItem('Whiteboard', content.whiteboard);
    addItem('Outside', content.outside);

    /**
     * Only add the delete and update buttons if the user is logged in
     */
    if (LOGIN) {
        let deleteButton = document.createElement('button');
        deleteButton.classList.add('btn');
        deleteButton.classList.add('btn-secondary');
        deleteButton.classList.add('w-auto');
        deleteButton.innerText = 'Remove Area';
        deleteButton.onclick = async () => {
            if (confirm(`Does ${content.name} no longer exist?`)) {
                await fetchDelete(content.id);
                card.remove();
            }
        };
        card.appendChild(deleteButton);

        let updateButton = document.createElement('button');
        updateButton.type = 'button';
        updateButton.classList.add('btn');
        updateButton.classList.add('btn-umass-primary');
        updateButton.setAttribute('data-bs-toggle', 'modal');
        updateButton.setAttribute('data-bs-target', '#updateM');
        updateButton.innerText = 'Update Area';
        updateButton.onclick = () => {
            for (const k in content) {
                if (k === 'img') {

                } else if (typeof content[k] === 'boolean') {
                    document.getElementById(`update-location-${k}`).checked = content[k];
                } else {
                    document.getElementById(`update-location-${k}`).value = content[k];
                }
            }
        }
        card.appendChild(updateButton);
    }

    //Append to the specified column of cards
    document.getElementById(`gsr-container-${container}`).appendChild(card);
}

function clearResults() {
    for (let i = 0; i < 3; ++i) {
        document.getElementById(`gsr-container-${i}`).innerHTML = '';
    }
}

/**
 * 
 * Listeners
 * 
 */

/**
 * Live-display the chosen image
 */
const image_input = document.getElementById('image_input');
let uploaded_image = '';

image_input.addEventListener('change', function () {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
        uploaded_image = reader.result;
        document.getElementById('display_image').style.backgroundImage = `url(${uploaded_image})`;
    });
    reader.readAsDataURL(this.files[0]);
});

/**
 * Submits the add area form to the server
 */
document.getElementById('submit-location').onclick = async () => {
    await submitAddAreaForm(uploaded_image);
}

/**
 * Submits the add area form to the server
 */
document.getElementById('update-location').onclick = async () => {
    await submitUpdateAreaForm();
}

/**
 * Submits the search request to the server
 */
document.getElementById('submit-search').onclick = async () => {
    let results = await submitSearchAreaForm();
    if (results.ok) {
        let rows = results.value.result.rows;
        if (rows) {
            clearResults();
            //Only show the top 21 results (divisible by 3)
            rows.splice(21);
            rows.forEach((l, i) => { addResult(l, i % 3); });
        } else {
            alert('No results found');
        }
    } else {
        alert(results.error);
    }
}