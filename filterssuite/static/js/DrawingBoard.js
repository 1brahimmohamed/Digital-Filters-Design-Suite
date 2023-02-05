/******************************************************************************
 *
 * File Name  : Drawing Board.js
 * Type       : Class
 * Description: Konva Stage Drawing Board Class
 * Author     : Ibrahim Mohamed
 *
 *******************************************************************************/

class DrawingBoard {

    #circleRadius;
    #circleCenterX;
    #circleCenterY;
    #width;
    #height;

    constructor(divId, width, height) {
        this.#width = width;
        this.#height = height;
        this.#circleRadius = width / 2 - 20;
        this.#circleCenterX = width / 2;
        this.#circleCenterY = height / 2;

        this.stage = new Konva.Stage({
            container: divId,
            width: width,
            height: height,
            backgroundColor: 'red',
        });

        this.layer = new Konva.Layer();

        this.zeroesShapes = [];
        this.polesShapes = [];

        this.stage.add(this.layer);
        this.#createAxes(width, height);
        this.#createUnitCircle(boardWidth / 2, boardHeight / 2, this.#circleRadius);
        this.stage.draw();
    }

    /**  ------------------------------------------ Getters ------------------------------------------ **/

    get getZeroes() {
        return this.zeroesShapes;
    }

    get getPoles() {
        return this.polesShapes;
    }

    get getCircleRadius() {
        return this.#circleRadius;
    }

    get getCircleCenterX() {
        return this.#circleCenterX;
    }

    get getCircleCenterY() {
        return this.#circleCenterY;
    }

    /**  ------------------------------------------ Methods ------------------------------------------ **/

    createPole = (xPos = 200, yPos = 200) => {
        let pole = drawPole(xPos, yPos)
        this.polesShapes.push(pole);
        this.layer.add(pole).draw();
    }

    createZero = (xPos = 200, yPos = 200) => {
        let zero = drawCircle(xPos, yPos, 6, true)
        this.zeroesShapes.push(zero);
        this.layer.add(zero).draw();
    }

    clearBoard = __ => {
        this.zeroesShapes = [];
        this.polesShapes = [];
        this.layer.destroyChildren();
        this.#createAxes(this.#width, this.#height);
        this.#createUnitCircle(this.#width / 2, this.#width / 2, this.#circleRadius);
        this.stage.draw();
    }

    #createAxes(axisWidth, axisHeight) {
        let yLine = drawLine([axisWidth / 2, 0, axisWidth / 2, axisHeight])
        let xLine = drawLine([0, axisHeight / 2, axisWidth, axisHeight / 2])
        this.layer.add(yLine);
        this.layer.add(xLine);
    }

    #createUnitCircle(xCenter, yCenter, radius) {
        let circle = drawCircle(xCenter, yCenter, radius, false, 'blue', 1);
        this.layer.add(circle);
    }
}
