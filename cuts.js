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
