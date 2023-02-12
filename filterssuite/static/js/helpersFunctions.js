/************************************************************************************
 *
 * File Name  : drawShapes.js
 * Type       : Module
 * Description: This file contains the functions that draw Konva shapes on the canvas
 * Author     : Ibrahim Mohamed
 *
 ************************************************************************************/

let shapesDefaultColor = 'black'

/**
 * Function to check drawing on the canvas
 * @param {number} x_current - x coordinate of the mouse
 * @param {number} y_current - y coordinate of the mouse
 * @param {array} zerosArr   - array of zeros
 * @param {array} polesArr   - array of poles
 * @returns {boolean}
 **/
const checkIfDrawing = (x_current, y_current, zerosArr, polesArr) => {

    // check if the mouse position is on one of our drawn shapes
    let offset = 1;

    for (let i = 0; i < zerosArr.length; i++) {
        let radius = zerosArr[i].radius(),
            xCenter = zerosArr[i].x(),
            yCenter = zerosArr[i].y();

        if (
            x_current >= xCenter - radius - offset &&
            x_current < xCenter + radius + offset &&
            y_current >= yCenter - radius - offset &&
            y_current < yCenter + radius + offset
        ) {

            return false;
        }
    }

    for (let i = 0; i < polesArr.length; i++) {

        let poleX = polesArr[i].getAttr("actualX"),
            poleY = polesArr[i].getAttr("actualY"),
            width = polesArr[i].getAttr("actualWidth")/2;

        if (
            x_current >= poleX - width - offset &&
            x_current < poleX + width + offset &&
            y_current >= poleY - width - offset &&
            y_current < poleY + width + offset
        ) {
            return false;
        }
    }
    return true;
}


/**
 * Function to create the realtime mouse signal pad
 * @param {number} padWidth  - width of the pad
 * @param {number} padHeight - height of the pad
 * @param {string} padContainer - id of the container
 * @returns {Konva.Stage}
 */
const createMouseSignalPad = (padWidth, padHeight, padContainer) => {
    let stg = new Konva.Stage({
        container: padContainer,
        width: padWidth,
        height: padHeight,
    });
    let layer = new Konva.Layer();

    let padImg = new Image();
    padImg.src = '../static/images/pad.png';

    let img = new Konva.Image({
        x: 0,
        y: 0,
        image: padImg,
        width: padWidth,
        height: padHeight,
    });

    layer.add(img);
    stg.add(layer);

    return stg;
}

/**
 * Function to draw a circle on the canvas
 * @param {number} circX            - x coordinate of the circle
 * @param {number} circY            - y coordinate of the circle
 * @param {number} circRadius       - radius of the circle
 * @param {string} circStroke       - stroke color of the circle
 * @param {boolean} circDraggable   - is the circle draggable
 * @param {number} circStrokeWidth  - stroke width of the circle
 * @returns {Konva.Circle}
 **/
const drawCircle = (
    circX,
    circY,
    circRadius = 0,
    circDraggable = false,
    circStroke = 'black',
    circStrokeWidth = 1.7,
) => {
    return new Konva.Circle({
        x: circX,
        y: circY,
        radius: circRadius,
        draggable: circDraggable,
        stroke: circStroke,
        strokeWidth: circStrokeWidth,
    })
}

/**
 * Function to draw a line on the canvas
 * @param {array} linePoints       - array of points that make the line
 * @param lineDraggable             - is the line draggable
 * @param {string} lineStroke       - stroke color of the line
 * @param {number} lineStrokeWidth  - stroke width of the line
 * @param {string} lineCap          - line cap
 * @param {string} lineJoin         - line join
 * @returns {Konva.Line}
 **/
const drawLine = (
    linePoints,
    lineDraggable = false,
    lineStroke = shapesDefaultColor,
    lineStrokeWidth = 1,
    lineCap = 'round',
    lineJoin = 'round'
) => {
    return new Konva.Line({
        points: linePoints,
        stroke: lineStroke,
        strokeWidth: lineStrokeWidth,
        lineCap: lineCap,
        lineJoin: lineJoin,
        draggable: lineDraggable,
    })
}

/**
 * Function to draw a pole on the canvas
 * @param {number} xPos      - x coordinate of the pole
 * @param {number} yPos      - y coordinate of the pole
 * @returns {Konva.Shape}
 **/
const drawPole = (xPos, yPos) => {

    let shapeLength = 10,
        shapeWidth = 10;

    let poleX = new Konva.Shape({
        sceneFunc: function (context, shape) {
            context.beginPath();
            context.moveTo(xPos - shapeWidth/2, yPos - shapeLength/2);
            context.lineTo(xPos + shapeWidth/2, yPos + shapeLength/2);
            context.moveTo(xPos + shapeWidth/2, yPos - shapeLength/2);
            context.lineTo(xPos - shapeWidth/2, yPos + shapeLength/2);
            context.closePath();

            // (!) Konva specific method, it is very important
            context.fillStrokeShape(shape);
        },
        stroke: 'black',
        strokeWidth: 2,
        draggable: true
    });

    poleX.setAttr("startX", xPos);
    poleX.setAttr("actualX", xPos);
    poleX.setAttr("startY", yPos);
    poleX.setAttr("actualY", yPos);
    poleX.setAttr("actualWidth", shapeWidth);

    poleX.on('dragend', () => {
        poleX.setAttr("actualX", poleX.getAttr("startX") + poleX.x());
        poleX.setAttr("actualY", poleX.getAttr("startY") + poleX.y());
        sendRequest();
    });

    return poleX;
}

/**
 * function to delete a zero on the canvas
 * @param {Konva.Circle} zero
 * @returns {void}
 * **/
const deleteZero = (zero) => {
    let index = unitCircleBoard.getZeroes.indexOf(zero);
    unitCircleBoard.setZeroes = unitCircleBoard.getZeroes.filter((zero, i) => i !== index);
    sendRequest()
}

/**
 * function to delete a pole on the canvas
 * @param {Konva.Shape} pole
 * @returns {void}
 * **/
const deletePole = (pole) => {
    let index = unitCircleBoard.getPoles.indexOf(pole);
    unitCircleBoard.setPoles = unitCircleBoard.getPoles.filter((pole, i) => i !== index);
    sendRequest()
}

