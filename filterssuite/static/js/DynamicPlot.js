class DynamicPlot {
    #center

    constructor(divID, xLabel = 'time (s)', yLabel = 'magnitude (dB)', xrange = [0, 50], yrange = [-100, 500]) {
        this.#center = 0;
        this.divID = divID;
        this.data = [
            {
                y: [0],
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
            margin: {
                t: 0
            },
            xaxis: {
                title: {
                    text: xLabel,
                },
                range: xrange,
            },
            yaxis: {
                title: {
                    text: yLabel,
                },
                range: yrange,
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

    updateDynamicPlot(data) {
        Plotly.extendTraces(this.divID ,{ y:[[data]]}, [0]);
        this.#center++;
        if(this.#center > 50) {
            Plotly.relayout(this.divID,{
                xaxis: {
                    range: [this.#center-50,this.#center+50]
                }
            });
        }
    }
}