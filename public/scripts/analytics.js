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
            {key: 'CO2', min: 200, max: 800, color: '#004c6d'},
            {key: 'Humidity', min: 30, max: 60, color: '#296080'},
            {key: 'Light', min: 350, max: 700, color: '#437594'},
            {key: 'Noise', min: -100, max: 30, color: '#5d8ba9'},
            {key: 'Pressure', min: 0, max: 0, color: '#75a1be'},
            {key: 'TVOC', min: 0, max: 0, color: '#8eb8d3'},
            {key: 'Temperature', min: 21, max: 25, color: '#a7cfe9'},
            {key: 'Vibration', min: 0, max: 0, color: '#c1e7ff'},
            {key: 'result', name: "Productivity", min: 0, max: 45000, color: '#99e699'}
        ];

        var telemetry = resp.telemetry.hits.hits;

        var productivity = resp.productivity.hits.hits;

        var combinedData = telemetry.concat(productivity);

        var maxTime = new Date();
        var minTime = moment(maxTime).subtract(60, 'minutes').toDate();

        var plotData = combinedData.reduce(function (acc, hit) {

            var source = hit._source;


            parameters.forEach(function(p, i) {
                if (source.hasOwnProperty(p.key)) {
                    var pName = p.name || p.key;

                    var traceData;

                    var pVal = source[p.key];
                    var pTime = new Date(source.timestamp);
                    var pFormattedTime = moment(pTime).format('YYYY-MM-DD HH:mm:ss');

                    if (!acc.hasOwnProperty(pName)) {
                        traceData = {
                            x: [],
                            y: [],
                            z: [],
                            text: [],

                            type: 'scatter3d',
                            mode: 'lines+markers',
                            name: pName,
                            symbol: 'circle',
                            line: {
                                width: 3,
                                color: p.color
                            },
                            marker: {
                                size: 5,
                                color: []
                            },
                            metrics: {
                                min: pVal,
                                max: pVal
                            },
                            comfortRange: {
                                min: p.min,
                                max: p.max
                            },
                            hoverinfo: 'text'
                        };
                        acc[pName] = traceData;
                    } else {
                        traceData = acc[pName];
                    }

                    // traceData.x.push(pName);
                    traceData.x.push(i);
                    traceData.y.push(pTime);
                    traceData.z.push(pVal);
                    traceData.text.push(`${pName}<br>Time: ${pFormattedTime}<br>Value: ${pVal}`);
                    traceData.marker.color.push(markerColor(p, pVal, p.color));

                    if (pVal < traceData.metrics.min) {
                        traceData.metrics.min = pVal;
                    }

                    if (pVal > traceData.metrics.max) {
                        traceData.metrics.max = pVal;
                    }
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
                    b: 0,
                    t: 0,
                    width: 800,
                    height: 800
                },
                // xaxis: {
                //     tickvals: ['CO2', 'Humidity', 'Light', 'Noise', 'Pressure', 'TVOC', 'Temperature', 'Vibration', 'Productivity']
                // },
                yaxis: {
                    tickformat: function (e) {
                        moment(new Date(e)).format('HH:mm:ss');
                    }
                },
                zaxis: {
                    range: [-1, 2]
                }
            }
        };

        var orderedPlotData = parameters.reduce(function (acc, e) {
            var pName = e.name || e.key;
            if (plotData.hasOwnProperty(pName)) {
                acc.push(plotData[pName])
            }
            return acc;
        }, []);

        var lowerBound = {
            x: [8, 0, 0, 8],
            y: [minTime, minTime, maxTime, maxTime],
            z: [0, 0, 0, 0],
            type: 'scatter3d',
            mode: 'lines+markers',
            name: "Lower Bound",
            symbol: 'circle',
            surfaceaxis: 2,
            surfacecolor: "#a3dff7",
            opacity: 0.3
        };

        var upperBound = {
            x: [8, 0, 0, 8],
            y: [minTime, minTime, maxTime, maxTime],
            z: [1, 1, 1, 1],
            type: 'scatter3d',
            mode: 'lines+markers',
            name: "Upper Bound",
            symbol: 'circle',
            surfaceaxis: 2,
            surfacecolor: "#f27689",
            opacity: 0.3
        };

        Plotly.newPlot('plot', normalize(orderedPlotData).concat([lowerBound, upperBound]), layout);
        // Plotly.newPlot('plot', normalize(orderedPlotData), layout);

    }, function (err) {
        console.trace(err.message);
    });


    function normalize(series) {
        return series.map(function (s) {
            var denom = s.comfortRange.max - s.comfortRange.min;

            s.z = s.z.map(function (v) {
                return denom === 0 ? 1 : ((v - s.comfortRange.min) / denom);
            });

            return s;
        });
    }

    function markerColor(parameter, parameterValue, defaultColor) {
        var color = defaultColor;

        if (parameter.min != parameter.max) {
            if (parameterValue < parameter.min || parameterValue > parameter.max) {
                color = '#ff5050'
            }
        }

        return color;
    }
})();
