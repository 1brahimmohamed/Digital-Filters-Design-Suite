/******************************************************************************
 *
 * File Name  : Filter.js
 * Type       : Class
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

    /**  ------------------------------------------ Methods ------------------------------------------ **/

    exportFilterToCSV() {
        let csv = []        // create object 'csv' to store filter data
        for (let i = 0; i < this.#zeros.length; ++i) {
            csv.push(['z' , this.#zeros[i].x, this.#zeros[i].y])
        }

        for (let i = 0; i < this.#poles.length; ++i) {
            csv.push(['p' , this.#poles[i].x, this.#poles[i].y])
        }

        for (let i = 0; i < this.#allPassFilters.length; ++i) {
            csv.push(['a' , this.#allPassFilters[i].real, this.#allPassFilters[i].imaginary])
        }


        let downloadedCSV = 'type,x,y\n';

        csv.forEach((row) => {
            console.log(row)
            downloadedCSV += row.join(',');
            downloadedCSV += "\n";
        })


        /**  object returned to be converted to CSV   **/
        return downloadedCSV
    }

    addZero(zeroObj) {
        this.#zeros.push(zeroObj);
    };

    addPole(poleObj) {
        this.#poles.push(poleObj);
    };

    addAllPassFilter(allPassFilterObj) {
        this.#allPassFilters.push(allPassFilterObj);
    };

    removeAllPassFilter(filerID) {
        this.#allPassFilters.forEach((allPassFilter) => {
            if (allPassFilter.id === filerID) {
                this.#allPassFilters.splice(this.#allPassFilters.indexOf(allPassFilter), 1);
            }
        })
    }

    clearAllPass(){
        this.#allPassFilters = [];
    }

    clearZeros() {
        this.#zeros = [];
    }

    clearPoles() {
        this.#poles = [];
    }

    /**  ------------------------------------------ Setters ------------------------------------------ **/

    set setZeros(zeros){
        this.#zeros = zeros;
    }

    set setPoles(poles){
        this.#poles = poles;
    }

    set setMagnitudeResponseData(respObj){
        this.#magnitudeResponseData[0].x = respObj.x;
        this.#magnitudeResponseData[0].y = respObj.y;
    }

    set setPhaseResponseData(respObj){
        this.#phaseResponseData[0].x =  respObj.x;
        this.#phaseResponseData[0].y =  respObj.y;
    }

    set setCorrectedPhaseResponseData(respObj){
        this.#correctedPhaseResponseData[0].x = respObj.x;
        this.#correctedPhaseResponseData[0].y = respObj.y;
    }

    /**  ------------------------------------------ Getters ------------------------------------------ **/

    get getZeros() {
        return this.#zeros;
    }

    get getPoles() {
        return this.#poles;
    }

    get getAllPassFilters() {
        return this.#allPassFilters;
    }

    get getMagnitudeResponse(){
        return {
            x: this.#magnitudeResponseData[0].x,
            y: this.#magnitudeResponseData[0].y
        };
    }

    get getPhaseResponse(){
        return {
            x: this.#phaseResponseData[0].x,
            y: this.#phaseResponseData[0].y
        };
    }

    get getCorrectedPhaseResponse(){
        return {
            x: this.#correctedPhaseResponseData[0].x,
            y: this.#correctedPhaseResponseData[0].y
        };
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


}
