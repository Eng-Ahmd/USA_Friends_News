// Create a slider
let slider = document.createElement('input');
slider.type = 'range';
slider.id = 'dateSlider';
slider.style.width = '50%';
slider.style.display = 'block';
document.body.insertBefore(slider, document.getElementById('output'));

// Create an element to display the current date
let currentDate = document.createElement('p');
currentDate.id = 'currentDate';
document.body.insertBefore(currentDate, document.getElementById('output'));

fetch('dates.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(dates => {
        dates.sort(); // Ensure the dates are sorted in ascending order

        slider.min = 0;
        slider.max = dates.length - 1;
        slider.value = dates.length - 1;
        slider.step = 1;

        // Display the current date
        currentDate.textContent = `Date: ${dates[slider.value]}`;

        let fetchPromises = dates.map(date => {
            return fetch(`output-${date}.txt`).then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            }).catch(() => null);
        });

        let outputData = {};
        let lastSuccessfulData = '';

        Promise.all(fetchPromises).then(data => {
            for (let i = 0; i < dates.length; i++) {
                if (data[i] !== null) {
                    lastSuccessfulData = data[i];
                }
                outputData[dates[i]] = lastSuccessfulData;
            }

            slider.addEventListener('input', function() {
                document.getElementById('output').textContent = outputData[dates[this.value]];
                currentDate.textContent = `Date: ${dates[this.value]}`;
            });

            document.getElementById('output').textContent = outputData[dates[dates.length - 1]];
        });
    })
    .catch(e => {
        console.log('There has been a problem with your fetch operation: ' + e.message);
    });
