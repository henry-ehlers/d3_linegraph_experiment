const promises = [
    d3.csv("./data/daily_weight.csv")
];

// let xAxis = d3.axisBottom()
//     .domain(d3.dateRange())

Promise.all(promises).then(function(promisedData){
    let weights = promisedData[0];
    let timeParser = d3.timeParse('%m/%d/%Y')
    weights.forEach(d => {
        d.Date = timeParser(d.Date);
        d.BMI = Number(d.BMI);    
    });
    console.log(weights[0]);


}).catch(function(error){
    console.log(error)
});