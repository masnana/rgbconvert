// Function to handle color input change
const hexInput = document.getElementById("hexInput");

// Function to validate HEX color codes
function isValidHex(hex) {
    if (typeof hex !== 'string') {
        return false;
    }
    const hexPattern = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
    return hexPattern.test(hex);
}

// Function to convert RGB to HEX
function rgbToHex(rgb) {
    // Extract the RGB values
    const rgbArray = rgb.match(/\d+/g);
    const r = parseInt(rgbArray[0], 10);
    const g = parseInt(rgbArray[1], 10);
    const b = parseInt(rgbArray[2], 10);

    // Convert to HEX and return
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

// Function to convert HEX to RGB
function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    }
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    return { red: r, green: g, blue: b };
}

// Function to convert RGB value to percentage
function toPercent(v) {
    return (v / 255).toFixed(6);
}

// Function to copy value to clipboard
function copyValue(percentId) {
    const copyText = document.getElementById(percentId).innerHTML;
    navigator.clipboard.writeText(copyText);
}

// Function to update color percentage displays
function updateColorPercent(inputIds, percentIds) {
    inputIds.forEach((inputId, index) => {
        const input = document.getElementById(inputId);
        const percentDisplay = document.getElementById(percentIds[index]);

        function update() {
            let value = Math.min(parseInt(input.value) || 0, 255);
            input.value = value;
            percentDisplay.innerHTML = toPercent(value);
                        
            let hexValue = rgbToHex(`rgb(${document.getElementById("rInput").value}, ${document.getElementById("gInput").value}, ${document.getElementById("bInput").value}`); // Convert rgb to hex
            hexInput.value = hexValue;
        }

        input.addEventListener("input", update);
        update();
    });
    
}

// Function to trigger input event
function triggerInputEvent(inputId) {
    const input = document.getElementById(inputId);
    const event = new Event('input', { bubbles: true });
    input.dispatchEvent(event);
}

// Initialize color percentage displays
updateColorPercent(["rInput", "gInput", "bInput"], ["redPercent", "greenPercent", "bluePercent"]);

hexInput.addEventListener("input", function (event) {
    const hexValue = event.target.value;

    if (!isValidHex(hexValue)) return;

    const color = hexToRgb(hexValue);

    document.getElementById("rInput").value = color.red;
    document.getElementById("gInput").value = color.green;
    document.getElementById("bInput").value = color.blue;

    triggerInputEvent("rInput");
    triggerInputEvent("gInput");
    triggerInputEvent("bInput");
});


// Function to append colors to the DOM
function appendColors() {
    fetch('colors.json') // Replace with the path to your JSON file
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(colorsData => {
            const colorsContainer = document.querySelector('.colors-container');
            const fragment = document.createDocumentFragment(); // Create a document fragment

            for (const key in colorsData) {
                const group = document.createElement("div");
                const colors = document.createElement("div");
                const label = document.createElement("span");
                group.className = "colorgroup";
                label.textContent = key.toUpperCase();
                colors.className = "colors";
                label.className = "colorlabel";
                group.appendChild(label);
                group.appendChild(colors);
                
                colorsData[key].forEach(color => {
                    const colorDiv = document.createElement('div');
                    colorDiv.className = 'color';
                    colorDiv.style.backgroundColor = color.color;

                    const tooltipSpan = document.createElement('span');
                    tooltipSpan.className = 'tooltiptext';
                    tooltipSpan.textContent = color.desc;

                    colorDiv.appendChild(tooltipSpan);
                    colors.appendChild(colorDiv);

                    // colorDiv.addEventListener('click', function() {
                    //     hexInput.value = color.color;
                    //     triggerInputEvent(hexInput.id);
                    // });
                });

                fragment.appendChild(group); // Append colors div to fragment
            }

            colorsContainer.appendChild(fragment); // Append fragment to container in one go

			colorsContainer.addEventListener('click', function(event) {
                const colorDiv = event.target.closest('.color');
                if (colorDiv) {
					const colorCode = colorDiv.style.backgroundColor;
					const hexValue = rgbToHex(colorCode); // Convert rgb to hex
					hexInput.value = hexValue;
					triggerInputEvent(hexInput.id);
                }
            });
        })
        .catch(error => console.error('Error loading JSON file:', error));
}

// Call the function to append colors
appendColors();