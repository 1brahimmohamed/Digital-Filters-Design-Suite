/******************************************************************************
 *
 * File Name  : app.js
 * Type       : module
 * Description: main web app driver file
 * Author     : Ibrahim Mohamed
 *
 *******************************************************************************/



const boardWidth = 330,
    boardHeight = 330;

const padWidth = 333,
    padHeight = 205;

let drawZero = true;
let selectedAllPassFilter = null;

let realtimeSignal = []

/**  ------------------------------------------ Objects Declaration ------------------------------------------ **/

let currentFilter = new Filter(),
    unitCircleBoard = new DrawingBoard('container', boardWidth, boardHeight),
    magnitudePlot = new PlottedSignal('plot-1', [0], [0], 'frequency (Hz)', 'magnitude (dB)'),
    phasePlot = new PlottedSignal('plot-2', [0], [0], 'frequency (Hz)', 'phase (rad)'),
    realTimePlot = new DynamicPlot('plot-3', 'time (s)', 'magnitude (dB)');
realTimeFilteredPlot = new DynamicPlot('plot-4', 'time (s)', 'magnitude (dB)', [0, 50], [-100, 1000]);


let originalPhasePlot = new PlottedSignal('plot-page-1', [0], [0], 'freq', 'phase'),
    currentAllPassPlot = new PlottedSignal('plot-page-2', [0], [0], 'freq', 'phase');

/**  -------------------------------------- HTML DOM Elements Declaration -------------------------------------- **/

let downloadBtn = document.getElementById('download-btn'),
    uploadBtn = document.getElementById('upload-btn'),
    addAllPassBtn = document.getElementById('add-all-pass-btn'),
    removeAllPassBtn = document.getElementById('remove-all-pass-btn'),
    allPassValueBox = document.getElementById('all-pass-value');

let mousePad = createMouseSignalPad(padWidth, padHeight, 'pad');

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
let ct = 0;
unitCircleBoard.stage.on('mouseup', mouseDownHandler);
mousePad.on('mousemove', (e) => {
    if (currentFilter.getZeros.length !== 0 || currentFilter.getPoles.length !== 0) {
        if (ct > 4) {
            realtimeSignal.push(mousePad.getPointerPosition().x)
            if (realtimeSignal.length > 20) {
                realtimeSignal.shift();
            }
            realTimePlot.updateDynamicPlot(mousePad.getPointerPosition().x);
            filerSignalRequest(realtimeSignal)
            ct = 0;
        }
        ct++;
    }
});

downloadBtn.addEventListener('click', (e) => {
    let filterCSV = currentFilter.exportFilterToCSV();
    downloadBtn.href = 'data:text/csv;charset=utf-8,' + encodeURI(filterCSV);
    downloadBtn.download = 'filter.csv';
});
uploadBtn.addEventListener('change', (e) => {
    console.log(e.target.files)
    if (e.target.files.length !== 0) {
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
    }
});

addAllPassBtn.addEventListener('click', (e) => {
    let filterID = Date.now(),
        filterValue = allPassValueBox.value;

    createAllPassFilterDiv(filterID, filterValue);
    setEventListenersOnAllPassList();

    currentFilter.addAllPassFilter(
        {
            id: filterID,
            filterValue: math.complex(`${filterValue}`)
        });
    // sendRequest();
});

removeAllPassBtn.addEventListener('click', (e) => {
    let allPassFiltersList = document.querySelectorAll('.allpass');

    allPassFiltersList.forEach(filter => {
        if (filter.classList.contains('selected')) {
            filter.remove();
        }
    });
    currentFilter.removeAllPassFilter(selectedAllPassFilter);
    // sendRequest();
});




