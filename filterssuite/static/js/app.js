/******************************************************************************
 *
 * File Name  : app.js
 * Type       : module
 * Description: main web app driver file
 * Author     : Ibrahim Mohamed
 *
 *******************************************************************************/

let boardWidth = 500,
    boardHeight = 500;

let drawZero = true;

/**  ------------------------------------------ Objects Declaration ------------------------------------------ **/

let currentFilter = new Filter();
let unitCircleBoard = new DrawingBoard('container', boardWidth, boardHeight);
let magnitudePlot = new PlottedSignal('plot-1', [0], [0], 'frequency (Hz)', 'magnitude (dB)');
let phasePlot = new PlottedSignal('plot-2', [0], [0], 'frequency (Hz)', 'phase (rad)');

/**  -------------------------------------- HTML DOM Elements Declaration -------------------------------------- **/

let downloadBtn = document.getElementById('download-btn');
let uploadBtn = document.getElementById('upload-btn');

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
                xActual =   xNormal * unitCircleBoard.getCircleRadius + unitCircleBoard.getCircleCenterX,
                yActual = - yNormal * unitCircleBoard.getCircleRadius + unitCircleBoard.getCircleCenterY;

            if (d[keys[0]] === 'z') {
                unitCircleBoard.createZero(xActual, yActual);
            }
            else if (d[keys[0]] === 'p') {
                unitCircleBoard.createPole(xActual, yActual);
            }
        })

        sendRequest();
    }
});

