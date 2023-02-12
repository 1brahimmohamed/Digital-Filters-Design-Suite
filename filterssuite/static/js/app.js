/******************************************************************************
 *
 * File Name  : app.js
 * Type       : module
 * Description: main web app driver file
 * Author     : Ibrahim Mohamed
 *
 *******************************************************************************/

/**  ------------------------------------------ Global Variables ------------------------------------------ **/

// board & mouse pad dimensions variables (constant values throughout the app [only changed & initialized once])
const
    circleDiv = document.getElementById('container'),
    padDiv = document.getElementById('pad'),
    boardWidth = circleDiv.offsetWidth,
    boardHeight = circleDiv.offsetHeight,
    padWidth = padDiv.offsetWidth,
    padHeight = padDiv.offsetHeight;


let drawZero = true,                    // flag to determine if the user is drawing a zero or a pole
    isDrawing = false;                  // flag to determine if the user is drawing or dragging

let mousePad = null;                    // variable to store the mouse pad object
let selectedAllPassFilter = null;       // variable to store the selected all-pass filter

let mouseRealtimeSignal = [],
    ImportedRealtimeSignal = [];

// objects to store the current mouse position and the imported signal
let
    importedSignal = {
        x: [],
        y: []
    },
    mousePos = {
        x: 0,
        y: 0
    }

let realtimeSignalInterval;     // variable to store the setInterval function of the realtime signal

let i = 0;                      // variable to store the current index of the imported signal to view it as realtime
let counter = 0;                // variable to store counts of the mouse pad to do sampling

/**  ------------------------------------------ Objects Declaration ------------------------------------------ **/

let currentFilter           = new Filter(),
    unitCircleBoard         = new DrawingBoard('container', boardWidth, boardHeight),
    magnitudePlot           = new PlottedSignal('plot-1', [0], [0], 'frequency', 'magnitude', '#3f98ce'),
    phasePlot               = new PlottedSignal('plot-3', [0], [0], 'frequency', 'phase', '#f64200'),
    realTimePlot            = new DynamicPlot('plot-2', 'time (s)', 'magnitude'),
    realTimeFilteredPlot    = new DynamicPlot('plot-4', 'time (s)', 'magnitude', '#089841', [0, 50], [-100, 1000]);


let originalPhasePlot   = new PlottedSignal('plot-page-1', [0], [0], 'frequency', 'phase', '#f64200'),
    currentAllPassPlot  = new PlottedSignal('plot-page-2', [0], [0], 'frequency', 'phase', '#810b34');

/**  -------------------------------------- HTML DOM Elements Declaration -------------------------------------- **/

const   downloadBtn         = document.getElementById('filter-download-btn'),
        uploadFilterBtn     = document.getElementById('filter-upload-btn'),
        addAllPassBtn       = document.getElementById('add-all-pass-btn'),
        removeAllPassBtn    = document.getElementById('remove-all-pass-btn'),
        allPassValueBox     = document.getElementById('all-pass-value'),
        importSignalBtn     = document.getElementById('import-signal-btn'),
        clearAllPassBtn     = document.getElementById('clear-all-pass');


/**  ---------------------------------------------- Functions  ---------------------------------------------- **/


/**
 * function to handle the mouse down event on the board
 * @param {event} e
 * @returns {void}
 * **/
const mouseDownHandler = (e) => {
    let xCurr = unitCircleBoard.stage.getPointerPosition().x,
        yCurr = unitCircleBoard.stage.getPointerPosition().y;

    mousePos = {
        x: xCurr,
        y: yCurr
    }
    isDrawing = checkIfDrawing(xCurr, yCurr, unitCircleBoard.getZeroes, unitCircleBoard.getPoles);
}

/**
 * function to handle the mouse up event on the board
 * @param {event} e
 * @returns {void}
 * **/

const mouseUpHandler = (e) => {
    if (isDrawing) {
        if (drawZero) {
            unitCircleBoard.createZero(mousePos.x, mousePos.y);
        } else {
            unitCircleBoard.createPole(mousePos.x, mousePos.y);
        }
    }
    sendRequest();
}

/**
 * function to handle the mouse move event on the mouse pad
 * **/
