document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('calculate-btn').addEventListener('click', function() {
        let length = document.getElementById('length').value;
        let width = document.getElementById('width').value;
        let thickness = document.getElementById('thickness').value;
        const pieces = document.getElementById('pieces').value;

        if(length && width && thickness && pieces) {
            length = eval(length) * 12; // convert length from feet to inches
            width = eval(width);
            thickness = eval(thickness);

            const linearFeet = length * pieces / 12; // convert length back to feet for linear feet calculation
            const boardFeet = (width * thickness * length * pieces) / 144; // correct calculation for board feet

            document.getElementById('linear-feet').innerText = `Linear Feet: ${linearFeet.toFixed(2)}`;
            document.getElementById('board-feet').innerText = `Board Feet: ${boardFeet.toFixed(2)}`;
        } else {
            alert('Please enter valid values for length, width, thickness, and number of pieces!');
        }
    });

    document.getElementById('save-btn').addEventListener('click', function() {
        const label = document.getElementById('save-label').value;
        const linearFeet = document.getElementById('linear-feet').innerText;
        const boardFeet = document.getElementById('board-feet').innerText;

        if(label && linearFeet && boardFeet) {
            const calculation = {
                label: label,
                linearFeet: linearFeet,
                boardFeet: boardFeet
            };

            // Get existing calculations from local storage
            let calculations = JSON.parse(localStorage.getItem('calculations')) || [];

            // Add new calculation to the list
            calculations.push(calculation);

            // Save the updated list back to local storage
            localStorage.setItem('calculations', JSON.stringify(calculations));

            // Update the display of saved calculations
            displaySavedCalculations();

            alert('Calculation saved!');
        } else {
            alert('Please make a calculation before saving!');
        }
    });

    function displaySavedCalculations() {
        // Get the saved calculations from local storage
        const calculations = JSON.parse(localStorage.getItem('calculations')) || [];

        // Get a reference to the ul where we will display the saved calculations
        const calculationList = document.getElementById('calculation-list');

        // Clear the current contents
        calculationList.innerHTML = '';

        // Loop through the saved calculations and create a new li for each one
        calculations.forEach(calculation => {
            const li = document.createElement('li');
            li.innerText = `${calculation.label}: ${calculation.linearFeet}, ${calculation.boardFeet}`;
            calculationList.appendChild(li);
        });
    }

    // Call the function to display any saved calculations when the page loads
    displaySavedCalculations();
});
