document.getElementById('calculate-btn').addEventListener('click', function() {
    let length = document.getElementById('length').value;
    let width = document.getElementById('width').value;
    let thickness = document.getElementById('thickness').value;
    const pieces = document.getElementById('pieces').value;

    if(length && width && thickness && pieces) {
        length = eval(length) ;
        width = eval(width);
        thickness = eval(thickness);

        console.log(`Parsed values - Length: ${length}, Width: ${width}, Thickness: ${thickness}, Pieces: ${pieces}`);  // Log the parsed values

        const linearFeet = length * pieces;
        const boardFeet = (width * thickness * (length * 12) * pieces) / 144; // correct calculation for board feet

        console.log(`Calculated board feet: ${boardFeet}`);  // Log the calculated board feet

        document.getElementById('linear-feet').innerText = `Linear Feet: ${linearFeet}`;
        document.getElementById('board-feet').innerText = `Board Feet: ${boardFeet.toFixed(2)}`;
    } else {
        alert('Please enter valid values for length, width, thickness, and number of pieces!');
    }
});

