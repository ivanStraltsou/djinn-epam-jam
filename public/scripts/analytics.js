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
        console.log(resp.hits);

        var parameters = [
            'CO2',
            'Humidity',
            'Light',
            'Noise',
            'Pressure',
            'TVOC',
            'Temperature',
            'Vibration'];

        var rawData = [{}];

        var plotData = rawData.reduce(function (acc, hit) {
            var source = hit._source;

            console.log(source);

            parameters.forEach(function(p, i) {
                var traceData = acc[p];

                if (!acc.hasOwnProperty(p)) {
                    traceData = {
                        x: [],
                        y: [],
                        z: [],
                        type: 'scatter3d',
                        mode: 'lines+markers',
                        name: p,
                        size: 5,
                        symbol: 'circle',

                    };
                    acc[p] = traceData;
                }

                traceData.x.push(source.timestamp);
                traceData.y.push(source[p]);

                return acc;
            });
        }, {});

        var layout = {
            margin: {
                l: 0,
                r: 0,
                b: 0,
                t: 0
            },
            xaxis: {tickvals: parameters}
        };

        var orderedPlotData = parameters.map(function (e) {
            return plotData[e]
        });

        Plotly.newPlot('plot', orderedPlotData, layout);

    }, function (err) {
        console.trace(err.message);
    });

})();
