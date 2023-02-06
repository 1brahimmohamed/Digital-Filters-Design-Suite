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

        if (
            x_current >= polesArr[i].x() - offset &&
            x_current < polesArr[i].x() + polesArr[i].width() + offset &&
            y_current >= polesArr[i].y() - offset &&
            y_current < polesArr[i].y() + polesArr[i].height() + offset
        ) {
            return false;
        }
    }
    return true;
}


/**
 * Function to create the realtime mouse signal pad
 * @returns {Konva.Stage}
 */
const createMouseSignalPad = __ => {
    let stg = new Konva.Stage({
        container: 'pad',
        width: 400,
        height: 200,
    });
    let layer = new Konva.Layer();

    let background = new Konva.Rect({
        x: 0,
        y: 0,
        width: 400,
        height: 200,
        cornerRadius: 10,
        fill: 'DimGrey',
    });
    layer.add(background);
    stg.add(layer);

    return stg;
}

/**
 * Function to draw a circle on the canvas
 * @param {number} circX            - x coordinate of the circle
 * @param {number} circY            - y coordinate of the circle
 * @param {number} circRadius       - radius of the circle
 * @param {number} circStroke       - stroke color of the circle
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
    circStrokeWidth = 2,
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
 * @param {number} linePoints       - array of points that make the line
 * @param lineDraggable             - is the line draggable
 * @param {number} lineStroke       - stroke color of the line
 * @param {number} lineStrokeWidth  - stroke width of the line
 * @param {string} lineCap          - line cap
 * @param {string} lineJoin         - line join
 * @returns {Konva.Line}
 **/
const drawLine = (
    linePoints,
    lineDraggable = false,
    lineStroke = shapesDefaultColor,
    lineStrokeWidth = 2,
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
 * @returns {Konva.Group}
 **/
const drawPole = (xPos, yPos) => {

    let shapeLength = 10,
        shapeWidth = 10;

    // let poleX = new Konva.Shape({
    //     sceneFunc: function (context, shape) {
    //         context.beginPath();
    //         context.moveTo(xPos - shapeWidth/2, yPos - shapeLength/2);
    //         context.lineTo(xPos + shapeWidth/2, yPos + shapeLength/2);
    //         context.moveTo(xPos + shapeWidth/2, yPos - shapeLength/2);
    //         context.lineTo(xPos - shapeWidth/2, yPos + shapeLength/2);
    //         context.closePath();
    //
    //         // (!) Konva specific method, it is very important
    //         context.fillStrokeShape(shape);
    //     },
    //     stroke: 'black',
    //     strokeWidth: 2,
    //     draggable: false,
    // });

    let poleContainer = new Konva.Rect({
        x: xPos - shapeWidth / 2,
        y: yPos - shapeLength / 2,
        width: 12,
        height: 12,
        draggable: true,
        fill: 'black',
    });

    let poleGroup = new Konva.Group({
        x: xPos,
        y: yPos,
        draggable: false,
        fill: 'red',
    });

    //
    // poleGroup.add(poleContainer);
    // console.log('Pole Group Pos', poleGroup.x(), poleGroup.y())
    // console.log(poleGroup)

    return poleContainer;
}


