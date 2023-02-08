class DynamicPlot {
    #center

    constructor(divID, xLabel = 'time (s)', yLabel = 'magnitude (dB)', color = 'rgb(0,0,0)', xrange = [0, 50], yrange = [-100, 500]) {
        this.#center = 0;
        this.divID = divID;
        this.color = color;
        this.data = [
            {
                y: [0],
                mode: "lines",
                type: "scatter",
                name: 'Signal',
                line:{
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
                // range: xrange,
                range: [0,50],
            },
            yaxis: {
                title: {
                    text: yLabel,
                },
                // range: yrange,
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