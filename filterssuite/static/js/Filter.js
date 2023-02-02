/******************************************************************************
 *
 * File Name  : Filter.js
 * Description: Digital Filter Class
 * Author     : Ibrahim Mohamed
 *
 *******************************************************************************/

class Filter {

    // Filter private attributes
    #zeros;
    #poles;
    #magnitudeResponseData;
    #phaseResponseData;
    #correctedPhaseResponseData;
    #plotConfigurations;

    constructor() {
        this.#zeros = [];
        this.#poles = [];

        this.#magnitudeResponseData = [{
            x: [0],
            y: [0],
            type: 'scatter',
            mode: 'lines',
            name: 'Magnitude Response',
        }];

        this.#phaseResponseData = [{
            x: [0],
            y: [0],
            type: 'scatter',
            mode: 'lines',
            name: 'Phase Response',
        }];

        this.#correctedPhaseResponseData = [{
            x: [0],
            y: [0],
            type: 'scatter',
            mode: 'lines',
            name: 'Corrected Phase Response',
        }]

        this.#plotConfigurations = {
            responsive: true,
            editable: false,
            displaylogo: false
        };
    }

    /**  ------------------------------------------ Setters ------------------------------------------ **/


    addZero(stageX, stageY) {
        // @TODO Implement adding zeros to the filter
    };

    addPole(stageX, stageY) {
        // @TODO Implement adding #poles to the filter
    };

    setMagnitudeResponseData(xData, yData){
        this.#magnitudeResponseData[0].x = xData;
        this.#magnitudeResponseData[0].y = yData;
    }

    setPhaseResponseData(xData, yData){
        this.#phaseResponseData[0].x = xData;
        this.#phaseResponseData[0].y = yData;
    }

    setCorrectedPhaseResponseData(xData, yData){
        this.#correctedPhaseResponseData[0].x = xData;
        this.#correctedPhaseResponseData[0].y = yData;
    }

    /**  ------------------------------------------ Getters ------------------------------------------ **/

    getZeros() {
        return this.#zeros;
    }

    getMagnitudeResponse(){
        return [this.#magnitudeResponseData[0].x, this.#magnitudeResponseData[0].y];
    }

    getPhaseResponse(){
        return [this.#phaseResponseData[0].x, this.#phaseResponseData[0].y];
    }

    getCorrectedPhaseResponse(){
        return [this.#correctedPhaseResponseData[0].x, this.#correctedPhaseResponseData[0].y];
    }


    getMagnitudeResponseData(){
        return this.#magnitudeResponseData;
    }

    getPhaseResponseData(){
        return this.#phaseResponseData;
    }

    getCorrectedPhaseResponseData(){
        return this.#correctedPhaseResponseData;
    }

    getPoles() {
        return this.#poles;
    }
}
