/******************************************************************************
 *
 * File Name  : Filter.js
 * Description: Digital Filter Class
 * Author     : Ibrahim Mohamed
 *
 *******************************************************************************/

class Filter{

    // Filter private attributes
    #zeros;
    #poles;
    #allPassFilters;
    #magnitudeResponseData;
    #phaseResponseData;
    #correctedPhaseResponseData;
    plotConfigurations;

    constructor() {
        this.#zeros = [];
        this.#poles = [];
        this.#allPassFilters = [];

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

        this.plotConfigurations = {
            responsive: true,
            editable: false,
            displaylogo: false
        };
    }


    exportFilterToCSV() {
        let csv = []        // create object 'csv' to store filter data
        for (let i = 0; i < this.#zeros.length; ++i) {
            csv.push('z' , this.#zeros[i].x, this.#zeros[i].y)
        }

        for (let i = 0; i < this.#poles.length; ++i) {
            csv.push('p' , this.#poles[i].x, this.#poles[i].y)
        }

        console.log(csv)

        /**  object returned to be converted to CSV   **/
        return csv
    }

    importFilterFromCSV(csv) {
        let importedZeros = []
        let importedPoles = []
        let keys = Object.keys(csv[0])

        csv.map((row) => {
            if (row[keys[0]] === 'z') {
                importedZeros.push({x: row[keys[1]], y: row[keys[2]]})
            } else if (row[keys[0]] === 'p') {
                importedPoles.push({x: row[keys[1]], y: row[keys[2]]})
            }
        })

        this.#zeros = importedZeros;
        this.#poles = importedPoles;
    }

    /**  ------------------------------------------ Setters ------------------------------------------ **/


    addZero(stageX, stageY) {
        // @TODO Implement adding zeros to the filter
    };

    addPole(stageX, stageY) {
        // @TODO Implement adding #poles to the filter
    };

    set setMagnitudeResponseData([xData, yData]){
        this.#magnitudeResponseData[0].x = xData;
        this.#magnitudeResponseData[0].y = yData;
    }

    set setPhaseResponseData([xData, yData]){
        this.#phaseResponseData[0].x = xData;
        this.#phaseResponseData[0].y = yData;
    }

    set setCorrectedPhaseResponseData([xData, yData]){
        this.#correctedPhaseResponseData[0].x = xData;
        this.#correctedPhaseResponseData[0].y = yData;
    }

    /**  ------------------------------------------ Getters ------------------------------------------ **/

    get getZeros() {
        return this.#zeros;
    }

    get getMagnitudeResponse(){
        return [this.#magnitudeResponseData[0].x, this.#magnitudeResponseData[0].y];
    }

    get getPhaseResponse(){
        return [this.#phaseResponseData[0].x, this.#phaseResponseData[0].y];
    }

    get getCorrectedPhaseResponse(){
        return [this.#correctedPhaseResponseData[0].x, this.#correctedPhaseResponseData[0].y];
    }


    get getMagnitudeResponseData(){
        return this.#magnitudeResponseData;
    }

    get getPhaseResponseData(){
        return this.#phaseResponseData;
    }

    get getCorrectedPhaseResponseData(){
        return this.#correctedPhaseResponseData;
    }

    get getPoles() {
        return this.#poles;
    }

    get getAllPassFilters() {
        return this.#allPassFilters;
    }

}
