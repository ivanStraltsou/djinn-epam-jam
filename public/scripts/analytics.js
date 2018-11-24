(function () {

    fetch('/analytics-data', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(function (resp) {
        return resp.json();
    }).then(function (resp) {

        var parameters = [
            {name: 'CO2', min: 200, max: 800, color: '#004c6d'},
            {name: 'Humidity', min: 30, max: 60, color: '#296080'},
            {name: 'Light', min: 350, max: 700, color: '#437594'},
            {name: 'Noise', min: -100, max: 30, color: '#5d8ba9'},
            {name: 'Pressure', min: 0, max: 0, color: '#75a1be'},
            {name: 'TVOC', min: 0, max: 0, color: '#8eb8d3'},
            {name: 'Temperature', min: 21, max: 25, color: '#a7cfe9'},
            {name: 'Vibration', min: 0, max: 0, color: '#c1e7ff'}
        ];

        var plotData = resp.hits.hits.reduce(function (acc, hit) {

            var source = hit._source;

            parameters.forEach(function(p, i) {
                var traceData;

                var pVal = source[p.name];
                var pTime = moment(new Date(source.timestamp)).format('hh:mm:ss');

                if (!acc.hasOwnProperty(p.name)) {
                    traceData = {
                        x: [],
                        y: [],
                        z: [],
                        text: [],

                        type: 'scatter3d',
                        mode: 'lines+markers',
                        name: p.name,
                        symbol: 'circle',
                        line: {
                            width: 3,
                            color: p.color
                        },
                        marker: {
                            size: 5,
                            color: markerColor(p, pVal)
                        },
                        metrics: {
                            min: pVal,
                            max: pVal
                        },
                        hoverinfo: 'text'
                    };
                    acc[p.name] = traceData;
                } else {
                    traceData = acc[p.name];
                }

                traceData.x.push(p.name);
                traceData.y.push(pTime);
                traceData.z.push(pVal);
                traceData.text.push(`${p.name}<br>Time: ${pTime}<br>Value: ${pVal}`);

                if (pVal < traceData.metrics.min) {
                    traceData.metrics.min = pVal;
                }

                if (pVal > traceData.metrics.max) {
                    traceData.metrics.max = pVal;
                }
            });

            return acc;
        }, {});

        var layout = {
            scene: {
                margin: {
                    autosize: true,
                    l: 0,
                    r: 0,
                    b: 100,
                    t: 0,
                    width: 800,
                    height: 800
                },
                // aspectratio: {
                //     x: 1, y: 1, z: 100,
                // },
                xaxis: {
                    title: 'ABC',
                    tickvals: parameters
                },
                zaxis: {
                    rangemode: "tozero",
                    autorange: true
                }
            }
        };

        var orderedPlotData = parameters.map(function (e) {
            return plotData[e.name]
        });


        Plotly.newPlot('plot', normalize(orderedPlotData), layout);

    }, function (err) {
        console.trace(err.message);
    });


    function normalize(series) {
        return series.map(function (s) {
            var denom = s.metrics.max - s.metrics.min;
            s.z = s.z.map(function (v) {
                return 50 + ((v - s.metrics.min) / denom);
            });

            return s;
        });
    }

    function markerColor(parameter, parameterValue) {
        var color = null; // 'rgb(51, 153, 255)';
        if (parameter.min != parameter.max) {
            if (parameterValue < parameter.min || parameterValue > parameter.max) {
                color = 'rgb(255, 0, 0)'
            }
        }
        return color;
    }
})();
