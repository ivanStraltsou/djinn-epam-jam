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
            'CO2',
            'Humidity',
            'Light',
            'Noise',
            'Pressure',
            'TVOC',
            'Temperature',
            'Vibration'];

        var plotData = resp.hits.hits.reduce(function (acc, hit) {

            var source = hit._source;

            parameters.forEach(function(p, i) {
                var traceData;

                if (!acc.hasOwnProperty(p)) {
                    traceData = {
                        x: [],
                        y: [],
                        z: [],
                        type: 'scatter3d',
                        mode: 'bars',
                        name: p,
                        size: 5,
                        symbol: 'circle',
                        line: {width: 1}
                    };
                    acc[p] = traceData;
                } else {
                    traceData = acc[p];
                }

                traceData.x.push(p);
                traceData.y.push(moment(new Date(source.timestamp)).format('hh:mm:ss'));
                traceData.z.push(source[p]);
            });

            return acc;
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

        console.log(orderedPlotData);

        Plotly.newPlot('plot', orderedPlotData, layout);

    }, function (err) {
        console.trace(err.message);
    });


    function normalize(series) {

    }
})();