const mousePadHandler = (e) => {
    if (currentFilter.getZeros.length !== 0 || currentFilter.getPoles.length !== 0) {
        if (counter > 4) {
            mouseRealtimeSignal.push(mousePad.getPointerPosition().x)
            if (mouseRealtimeSignal.length > 20) {
                mouseRealtimeSignal.shift();
            }
            realTimePlot.updateDynamicPlot(mousePad.getPointerPosition().x);
            filerSignalRequest(mouseRealtimeSignal)
            counter = 0;
        }
        counter++;
    }
}


/**  ------------------------------------------ Buttons  Actions ------------------------------------------ **/

downloadBtn.addEventListener('click', (e) => {
    let filterCSV = currentFilter.exportFilterToCSV();
    downloadBtn.href = 'data:text/csv;charset=utf-8,' + encodeURI(filterCSV);
    downloadBtn.download = 'filter.csv';
});

uploadFilterBtn.addEventListener('change', (e) => {
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

                // convert the normal coordinates to actual coordinates on the board
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
    if (allPassValueBox.value !== '' && currentFilter.getPhaseResponse.x.length > 1){
        let filterID = Date.now(),
            filterValue = allPassValueBox.value.replace("j", "i");

        createAllPassFilterDiv(filterID, allPassValueBox.value);
        setEventListenersOnAllPassList();

        currentFilter.addAllPassFilter(
            {
                id: filterID,
                filterValue: math.complex(`${filterValue}`)
            });

        sendRequest();
    }
});

removeAllPassBtn.addEventListener('click', (e) => {
    let allPassFiltersList = document.querySelectorAll('.allpass');

    allPassFiltersList.forEach(filter => {
        if (filter.classList.contains('selected')) {
            filter.remove();
        }
    });
    currentFilter.removeAllPassFilter(selectedAllPassFilter);
    sendRequest();
});

clearAllPassBtn.addEventListener('click', (e) => {
    let allPassFiltersList = document.querySelectorAll('.allpass');

    allPassFiltersList.forEach(filter => {
        filter.remove();
    });
    currentFilter.clearAllPass();
    sendRequest();
});

importSignalBtn.addEventListener('change', (e) => {
    if (e.target.files.length !== 0) {
        importedSignal = {x: [], y: []};
        ImportedRealtimeSignal = [];

        let file = e.target.files[0],
            fileReader = new FileReader();

        fileReader.readAsText(file)
        fileReader.onload = function (ev) {
            let csv = ev.target.result,
                parsedFile = d3.csvParse(csv)

            let keys = Object.keys(parsedFile[0])

            parsedFile.map((d) => {
                importedSignal.x.push(d[keys[0]]);
                importedSignal.y.push(d[keys[1]]);
            })
        }
        playPauseBtnIcon.classList.remove('bx-play-circle');
        playPauseBtnIcon.classList.add('bx-pause-circle');
        i = 0;
        startInterval()
    }
});

allPassValueBox.addEventListener('input', (e) => {
    if (allPassValueBox.value === ''){
        currentAllPassPlot.updatePlot({
            x: [0],
            y: [0],
        });
    }
    else{
        let strVal = allPassValueBox.value.replace("j", "i");
        console.log(strVal)
        let val = math.complex(strVal);
        getAllPassRequest(val);
    }
});

const startInterval = () => {
    realtimeSignalInterval = setInterval(() => {
        ImportedRealtimeSignal.push(parseFloat(importedSignal.y[i]))
        if (ImportedRealtimeSignal.length > 20) {
            ImportedRealtimeSignal.shift();
        }

        if (i < importedSignal.y.length) {
            realTimePlot.updateDynamicPlot(importedSignal.y[i]);
            filerSignalRequest(ImportedRealtimeSignal)
            i++;
        } else {
            clearInterval(realtimeSignalInterval)
        }
    }, 10);
}


const main = () => {
    // catalog images id setup
    setIDForImages();
    setEventListenersOnAllPassList();
    mousePad = createMouseSignalPad(padWidth, padHeight, 'pad');

    // add event listeners to the boards (drawing & mouse pad)
    unitCircleBoard.stage.on('mousedown', mouseDownHandler);
    unitCircleBoard.stage.on('mouseup', mouseUpHandler);
    mousePad.on('mousemove', mousePadHandler);
}

// run the main function (program entry point)
main();




