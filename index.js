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
    console.log(submitSearchForm());
}

//Load necessary information when the window completes loading
window.onload = () => {
    makeLocationList(document.getElementById('location-dropdown-list'), document.getElementById('location-location'));
    makeLocationList(document.getElementById('search-dropdown-list'), document.getElementById('search-location'));

    //TODO: Remove test card
    addResult({
        location: 'Franklin DC',
        img: 'data:image/jpeg;base64,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',
        name: 'Frank',
        desc: 'A place to study and eat food at the same time. Plenty of space. Just need a dining plan',
        room: 0,
        seats: 200,
        tables: 50,
        ports: 0,
        whiteboard: false,
        outside: false,
        open: [true, true, true, true, true, true, true]
    }, 1);

    //TODO: Remove test card
    addResult({
        location: 'Lederly Graduate Research Center',
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN-v0_XMCY8JPorpsxxBF04m7hJBYuSUceVQ&usqp=CAU',
        name: 'LGRC 3rd Floor',
        desc: 'A quiet place to study with a few friends',
        room: 3,
        seats: 4,
        tables: 1,
        ports: 2,
        whiteboard: false,
        outside: false,
        open: [false, true, true, true, true, true, true]
    }, 2);
}