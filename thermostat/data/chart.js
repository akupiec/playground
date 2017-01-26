const Chart = (function (window, d3) {
    let margin = {};
    const breakPoint = 100;
    let limit = 60 * 3,
        duration = 750,
        now = new Date(Date.now() - duration);

    let width = 500,
        height = 300;

    let groups = {
        current: {
            value: 0,
            color: 'orange',
            data: d3.range(limit).map(function () {
                return 0;
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

    const x = d3.scaleTime()
        .domain([now - (limit - 2), now - duration])
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, 100])
        .range([height, 0]);

    const line = d3.line()
        .x(function (d, i) {
            return x(now - (limit - 1 - i) * duration)
        })
        .y(function (d) {
            return y(d)
        });

    const svg = d3.select('.graph').append('svg')
        .attr('class', 'chart')
        .style('pointer-events', 'none');
        // .attr('width', width+50)
        // .attr('height', height+50);

    const chartWrapper = svg
        .append('g')
        .style('pointer-events', 'all');

    const axis = chartWrapper.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(x.axis = d3.axisBottom(x));

    const asixy = chartWrapper.append("g")
        .attr('class', 'y axis')
        .attr('transform', 'translate(0,0)')
        .call(y.axis = d3.axisLeft(y));

    asixy.append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Temp (C)");

    const paths = chartWrapper.append('g');

    for (let name in groups) {
        let group = groups[name];
        group.path = paths.append('path')
            .data([group.data])
            .attr('class', name + ' group')
            .style('stroke', group.color);
    }

    const tick = function (data) {
        now = new Date();

        // let items = 20 + Math.random() * 100;
        groups.current.data.push(data);
        groups.current.path.attr('d', line);

        render();
    };

    function updateDimensions(winWidth) {
        margin.top = 20;
        margin.right = winWidth < breakPoint ? 0 : 50;
        margin.left = winWidth < breakPoint ? 0 : 50;
        margin.bottom = 50;

        width = winWidth - margin.left - margin.right;
        // height = .4 * width;
    }

    const graph = document.getElementById("graph");
    const render = function () {
        updateDimensions(graph.clientWidth);
        x.range([0, width]);
        y.range([height, 0]);
        svg
            .attr('width', width + margin.right + margin.left)
            .attr('height', height + margin.top + margin.bottom);

        chartWrapper
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        x.axis.scale(x);
        y.axis.scale(y);


        // Shift domain
        x.domain([now - (limit - 2) * duration, now - duration]);
        // const len = groups.current.data.length;
        // const partData = groups.current.data.slice(len > 50 ? len-50: 0, len);
        // y.domain([Math.min(partData), Math.max(partData)]);

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
        for (let name in groups) {
            let group = groups[name];
            group.data.shift();
        }
    };

    return {
        addData: tick,
        render: render
    }

})(window, d3);