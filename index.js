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
 * Get viable locations (Will be loaded from server in the future)
 */
function makeLocationList(list, output) {
    let locations = [ //Replace with GET
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

//Load necessary information when the window completes loading
window.onload = () => {
    makeLocationList(document.getElementById('location-dropdown-list'), document.getElementById('location-location'));
    makeLocationList(document.getElementById('search-dropdown-list'), document.getElementById('search-location'));
}