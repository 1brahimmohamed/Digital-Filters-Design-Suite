class PlottedSignal {
    constructor(divID, xData, yData, xLabel = 'frequency (Hz)', yLabel = 'magnitude (dB)') {

        this.divID = divID;
        this.data = [
            {
                x: xData,
                y: yData,
                mode: "lines",
                type: "scatter",
                name: 'Signal'
            }
        ];

        this.config = {
            responsive: true,
            editable: false,
            displaylogo: false,
        };

        this.layout = {
            margin: {
                t: 0},
            xaxis: {
                title: {
                    text: xLabel,
                },
                range: [0, 3.5],
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
        Plotly.plot(
            this.divID,
            this.data,
            this.layout,
            this.config
        );
    }

    updatePlot(data) {
        Plotly.newPlot(
            this.divID,
            [{
                x: data.x,
                y: data.y,
                mode: "lines",
                type: "scatter",
            }],
            this.layout,
            this.config,
        );
    }
    }