fetch('dates.json')
    .then(response => response.json())
    .then(dates => {
        let readableDates = dates.map(date => {
            let parts = date.split('_');
            return `2023-${parts[0]}-${parts[1]}`;
        });

        let defaultDate = readableDates[readableDates.length - 1];
        let minDate = readableDates[0];
        let maxDate = readableDates[readableDates.length - 1];

        let datePicker = document.getElementById('datePicker');
        datePicker.min = minDate;
        datePicker.max = maxDate;
        datePicker.value = defaultDate;

        loadDateData(dates[dates.length - 1]);

        datePicker.addEventListener('change', function() {
            let selectedDate = this.value;
            let index = readableDates.indexOf(selectedDate);

            if (index !== -1) {
                loadDateData(dates[index]);
            } else {
                // If the selected date isn't found in the list
                let nextAvailableDate = getNextAvailableDate(selectedDate, readableDates, maxDate);
                datePicker.value = nextAvailableDate; 
                let newIndex = readableDates.indexOf(nextAvailableDate);
                loadDateData(dates[newIndex]);
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

function getNextAvailableDate(currentDate, readableDates, maxDate) {
    let nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    let nextDateString = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}-${String(nextDate.getDate()).padStart(2, '0')}`;

    while (readableDates.indexOf(nextDateString) === -1 && nextDateString !== maxDate) {
        nextDate.setDate(nextDate.getDate() + 1);
        nextDateString = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}-${String(nextDate.getDate()).padStart(2, '0')}`;
    }
    
    return (nextDateString === maxDate && readableDates.indexOf(nextDateString) === -1) ? currentDate : nextDateString;
}
