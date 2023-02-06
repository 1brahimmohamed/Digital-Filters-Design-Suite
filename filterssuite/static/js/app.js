/******************************************************************************
 *
 * File Name  : app.js
 * Type       : module
 * Description: main web app driver file
 * Author     : Ibrahim Mohamed
 *
 *******************************************************************************/

const boardWidth    = 500,
      boardHeight   = 500;

let drawZero = true;
let selectedAllPassFilter = null;

/**  ------------------------------------------ Objects Declaration ------------------------------------------ **/

let currentFilter   = new Filter(),
    unitCircleBoard = new DrawingBoard('container', boardWidth, boardHeight),
    magnitudePlot   = new PlottedSignal('plot-1', [0], [0], 'frequency (Hz)', 'magnitude (dB)'),
    phasePlot       = new PlottedSignal('plot-2', [0], [0], 'frequency (Hz)', 'phase (rad)'),
    realTimePlot    = new DynamicPlot('plot-3', 'time (s)', 'magnitude (dB)');

/**  -------------------------------------- HTML DOM Elements Declaration -------------------------------------- **/

let downloadBtn         = document.getElementById('download-btn'),
    uploadBtn           = document.getElementById('upload-btn'),
    addAllPassBtn       = document.getElementById('add-all-pass-btn'),
    removeAllPassBtn    = document.getElementById('remove-all-pass-btn'),
    allPassValueBox     = document.getElementById('all-pass-value');

let mousePad = createMouseSignalPad();

const mouseDownHandler = (e) => {
    let xCurr = unitCircleBoard.stage.getPointerPosition().x,
        yCurr = unitCircleBoard.stage.getPointerPosition().y;


    let isDrawing = checkIfDrawing(xCurr, yCurr, unitCircleBoard.getZeroes, unitCircleBoard.getPoles);

    if (isDrawing) {
        if (drawZero) {
            unitCircleBoard.createZero(xCurr, yCurr);
        } else {
            unitCircleBoard.createPole(xCurr, yCurr);
        }
    }

    sendRequest();
}

unitCircleBoard.stage.on('mouseup', mouseDownHandler);
mousePad.on('mousemove', (e) => {
    realTimePlot.updateDynamicPlot(mousePad.getPointerPosition().x);
});

downloadBtn.addEventListener('click', (e) => {
    let filterCSV = currentFilter.exportFilterToCSV();
    downloadBtn.href = 'data:text/csv;charset=utf-8,' + encodeURI(filterCSV);
    downloadBtn.download = 'filter.csv';
});
uploadBtn.addEventListener('change', (e) => {
    let file = e.target.files[0],
        fileReader = new FileReader();

    fileReader.readAsText(file)
    fileReader.onload = function (ev) {
        let csv = ev.target.result,
            parsedFile = d3.csvParse(csv)

        let keys = Object.keys(parsedFile[0])

        unitCircleBoard.clearBoard();

        parsedFile.map((d) => {
            let xNormal = d[keys[1]],
                yNormal = d[keys[2]],
                xActual = xNormal * unitCircleBoard.getCircleRadius + unitCircleBoard.getCircleCenterX,
                yActual = -yNormal * unitCircleBoard.getCircleRadius + unitCircleBoard.getCircleCenterY;

            if (d[keys[0]] === 'z') {
                unitCircleBoard.createZero(xActual, yActual);
            } else if (d[keys[0]] === 'p') {
                unitCircleBoard.createPole(xActual, yActual);
            }
        })

        sendRequest();
    }
});

addAllPassBtn.addEventListener('click', (e) => {
    let filterID = Date.now(),
        filterValue = allPassValueBox.value;

    createAllPassFilterDiv(filterID, filterValue);
    setEventListenersOnAllPassList();

    // @TODO: add the filter to the current filter OB
    // currentFilter.addAllPassFilter(filterID, filterValue);
    // sendRequest();
});

removeAllPassBtn.addEventListener('click', (e) => {
    let allPassFiltersList = document.querySelectorAll('.allpass');

    allPassFiltersList.forEach(filter => {
        if (filter.classList.contains('selected')) {
            filter.remove();
        }
    });

    // @TODO currentFilter.removeAllPassFilter(selectedAllPassFilter);
    // sendRequest();
});




