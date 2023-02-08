class PlottedSignal {
    constructor(divID, xData, yData, xLabel = 'frequency (Hz)', yLabel = 'magnitude (dB)', color = 'rgb(0, 0, 0)') {

        this.divID = divID;
        this.color = color;
        this.xLabel = xLabel;
        this.yLabel = yLabel;

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
            displayModeBar: false,
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
                    text: this.xLabel,
                },
                range: [0, 3.5],
                showgrid: true,
            },
            yaxis: {
                title: {
                    text: this.yLabel,
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

        let max = Math.max(...data.y);
        let min = Math.min(...data.y);
        let range = max - min;

        if (range < 1) {
            console.log('y axis range is less than 1')
            this.layout.yaxis = {
                title: {
                    text: this.yLabel,
                },
                range: [min - 0.5, max + 0.5],
            };
            console.log(this.layout.yaxis)
        }
        else {
            this.layout.yaxis = {
                title: {
                    text: this.yLabel,
                },
                range: [min - 1, max + 1],
            };
        }

        Plotly.react(
            this.divID,
            [{
                x: data.x,
                y: data.y,
                mode: "lines",
                type: "scatter",
                line: {
                    color: this.color,
                }
            }],
            this.layout,
            this.config,
        );
    }
    }