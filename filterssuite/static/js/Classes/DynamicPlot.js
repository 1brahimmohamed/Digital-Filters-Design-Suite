/******************************************************************************
 *
 * File Name  : DynamicPlot.js
 * Type       : Class
 * Description: Dynamic Real-time Plot Class
 * Author     : Ibrahim Mohamed
 *
 *******************************************************************************/

class DynamicPlot {

    #center
    constructor(
        divID,
        xLabel = 'time (s)',
        yLabel = 'magnitude (dB)',
        color = 'rgb(0,0,0)',
        xRange = [0, 50],
    ) {
        this.#center = 0;
        this.divID = divID;
        this.color = color;
        this.data = [
            {
                y: [0],
                mode: "lines",
                type: "scatter",
                name: 'Signal',
                line: {
                    color: this.color,
                }
            }
        ];

        this.config = {
            responsive: true,
            editable: false,
            displaylogo: false,
            displayModeBar: false
        };

        this.layout = {
            margin: {
                t: 20,
                r: 1,
                b: 40,
                l: 50,
            },
            xaxis: {
                title: {
                    text: xLabel,
                },
                range: xRange,
            },
            yaxis: {
                title: {
                    text: yLabel,
                },
            },
        };

        this.#plot();
    }

    #plot() {
        Plotly.newPlot(
            this.divID,
            this.data,
            this.layout,
            this.config
        );
    }

    updateDynamicPlot(data) {
        Plotly.extendTraces(this.divID, {y: [[data]]}, [0]);
        this.#center++;
        if (this.#center > 50) {
            Plotly.relayout(this.divID, {
                xaxis: {
                    range: [this.#center - 50, this.#center + 50]
                }
            });
        }
    }
}