const FIGURE = {
    HEIGHT: 400,
    WIDTH: 600
};
const MARGINS = {
    LEFT: 75,
    TOP: 75,
    RIGHT: 100,
    BOTTOM: 75
};
const PLOT = {
    HEIGHT: FIGURE.HEIGHT - MARGINS.BOTTOM - MARGINS.TOP,
    WIDTH: FIGURE.WIDTH - MARGINS.LEFT - MARGINS.RIGHT
};

const promises = [d3.csv("./data/daily_weight.csv")];

// Define data-independent range of x scale
const x = d3.scaleTime()
    .range([0, PLOT.WIDTH]);

// Define properties of x axis
const xAxisCall = d3.axisBottom(x)

// Define data-independent range of y scale
const y = d3.scaleLinear()
    .range([PLOT.HEIGHT, 0]);

// Define properties of y axis
const yAxisCall = d3.axisLeft(y)
    .tickSizeOuter(0);

// Define ordinal color-scale
const color = d3.scaleOrdinal(d3.schemeDark2);

// Healthy BMI Area generator
const severlyUnderweightBMI = d3.area()
        .x(function(d) {return x(d.Date);})
        .y0(function(d) {return y(0);})
        .y1(function(d) {return y(16);})

// Healthy BMI Area generator
const underweightBMI = d3.area()
        .x(function(d) {return x(d.Date);})
        .y0(function(d) {return y(16);})
        .y1(function(d) {return y(18);})

// Healthy BMI Area generator
const healthyBMI = d3.area()
        .x(function(d) {return x(d.Date);})
        .y0(function(d) {return y(18);})
        .y1(function(d) {return y(24);})

// Healthy BMI Area generator
const overweightBMI = d3.area()
        .x(function(d) {return x(d.Date);})
        .y0(function(d) {return y(24);})
        .y1(function(d) {return y(29);})

// Obese BMI Area generator
const obeseBMI = d3.area()
        .x(function(d) {return x(d.Date);})
        .y0(function(d) {return y(29);})
        .y1(function(d) {return y(30);})

Promise.all(promises).then(function(promisedData){
    const weights = promisedData[0];
    
    // Format data to match actual types required
    const timeParser = d3.timeParse('%m/%d/%Y')
    weights.forEach(d => {
        d.Date = timeParser(d.Date);
        d.BMI = Number(d.BMI);    
    });

    // Filter out missing data (i.e. BMI != 0)
    console.log(weights);
    const cleanWeights = weights.filter(d => d.BMI > 0) 
    console.log(cleanWeights);

    // Create svg in chart area
    const svg = d3.select("#chart-area")
        .append('svg')
            .attr('width', FIGURE.WIDTH)
            .attr('height', FIGURE.HEIGHT);

    // Create group for actual plot area within margins
    const plot = svg.append('g')
        .attr('transform', `translate(${MARGINS.LEFT}, ${MARGINS.TOP})`);

    // Include actual data into x scale
    x.domain(d3.extent(cleanWeights.map(d => d.Date)));
    const xAxis = plot
        .append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0, ${PLOT.HEIGHT})`)
            .call(xAxisCall);
    xAxis
        .selectAll('text')
            .style('text-anchor', 'end')
            .attr('transform', 'rotate(-65)')
            .attr("y", 2)
            .attr("x", -10); // NOTE: x and y now relate to the text's rotated grid

    // X Axis Title
    const xLabel = plot
        .append('g')    
            .attr('class', 'x-label')
            .attr('transform', `translate(${PLOT.WIDTH / 2}, ${FIGURE.HEIGHT})`)
        .append('text')
            .style('text-anchor', 'middle')
            .attr('y', -90)
            .text('Time')

    // Include actual data into y scale
    y.domain([0, d3.max(cleanWeights.map(d => d.BMI)) + 2])
    const yAxis = plot
        .append('g')
            .attr('class', 'y-axis')
            .call(yAxisCall);

    // Add Y axis label
    const yLabel = plot
        .append('g')
            .attr('class', 'y-label')   
            .attr('transform', `translate(0, ${PLOT.HEIGHT/2})`)
        .append('text')
            .style('text-anchor', 'middle')
            .attr('transform', 'rotate(-90)')
            .attr('y', -40)
            .text('BMI')
    
    // Plot title
    const title = plot
        .append('g')
            .attr('class', 'title')
            .attr('transform', `translate(${PLOT.WIDTH/2}, 0)`)
        .append('text')
            .text("A Person's BMI over the months")
            .style('text-anchor', 'middle')
    
    // Add Color/Text Legend for all unique Scale IDs in data
    const uniqueScales = cleanWeights
        .map(d => d["Scale [ID]"])
        .filter((value, index, array) => array.indexOf(value) === index); 
    const legend = plot
        .append('g')
            .attr('transform', `translate(${PLOT.WIDTH}, 0)`);
    legend
        .append('g')
        .attr('transform', `translate(5, 0)`)
        .append('text')
        .text('Scale Location')
        .attr('y', 5)
        
    uniqueScales.forEach((d, i) => {
        const legendRow = legend
            .append('g')
            .attr('transform', `translate(10, ${(i+1)*20})`);
        legendRow
            .append('circle')
            .attr('r', 5)
            .attr('fill', color(d));
        legendRow
            .append('text')
            .attr('x', 10)
            .attr('y', 5)
            .style('text-transform', 'capitalize')
            .text(d);
    });

    // Create Area Plots for different BMI categories
    const severlyUnderweightBMIArea = plot
        .append('path')
        .attr('fill', 'red')
        .attr('d', severlyUnderweightBMI(cleanWeights))
        .style('opacity', '0.1')

    // Create Area Plots for different BMI categories
    const underweightBMIArea = plot
        .append('path')
        .attr('fill', 'orange')
        .attr('d', underweightBMI(cleanWeights))
        .style('opacity', '0.1')

    // Create Area Plots for different BMI categories
    const healthyBMIArea = plot
        .append('path')
        .attr('fill', 'green')
        .attr('d', healthyBMI(cleanWeights))
        .style('opacity', '0.1')

    // Create Area Plots for different BMI categories
    const overweightBMIArea = plot
        .append('path')
        .attr('fill', 'orange')
        .attr('d', overweightBMI(cleanWeights))
        .style('opacity', '0.1')

    // Create Area Plots for different BMI categories
    const obeseBMIArea = plot
        .append('path')
        .attr('fill', 'red')
        .attr('d', obeseBMI(cleanWeights))
        .style('opacity', '0.1')

    // Join and enter data as line generator
    const line = d3.line()
        .x(d => x(d.Date))
        .y(d => y(d.BMI))
    const lineGraph = plot
        .append('path')
        .attr('fill', 'none')
        .attr('stroke', 'grey')
        .attr('stroke-width', 0.5)
        .attr('d', line(cleanWeights))

    // Join and enter data as circles
    const scatterGraph = plot
        .selectAll('circle')
        .data(cleanWeights)
        .enter()
        .append('circle')
            .attr('cx', d => x(d.Date))
            .attr('cy', d => y(d.BMI))
            .attr('r', 1)
            .attr('fill', d => color(d["Scale [ID]"]))

}).catch(function(error){
    console.log(error)
});