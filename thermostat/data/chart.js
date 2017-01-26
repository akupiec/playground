const Chart = (function (window, d3) {
    let limit = 60 * 1,
        duration = 750,
        now = new Date(Date.now() - duration);

    var width = 500,
        height = 300;

    var groups = {
        current: {
            value: 0,
            color: 'orange',
            data: d3.range(limit).map(function () {
                return 0
            })
        },
        // target: {
        //     value: 0,
        //     color: 'green',
        //     data: d3.range(limit).map(function () {
        //         return 0
        //     })
        // },
    };

    var x = d3.scaleTime()
        .domain([now - (limit - 2), now - duration])
        .range([0, width])

    var y = d3.scaleLinear()
        .domain([0, 100])
        .range([height, 0])

    var line = d3.line()
        .x(function (d, i) {
            return x(now - (limit - 1 - i) * duration)
        })
        .y(function (d) {
            return y(d)
        })

    var svg = d3.select('.graph').append('svg')
        .attr('class', 'chart')
        .attr('width', width)
        .attr('height', height + 40);

    var axis = svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(x.axis = d3.axisBottom(x));

    var asixy = svg.append("g")
        .attr('class', 'y axis')
        .attr('transform', 'translate(0,0)')
        .call(y.axis = d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Temp (C)");

    var paths = svg.append('g')

    for (var name in groups) {
        var group = groups[name]
        group.path = paths.append('path')
            .data([group.data])
            .attr('class', name + ' group')
            .style('stroke', group.color)
    }

    var tick = function (data) {
        now = new Date();

        // let items = 20 + Math.random() * 100;
        groups.current.data.push(data);
        groups.current.path.attr('d', line);

        render();
    };

    var render = function () {
        // Shift domain
        x.domain([now - (limit - 2) * duration, now - duration])

        // Slide x-axis left
        axis.transition()
            .duration(duration)
            .ease(d3.easeLinear)
            .call(x.axis);

        // Slide paths left
        paths.attr('transform', null)
            .transition()
            .duration(duration)
            .ease(d3.easeLinear)
            .attr('transform', 'translate(' + x(now - (limit - 1) * duration) + ')');

        // Remove oldest data point from each group
        for (var name in groups) {
            var group = groups[name]
            group.data.shift()
        }
    }

    return {
        addData: tick,
        render: render
    }

})(window, d3);