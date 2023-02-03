let boardWidth = 500,
    boardHeight = 500;

let drawZero = true;

let unitCircleBoard = new DrawingBoard('container', boardWidth, boardHeight);

const mousedownHandler = (e) => {
    let xCurr = unitCircleBoard.stage.getPointerPosition().x,
        yCurr = unitCircleBoard.stage.getPointerPosition().y;

    if (drawZero) {
        unitCircleBoard.createZero(xCurr, yCurr);
    }
    else {
        unitCircleBoard.createPole(xCurr, yCurr);
    }
}

unitCircleBoard.stage.on('mousedown', mousedownHandler);

