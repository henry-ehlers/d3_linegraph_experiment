const FIGURE = {
    HEIGHT: 400,
    WIDTH: 600
};
const MARGINS = {
    LEFT: 30,
    TOP: 30,
    RIGHT: 100,
    BOTTOM: 30
};
const PLOT = {
    HEIGHT: FIGURE.HEIGHT - MARGINS.BOTTOM - MARGINS.TOP,
    WIDTH: FIGURE.WIDTH - MARGINS.LEFT - MARGINS.RIGHT
};

const promises = [d3.csv("./data/daily_weight.csv")];

// Define data-independent range of x scale
let x = d3.scaleTime()
    .range([0, PLOT.WIDTH]);

// Define properties of x axis
let xAxis = d3.axisBottom(x);

// Define data-independent range of y scale
let y = d3.scaleLinear()
    .range([PLOT.HEIGHT, 0]);

// Define properties of y axis
let yAxis = d3.axisLeft(y);

// Define ordinal color-scale
let color = d3.scaleOrdinal(d3.schemeDark2);

Promise.all(promises).then(function(promisedData){
    const weights = promisedData[0];
    
    // Format data to match actual types required
    let timeParser = d3.timeParse('%m/%d/%Y')
    weights.forEach(d => {
        d.Date = timeParser(d.Date);
        d.BMI = Number(d.BMI);    
    });

    // Filter out missing data (i.e. BMI != 0)
    console.log(weights);
    const cleanWeights = weights.filter(d => d.BMI > 0) 
    console.log(cleanWeights);

    // Create svg in chart area
    let svg = d3.select("#chart-area")
        .append('svg')
            .attr('width', FIGURE.WIDTH)
            .attr('height', FIGURE.HEIGHT);

    // Create group for actual plot area within margins
    let plot = svg.append('g')
        .attr('transform', `translate(${MARGINS.LEFT}, ${MARGINS.TOP})`);

    // Include actual data into x scale
    x.domain(d3.extent(cleanWeights.map(d => d.Date)));
    plot.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${PLOT.HEIGHT})`)
        .call(xAxis);

    // Include actual data into y scale
    y.domain([0, d3.max(cleanWeights.map(d => d.BMI))])
    plot.append('g')
        .attr('class', 'y-axis')
        .call(yAxis);

    // Add Color/Text Legend for all unique Scale IDs in data
    const uniqueScales = cleanWeights
        .map(d => d["Scale [ID]"])
        .filter((value, index, array) => array.indexOf(value) === index); 
    legend = plot
        .append('g')
        .attr('transform', `translate(${PLOT.WIDTH}, 0)`);
    uniqueScales.forEach((d, i) => {
        const legendRow = legend
            .append('g')
            .attr('transform', `translate(10, ${i*20})`);
        legendRow
            .append('circle')
            .attr('r', 5)
            .attr('fill', color(d));
        legendRow
            .append('text')
            .attr('x', 10)
            .attr('y', 5)
            .text(d);
    });

    // Join and enter data as circles
    plot.selectAll('circle')
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