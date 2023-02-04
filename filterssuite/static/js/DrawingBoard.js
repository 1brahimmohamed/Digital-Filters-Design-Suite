/******************************************************************************
 *
 * File Name  : Drawing Board.js
 * Description: Konva Stage Drawing Board Class
 * Author     : Ibrahim Mohamed
 *
 *******************************************************************************/

class DrawingBoard {

    constructor(divId, width, height) {

        this.stage = new Konva.Stage({
            container: divId,
            width: width,
            height: height
        });

        this.layer = new Konva.Layer();

        this.zeroesShapes = [];
        this.polesShapes = [];

        this.stage.add(this.layer);

        let [xAxis, yAxis] = this.#createAxes(width, height);
        let circle = this.#createUnitCircle(boardWidth/ 2, boardHeight / 2, 230);

        this.layer.add(xAxis);
        this.layer.add(yAxis);
        this.layer.add(circle);

        this.stage.draw();
    }

    createPole = (xPos = 200,yPos = 200) => {
        let points = [
            xPos    , yPos      ,
            xPos+10  , yPos+10    ,
            xPos+5  , yPos+5    ,
            xPos    , yPos+10    ,
            xPos+10  , yPos      ,
        ]
        let pole = drawLine(points, true)
        this.layer.add(pole).draw();
    }

    createZero = (xPos = 200,yPos = 200) => {
        let zero = drawCircle(xPos, yPos, 6, true)
        this.layer.add(zero).draw();
    }

    #createAxes(width, height) {
        let yLine = drawLine([width / 2, 0, width / 2, height])
        let xLine = drawLine([0, height / 2, width, height / 2])
        return [xLine, yLine];
    }

    #createUnitCircle(xCenter, yCenter, radius) {
        return drawCircle(xCenter, yCenter, radius, false, 'blue', 1);
    }
}