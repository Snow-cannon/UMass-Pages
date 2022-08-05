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
function makeLocationList() {
    let locations = [ //Replace with GET
        'A',
        'B',
        'C',
        'D',
        'E',
        'F'
    ];
    const dropdown = document.getElementById('location-dropdown-list');
    const choice = document.getElementById('location-location');
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

window.onload = () => {
    makeLocationList;
}