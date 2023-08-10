// Fetch the dates first
fetch('dates.json')
    .then(response => response.json())
    .then(dates => {
        // Convert the dates into a readable format
        let readableDates = dates.map(date => {
            let parts = date.split('_');
            return `2023-${parts[0]}-${parts[1]}`; 
        });

        // The last date will be the default date
        let defaultDate = readableDates[readableDates.length - 1];

        // Set the default date
        document.getElementById('datePicker').value = defaultDate;

        // Load the data for the default date
        loadDateData(dates[dates.length - 1]);

        // Attach an event listener to the date picker
        document.getElementById('datePicker').addEventListener('change', function() {
            let selectedDate = this.value;
            let index = readableDates.indexOf(selectedDate);
            if (index !== -1) {
                loadDateData(dates[index]);
            }
        });

    })
    .catch(e => {
        console.log('There has been a problem with your fetch operation: ' + e.message);
    });

function loadDateData(date) {
    fetch(`output-${date}.txt`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('output').textContent = data;
        })
        .catch(error => {
            console.log('Error loading date data: ' + error.message);
        });
}
