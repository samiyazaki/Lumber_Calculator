document.getElementById('add-btn').addEventListener('click', function() {
    const lengthInput = document.getElementById('length');
    const piecesInput = document.getElementById('pieces');
    const length = lengthInput.value;
    const pieces = piecesInput.value;

    if (length && pieces) {
        const tallyBody = document.getElementById('tally-body');

        const row = document.createElement('tr');
        const labelCell = document.createElement('td');
        const lengthCell = document.createElement('td');
        const piecesCell = document.createElement('td');
        const deleteCell = document.createElement('td');
        const deleteBtn = document.createElement('button');

        labelCell.innerText = `Piece ${tallyBody.childElementCount + 1}`;
        lengthCell.innerText = length;
        piecesCell.innerText = pieces;
        deleteBtn.innerText = 'Delete';

        deleteBtn.classList.add('delete-btn');

        row.appendChild(labelCell);
        row.appendChild(lengthCell);
        row.appendChild(piecesCell);
        deleteCell.appendChild(deleteBtn);
        row.appendChild(deleteCell);

        tallyBody.appendChild(row);

        lengthInput.value = '';
        piecesInput.value = '';
    } else {
        alert('Please enter a length and number of pieces!');
    }
});

document.addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('delete-btn')) {
        const row = event.target.closest('tr');
        row.remove();
    }
});

document.getElementById('clear-btn').addEventListener('click', function() {
    const tallyBody = document.getElementById('tally-body');
    tallyBody.innerHTML = '';
});

document.getElementById('calculate-btn').addEventListener('click', function() {
    const tallyBody = document.getElementById('tally-body');
    const rows = tallyBody.getElementsByTagName('tr');

    let totalLength = 0;
    let totalPieces = 0;

    for (let i = 0; i < rows.length; i++) {
        const lengthCell = rows[i].getElementsByTagName('td')[1];
        const piecesCell = rows[i].getElementsByTagName('td')[2];
        const length = parseFloat(lengthCell.innerText);
        const pieces = parseFloat(piecesCell.innerText);

        if (!isNaN(length) && !isNaN(pieces)) {
            totalLength += length * pieces;
            totalPieces += pieces;
        }
    }

    const totalDisplay = document.getElementById('total');
    totalDisplay.innerText = `Total Length: ${totalLength.toFixed(2)} feet | Total Pieces: ${totalPieces}`;
});

document.getElementById('export-btn').addEventListener('click', function() {
    // Get the tally data from the table
    const tallyTable = document.getElementById('tally-summary');
    const data = [
        ['Label', 'Length (feet)', 'Number of Pieces', 'Total Length (feet)', 'Total Pieces'],
    ];

    let totalLength = 0;
    let totalPieces = 0;

    for (let i = 0; i < tallyTable.rows.length - 1; i++) {
        const row = tallyTable.rows[i + 1];
        const label = row.cells[0].innerText;
        const length = row.cells[1].innerText;
        const pieces = row.cells[2].innerText;
        const itemTotalLength = parseFloat(length) * parseFloat(pieces);
        totalLength += itemTotalLength;
        totalPieces += parseFloat(pieces);
        data.push([label, length, pieces, itemTotalLength.toFixed(2), '']);
    }

    data.push(['', '', '', totalLength.toFixed(2), totalPieces]);

    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.aoa_to_sheet(data);

    // Add the sheet to the workbook
    XLSX.utils.book_append_sheet(workbook, sheet, 'Tally Data');

    // Convert the workbook to an Excel file
    const excelFile = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Save the Excel file
    saveAsExcelFile(excelFile, 'tally_data.xlsx');
});

document.getElementById('save-tally-btn').addEventListener('click', function() {
    const tallyTable = document.getElementById('tally-summary');
    const tallyRows = tallyTable.rows;
    const savedTalliesList = document.getElementById('saved-tallies-list');
    const savedTally = document.createElement('li');
    const savedTallyTitle = document.createElement('h3');
    const savedTallyTable = document.createElement('table');

    savedTallyTitle.innerText = `Tally ${savedTalliesList.childElementCount + 1}`;
    savedTallyTable.innerHTML = tallyTable.innerHTML;

    savedTally.appendChild(savedTallyTitle);
    savedTally.appendChild(savedTallyTable);
    savedTalliesList.appendChild(savedTally);

    // Clear the tally table
    const tallyBody = document.getElementById('tally-body');
    tallyBody.innerHTML = '';
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
