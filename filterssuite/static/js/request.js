/******************************************************************************
 *
 * File Name  : Filter.js
 * Type       : Module
 * Description: request handling module
 * Author     : Ibrahim Mohamed
 *
 *******************************************************************************/


/**
 * function to set up request data converting coordinates to normalized coordinates & shapes of unit circle to
 * filter data
 * @returns {void}
 * **/
const setUpRequestData = ()=> {
    let zeros = [], poles = [];

    for (let i = 0; i < unitCircleBoard.getZeroes.length; i++) {
        let zero = unitCircleBoard.getZeroes[i], zeroX = zero.x(), zeroY = zero.y()

        let normalizedX = +((zeroX - unitCircleBoard.getCircleCenterX) / unitCircleBoard.getCircleRadius).toFixed(4),
            normalizedY = -((zeroY - unitCircleBoard.getCircleCenterY) / unitCircleBoard.getCircleRadius).toFixed(4);

        let zeroFilterData = {
            x: normalizedX, y: normalizedY,
        }

        zeros.push(zeroFilterData);
    }

    for (let i = 0; i < unitCircleBoard.getPoles.length; i++) {
        let pole = unitCircleBoard.getPoles[i], poleX = pole.x() + pole.width() / 2,
            poleY = pole.y() + pole.height() / 2;

        let normalizedX = +((poleX - unitCircleBoard.getCircleCenterX) / unitCircleBoard.getCircleRadius).toFixed(4),
            normalizedY = -((poleY - unitCircleBoard.getCircleCenterY) / unitCircleBoard.getCircleRadius).toFixed(4);

        let poleFilterData = {
            x: normalizedX, y: normalizedY,
        }

        poles.push(poleFilterData);
    }

    currentFilter.setZeros = zeros;
    currentFilter.setPoles = poles;
}

/**
 * function to send request to server
 * @returns {void}
 */
const sendRequest = __ => {

    setUpRequestData();

    $.ajax({
        url: 'http://127.0.0.1:8000/suite/get-filter-response/',
        type: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        dataType: 'json',
        data: JSON.stringify({
            zeros: currentFilter.getZeros,
            poles: currentFilter.getPoles,
            allPass: currentFilter.getAllPassFilters,
        }),
        success: function (response) {

            magnitudePlot.updatePlot(
                {
                        x: response.normalizedFrequency,
                        y: response.magnitudeResponse
                });

            phasePlot.updatePlot(
                {
                        x: response.normalizedFrequency,
                        y: response.phaseResponse
                });
        }
    })
}

const testAllPassRequest = (allPassToBeTested) => {
    $.ajax({
        url: 'http://127.0.0.1:8000/suite/test-all-pass/',
        type: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        dataType: 'json',
        async: true,
        data: JSON.stringify({
          originalPhase: currentFilter.getPhaseResponse,
          addedAllPass: allPassToBeTested
        }),
        success: function (response) {
            console.log(response)
        }
    })
}

