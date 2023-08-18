const FIGURE = {
    HEIGHT: 400,
    WIDTH: 600
};
const MARGINS = {
    LEFT: 30,
    TOP: 30,
    RIGHT: 30,
    BOTTOM: 30
};
const PLOT = {
    HEIGHT: FIGURE.HEIGHT - MARGINS.BOTTOM - MARGINS.TOP,
    WIDTH: FIGURE.WIDTH - MARGINS.LEFT - MARGINS.RIGHT
};

const promises = [d3.csv("./data/daily_weight.csv")];

let x = d3.scaleTime()
    .range([0, PLOT.WIDTH]);

let xAxis = d3.axisBottom(x)

let y = d3.scaleLinear()
    .range([PLOT.HEIGHT, 0]);

let yAxis = d3.axisLeft(y);

Promise.all(promises).then(function(promisedData){
    let weights = promisedData[0];
    let timeParser = d3.timeParse('%m/%d/%Y')
    weights.forEach(d => {
        d.Date = timeParser(d.Date);
        d.BMI = Number(d.BMI);    
    });
    console.log(weights[0]);

    let svg = d3.select("#chart-area")
        .append('svg')
            .attr('width', FIGURE.WIDTH)
            .attr('height', FIGURE.HEIGHT);

    let plot = svg.append('g')
        .attr('transform', `translate(${MARGINS.LEFT}, ${MARGINS.TOP})`);
    
    x.domain(d3.extent(weights.map(d => d.Date)));
    plot.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${PLOT.HEIGHT})`)
        .call(xAxis);

    y.domain([0, d3.max(weights.map(d => d.BMI))])
    plot.append('g')
        .attr('class', 'y-axis')
        .call(yAxis);
        // plot.append('g')
    //     .attr('class', 'plot')
    //     .attr('height', PLOT.HEIGHT)
    //     .attr('width', PLOT.HEIGHT);
    

}).catch(function(error){
    console.log(error)
});