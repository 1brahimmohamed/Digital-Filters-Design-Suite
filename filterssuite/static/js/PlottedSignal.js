class PlottedSignal {
    constructor(divID, xData, yData) {

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
            displaylogo: false
        };

        this.layout = {
            xaxis: {
                title: {
                    text: 'time (s)',
                },
                range: [0, 4]
            },
            yaxis: {
                title: {
                    text: 'amplitude (mV)'
                }
            },
            font: {
                size: 12
            },
        };
    }

    plot() {
        Plotly.newPlot(
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