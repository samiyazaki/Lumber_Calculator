document.getElementById('add-btn').addEventListener('click', function() {
    const itemName = document.getElementById('item-name').value;
    const lengthsCutInput = document.getElementById('lengths-cut').value;
    const cutInto1Input = document.getElementById('cut-into-1').value;
    const cutInto2Input = document.getElementById('cut-into-2').value;

    if (itemName && lengthsCutInput && cutInto1Input && cutInto2Input) {
        const lengthsCut = lengthsCutInput.split(',').map(length => parseFloat(length.trim()));
        const cutInto1 = parseFloat(cutInto1Input.trim());
        const cutInto2 = parseFloat(cutInto2Input.trim());

        const result = checkEquality(lengthsCut, cutInto1, cutInto2);
        addPartToTable(itemName, lengthsCut, cutInto1, cutInto2, result);
    } else {
        alert('Please fill in all the fields.');
    }
});

function checkEquality(lengthsCut, cutInto1, cutInto2) {
    const totalLengthsCut = lengthsCut.reduce((sum, length) => sum + length, 0);
    const totalCutInto = cutInto1 * cutInto2;

    return totalLengthsCut === totalCutInto;
}

function addPartToTable(itemName, lengthsCut, cutInto1, cutInto2, result) {
    const tableBody = document.getElementById('cut-sheet-body');
    const row = document.createElement('tr');

    const itemNameCell = document.createElement('td');
    itemNameCell.innerText = itemName;
    row.appendChild(itemNameCell);

    const lengthsCutCell = document.createElement('td');
    lengthsCutCell.innerText = lengthsCut.join(', ');
    row.appendChild(lengthsCutCell);

    const cutIntoCell = document.createElement('td');
    cutIntoCell.innerText = `${cutInto1} × ${cutInto2}`;
    row.appendChild(cutIntoCell);

    const resultCell = document.createElement('td');
    resultCell.innerText = result ? '✓' : '✗';
    resultCell.style.color = result ? 'green' : 'red';
    row.appendChild(resultCell);

    tableBody.appendChild(row);
}

document.getElementById('export-btn').addEventListener('click', function() {
    const cutSheetTable = document.getElementById('cut-sheet-summary');
    const data = [
        ['Item Name', 'Lengths Cut', 'Cut Into', 'Result'],
    ];

    for (let i = 0; i < cutSheetTable.rows.length - 1; i++) {
        const row = cutSheetTable.rows[i + 1];
        const itemName = row.cells[0].innerText;
        const lengthsCut = row.cells[1].innerText;
        const cutInto = row.cells[2].innerText;
        const result = row.cells[3].innerText === '✓' ? 'Equal' : 'Unequal';
        data.push([itemName, lengthsCut, cutInto, result]);
    }

    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, sheet, 'Cut Sheet Data');
    const excelFile = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAsExcelFile(excelFile, 'cut_sheet_data.xlsx');
});

function saveAsExcelFile(data, filename) {
    const blob = new Blob([data], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Get the necessary elements from the DOM
const addItemButton = document.getElementById('add-item-btn');
const calculateButton = document.getElementById('calculate-btn');
const cutSheetContainer = document.getElementById('cut-sheet');
const exportButton = document.getElementById('export-btn');
const saveButton = document.getElementById('save-btn');
const calculationList = document.getElementById('calculation-list');

// Add event listeners to buttons
addItemButton.addEventListener('click', addItem);
calculateButton.addEventListener('click', calculateCutSheet);
exportButton.addEventListener('click', exportToExcel);
saveButton.addEventListener('click', saveCalculation);

// Global variable to store the cut sheet data
let cutSheetData = [];

// Function to add a new item to the cut sheet
function addItem() {
    const itemsContainer = document.getElementById('items-container');
    const itemIndex = itemsContainer.childElementCount + 1;

    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item');

    const nameLabel = document.createElement('label');
    nameLabel.setAttribute('for', `item-${itemIndex}`);
    nameLabel.textContent = `Item ${itemIndex}:`;

    const nameInput = document.createElement('input');
    nameInput.setAttribute('type', 'text');
    nameInput.setAttribute('id', `item-${itemIndex}`);
    nameInput.classList.add('item-input');
    nameInput.setAttribute('placeholder', 'Item name');
    nameInput.required = true;

    const lengthInput = document.createElement('input');
    lengthInput.setAttribute('type', 'number');
    lengthInput.setAttribute('id', `length-${itemIndex}`);
    lengthInput.classList.add('item-input');
    lengthInput.setAttribute('placeholder', 'Length');
    lengthInput.required = true;

    itemDiv.appendChild(nameLabel);
    itemDiv.appendChild(nameInput);
    itemDiv.appendChild(lengthInput);

    itemsContainer.appendChild(itemDiv);
}

// Function to calculate the cut sheet
function calculateCutSheet() {
    cutSheetData = [];

    const itemsContainer = document.getElementById('items-container');
    const itemInputs = itemsContainer.getElementsByClassName('item-input');

    for (let i = 0; i < itemInputs.length; i += 2) {
        const nameInput = itemInputs[i];
        const lengthInput = itemInputs[i + 1];

        const name = nameInput.value.trim();
        const length = parseFloat(lengthInput.value);

        if (name && !isNaN(length)) {
            cutSheetData.push({
                name,
                length
            });
        }
    }

    displayCutSheet();
}

// Function to display the cut sheet
function displayCutSheet() {
    cutSheetContainer.innerHTML = '';

    cutSheetData.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.textContent = `${item.name}: ${item.length} ft`;
        cutSheetContainer.appendChild(itemDiv);
    });
}

// Function to export the cut sheet to Excel
function exportToExcel() {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(cutSheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Cut Sheet');
    XLSX.writeFile(workbook, 'cut_sheet.xlsx');
}

// Function to save the current calculation
function saveCalculation() {
    const savedCalculation = {
        data: cutSheetData
    };

    // Get existing calculations from local storage
    let calculations = JSON.parse(localStorage.getItem('calculations')) || [];

    // Add new calculation to the list
    calculations.push(savedCalculation);

    // Save the updated list back to local storage
    localStorage.setItem('calculations', JSON.stringify(calculations));

    displaySavedCalculations();

    // Clear the cut sheet data and reset the input fields
    cutSheetData = [];
    document.getElementById('items-container').innerHTML = '';

    alert('Calculation saved!');
}

// Function to display the saved calculations
function displaySavedCalculations() {
    // Get the saved calculations from local storage
    const calculations = JSON.parse(localStorage.getItem('calculations')) || [];

    // Clear the current contents of the calculation list
    calculationList.innerHTML = '';

    calculations.forEach((calculation, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `Calculation ${index + 1}: ${calculation.data.length} items`;
        calculationList.appendChild(listItem);
    });
}

// Call the function to display any saved calculations when the page loads
displaySavedCalculations();
