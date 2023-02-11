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
const setUpRequestData = () => {
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
        let pole = unitCircleBoard.getPoles[i],
            poleX = pole.getAttr("actualX"),
            poleY = pole.getAttr("actualY");

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
 * function to send request to server to get the response of the filter
 * @returns {void}
 */
const sendRequest = () => {

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

            currentFilter.setMagnitudeResponseData = {
                x: response.normalizedFrequency,
                y: response.magnitudeResponse,
            };

            currentFilter.setPhaseResponseData = {
                x: response.normalizedFrequency,
                y: response.phaseResponse,
            }

            if (unitCircleBoard.getZeroes.length === 0 && unitCircleBoard.getPoles.length === 0) {
                magnitudePlot.updatePlot({x: [0], y: [0]})
                phasePlot.updatePlot({x: [0], y: [0]})
                originalPhasePlot.updatePlot({x: [0], y: [0]})
            }
            else{
                magnitudePlot.updatePlot(currentFilter.getMagnitudeResponse);
                phasePlot.updatePlot(currentFilter.getPhaseResponse);
                originalPhasePlot.updatePlot(currentFilter.getPhaseResponse);
            }
        }
    })
}

/**
 * function to send request to get one all pass filter response for a value
 * @param {complex} aValue  - value of A (the all pass filter parameter)
 * @returns {void}
 */
const getAllPassRequest = (aValue) => {
    $.ajax({
        url: 'http://127.0.0.1:8000/suite/get-allpass-response/',
        type: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        dataType: 'json',
        async: true,
        data: JSON.stringify({
            value: aValue
        }),
        success: function (response) {
            currentAllPassPlot.updatePlot(
                {
                    x: response.normalizedFrequency,
                    y: response.allPassResponse
                }
            )
        }
    })
}

/**
 * function to send request to get the real time response of the filter point by point
 * @param {number} currVal - current value of the signal
 * @returns {void}
 */
const filerSignalRequest = (currVal) => {
    $.ajax({
        url: 'http://127.0.0.1:8000/suite/filter-signal/',
        type: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        dataType: 'json',
        async: true,
        data: JSON.stringify({
            signal: currVal
        }),
        success: function (response) {
            let val = response.filteredSignal.splice(-1)
            realTimeFilteredPlot.updateDynamicPlot(parseFloat(val))
        }
    })
}




