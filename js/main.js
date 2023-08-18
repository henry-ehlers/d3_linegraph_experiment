const promises = [
    d3.csv("./data/daily_weight.csv")
];


Promise.all(promises).then(function(promisedData){
    let weights = promisedData[0]
    console.log(weights)
}).catch(function(error){
    console.log(error)
})