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
 * Get viable locations
 */
function makeLocationList(list, output) {
    let locations = [ //TODO: use GET to fetch locations list
        'A',
        'B',
        'C',
        'D',
        'E',
        'F'
    ];
    const dropdown = list;
    const choice = output;
    locations.forEach(l => {
        let li = document.createElement('li');
        let div = document.createElement('div');
        div.classList.add('dropdown-item');
        div.innerText = l;
        li.onclick = () => {
            choice.value = l;
        }
        li.appendChild(div);
        dropdown.appendChild(li);
    });
}

/**
 * Takes in the data for a study area and outpusts it to a card format
 * 
 * @param {object} content
 * @param {Element} container
 * @param {String} content.name
 * @param {String} content.img
 * @param {String} content.desc
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
    desc.innerText = content.desc;
    body.appendChild(desc);

    //Create List Structure
    let list = document.createElement('ul');
    list.classList.add('list-group');
    list.classList.add('list-group-flush');
    card.appendChild(list);

    //Ignore rendering all values that do not exist in the submission
    const addItem = (title, value) => {
        if (value !== null && value !== undefined && value !== '') {
            let elem = document.createElement('li');
            elem.classList.add('list-group-item');
            if (typeof value === 'boolean' || value === 0) { //Treat booleans differently
                elem.classList.add(`list-group-item-${value ? 'success' : 'danger'}`)
                elem.innerText = `${title}: ${value ? '✔️' : '❌'}`
            } else {
                elem.innerText = `${title}: ${value}`;
            }
            list.appendChild(elem);
        }
    }

    //Add location data
    addItem('Location', content.location);
    addItem('Room #', content.room);
    addItem('Floor #', content.floor);

    //Add open days
    let date = new Date();
    addItem('Open Today', content.open[date.getDay()]);

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

    //Add data to the columns
    let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    content.open.forEach((d, i) => {
        let elem = document.createElement('div');
        elem.classList.add(`list-group-item-${d ? 'success' : 'danger'}`)
        elem.innerText += `${days[i]}: ${d ? '✔️' : '❌'}`
        cols[i].appendChild(elem);
    });

    rows.forEach(r => { openDays.appendChild(r); });
    list.appendChild(openDays);

    addItem('Seats', content.seats);
    addItem('Tables', content.tables);
    addItem('Wall Ports', content.ports);
    addItem('Whiteboard', content.whiteboard);
    addItem('Outside', content.outside);

    //Append to the specified column of cards
    document.getElementById(`gsr-container-${container}`).appendChild(card);
}

/**
 * Makes a JSON obj out of the add-area form data
 */
function submitAddAreaForm() {
    //Collect all form data
    let data = {
        name: document.getElementById('location-name').value,
        img: uploaded_image,
        location: document.getElementById('location-location').value,
        room: document.getElementById('location-room').value,
        floor: document.getElementById('location-floor').value,
        desc: document.getElementById('location-desc').value,
        seats: document.getElementById('location-seats').value,
        tables: document.getElementById('location-tables').value,
        ports: document.getElementById('location-ports').value,
        whiteboard: document.getElementById('location-whiteboard').checked,
        outside: document.getElementById('location-outside').checked,
        open: [
            document.getElementById('location-sun').checked,
            document.getElementById('location-mon').checked,
            document.getElementById('location-tue').checked,
            document.getElementById('location-wed').checked,
            document.getElementById('location-thu').checked,
            document.getElementById('location-fri').checked,
            document.getElementById('location-sat').checked
        ]
    };

    return data;
}

/**
 * Makes a JSON obj out of the search form data
 */
function submitSearchForm() {
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
        open: [
            document.getElementById('search-sun').checked,
            document.getElementById('search-mon').checked,
            document.getElementById('search-tue').checked,
            document.getElementById('search-wed').checked,
            document.getElementById('search-thu').checked,
            document.getElementById('search-fri').checked,
            document.getElementById('search-sat').checked
        ]
    };

    return data;
}

let lastAdd = 0;
document.getElementById('submit-location').onclick = () => {
    //TODO: Send to server instead of ading to gsr
    lastAdd = (lastAdd + 1 % 3)
    addResult(submitAddAreaForm(), lastAdd);
    return false;
}

document.getElementById('submit-search').onclick = () => {
    //TODO: Submit search query to the server
    //TODO: Load all results to the screen
    console.log('To be sent to server for querying:');
    console.log(submitSearchForm());
}

//Load necessary information when the window completes loading
window.onload = () => {
    makeLocationList(document.getElementById('location-dropdown-list'), document.getElementById('location-location'));
    makeLocationList(document.getElementById('search-dropdown-list'), document.getElementById('search-location'));
}