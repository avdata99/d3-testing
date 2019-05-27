
var width = 900;
var height = 750;

var colliding = false;

var body = d3.select("body");
console.log(body.nodes());

var svg = body.append("svg")
    .attr("width", width)
    .attr("height", height);

var svg = body.selectAll("svg");
console.log(svg.nodes());

var dataset = [32, 57, 81];

function update_chart() {

    var circles = svg.selectAll("circle")
        .data(dataset)
        .enter().append("circle");
    console.log(circles.nodes());

    circles.transition()
        .duration(750)
        .delay(function(d, i) { return d; })
        .attr("r", function(d, i) { return Math.floor(Math.random() * d);})
        .attr("cx", function(d, i) { return 10 * Math.floor(Math.random() * d);})
        .attr("cy", function(d, i) { return 10 * Math.floor(Math.random() * d);})
        .style("fill", function(d, i) { return d3.rgb(Math.floor(Math.random() * d * 3), Math.floor(Math.random() * d * 3), Math.floor(Math.random() * d * 3));});

    circles.exit().remove();
}

update_chart();

function add_data() {
    var new_data = 5 + Math.floor(Math.random() * 50);
    dataset.push(new_data);
    update_chart();
    var circles = svg.selectAll("circle");
    if (circles.nodes().length > 50) {
        clearInterval(pid);
        // pid = window.setInterval(parte2, 1000)
        }
    }

function parte2() {
    var circles = svg.selectAll("circle");
    circles.transition()
        .duration(750)
        .delay(function(d, i) { return d * 2; })
        .attr("r", function(d, i) { return Math.floor(Math.random() * d);})
        .attr("cx", function(d, i) { return 10 * Math.floor(Math.random() * d);})
        .attr("cy", function(d, i) { return 10 * Math.floor(Math.random() * d);})
        .style("fill", function(d, i) { return d3.rgb(Math.floor(Math.random() * d * 3), Math.floor(Math.random() * d * 3), Math.floor(Math.random() * d * 3));});
}

document.getElementById("todo").addEventListener("click", parte2);
pid = window.setInterval(add_data, 100);

var force = d3.layout.force()
    .gravity(0.05)
    .charge(function(d, i) { return i ? 0 : -2000; })
    .nodes(circles)
    .size([width / 2, height / 2]);

force.start();