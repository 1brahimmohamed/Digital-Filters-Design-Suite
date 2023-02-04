/************************************************************************************
 *
 * File Name  : drawShapes.js
 * Description: This file contains the functions that draw Konva shapes on the canvas
 * Author     : Ibrahim Mohamed
 *
 ************************************************************************************/

let shapesDefaultColor = 'black'

/**
 * Function to draw a circle on the canvas
 * @param circX
 * @param circY
 * @param circRadius
 * @param circStroke
 * @param circDraggable
 * @param circStrokeWidth
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
 * @param linePoints
 * @param lineDraggable
 * @param lineStroke
 * @param lineStrokeWidth
 * @param lineCap
 * @param lineJoin
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

