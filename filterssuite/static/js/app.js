/******************************************************************************
 *
 * File Name  : app.js
 * Type       : module
 * Description: main web app driver file
 * Author     : Ibrahim Mohamed
 *
 *******************************************************************************/


let circleDiv = document.getElementById('container'),
    padDiv = document.getElementById('pad');

const boardWidth = circleDiv.offsetWidth,
    boardHeight = circleDiv.offsetHeight;

console.log(boardWidth, boardHeight)

const padWidth = padDiv.offsetWidth,
    padHeight = padDiv.offsetHeight;

let drawZero = true;
let selectedAllPassFilter = null;

let mouseRealtimeSignal = [],
    ImportedRealtimeSignal = [];

let importedSignal = {
    x: [],
    y: []
}

let i = 0;
let realtimeSignalInterval;
let ct = 0;
let isDrawing = false,
    mousePos = {
        x: 0,
        y: 0
    }

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

let mousePad = createMouseSignalPad(padWidth, padHeight, 'pad');

const mouseDownHandler = (e) => {
    let xCurr = unitCircleBoard.stage.getPointerPosition().x,
        yCurr = unitCircleBoard.stage.getPointerPosition().y;

    mousePos = {
        x: xCurr,
        y: yCurr
    }
    isDrawing = checkIfDrawing(xCurr, yCurr, unitCircleBoard.getZeroes, unitCircleBoard.getPoles);
}
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
const mousePadHandler = (e) => {
    if (currentFilter.getZeros.length !== 0 || currentFilter.getPoles.length !== 0) {
        if (ct > 4) {
            mouseRealtimeSignal.push(mousePad.getPointerPosition().x)
            if (mouseRealtimeSignal.length > 20) {
                mouseRealtimeSignal.shift();
            }
            realTimePlot.updateDynamicPlot(mousePad.getPointerPosition().x);
            filerSignalRequest(mouseRealtimeSignal)
            ct = 0;
        }
        ct++;
    }
}
unitCircleBoard.stage.on('mousedown', mouseDownHandler);
unitCircleBoard.stage.on('mouseup', mouseUpHandler);
mousePad.on('mousemove', mousePadHandler);

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







