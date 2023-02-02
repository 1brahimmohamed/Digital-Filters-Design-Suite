/******************************************************************************
 *
 * File Name  : Drawing Board.js
 * Description: Konva Stage Drawing Board Class
 * Author     : Ibrahim Mohamed
 *
 *******************************************************************************/

class DrawingBoard{

    constructor(divId, width, height){

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
        let circle = this.#createUnitCircle();

        this.layer.add(xAxis);
        this.layer.add(yAxis);
        this.layer.add(circle);

        this.stage.draw();
    }

    #createAxes(width, height){

        let yLine = new Konva.Line({
            points: [width/2, 0, width/2, height],
            stroke: 'black',
            strokeWidth: 1,
            lineCap: 'round',
            lineJoin: 'round',
        });

        let xLine = new Konva.Line({
            points: [0,height/2, width, height/2],
            stroke: 'black',
            strokeWidth: 1,
            lineCap: 'round',
            lineJoin: 'round',
        });
        return [xLine, yLine];
    }

    #createUnitCircle(xCenter, yCenter, radius){
        return new Konva.Circle({
            x: xCenter,
            y: yCenter,
            radius: radius,
            stroke: 'black',
            strokeWidth: 2,
        });
    }
}