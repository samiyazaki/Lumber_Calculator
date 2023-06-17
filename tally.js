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

        labelCell.innerText = `Piece ${tallyBody.childElementCount + 1}`;
        lengthCell.innerText = length;
        piecesCell.innerText = pieces;

        row.appendChild(labelCell);
        row.appendChild(lengthCell);
        row.appendChild(piecesCell);

        tallyBody.appendChild(row);

        lengthInput.value = '';
        piecesInput.value = '';
    } else {
        alert('Please enter a length and number of pieces!');
    }
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
