var width = window.innerWidth * .95;
var height = window.innerHeight * .95;
var color_h = d3.rgb(10, 100, 200);
var color_m = d3.rgb(200, 20, 10);
var color_base = d3.rgb(200, 200, 200);

var stroke_base = d3.rgb(150, 150, 150);
var stroke_h = d3.rgb(0, 0, 20);
var stroke_m = d3.rgb(20, 0, 0);
var stroke_width = 1;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style('border', '2px solid black');

function circles() {
    return svg.selectAll("circle");
}

var nodes = [];

// var nodes = d3.range(35).map(function() { 
//     return {radius: 25, color: color_base, stroke: stroke_base, stroke_width: stroke_width};
//     });

function add_node(uuid) {
    node = {radius: 35, color: color_base,
            stroke: stroke_base, stroke_width: stroke_width,
            uuid: uuid, genero: null, padres: null};
    console.log(node);
    nodes.push(node);
    update_force();
    update_nodes(); 
    console.log(nodes);

    if (nodes.length == 5) {start_ask_genero();}
}

var force = d3.layout.force();

function update_force() {
    force.gravity(0.2)
        .charge(function(d, i) { return -40; })
        .nodes(nodes)
        .size([width, height]);

    force.start();
    }
update_force();

function update_nodes() {
    console.log(nodes);
    circles().data(nodes)
        .enter().append("circle");
    // si no lo separo en dos entonces no se actualizan los colores
    circles().transition()
        .duration(150)
        .delay(function(d, i) { return 100; })
        .style("fill", function(d, i) { console.log('Color changed' + d.color); return d.color; })
        .attr("r", function(d) { return d.radius; })
        .style("stroke", function(d) { return d.stroke; })
        .style("stroke-width", function(d) { return d.stroke_width; });
    }
update_nodes();

force.on("tick", function(e) {
    var q = d3.geom.quadtree(nodes);  // https://github.com/d3/d3-quadtree
    var i = 0;
    var n = nodes.length;

    while (++i < n) {
        // visitar cada nodo para ver si tiene colisiones
        q.visit(collide(nodes[i]));
    }

    circles()
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
});

function collide(node) {
    var r = node.radius + 16,
        nx1 = node.x - r,
        nx2 = node.x + r,
        ny1 = node.y - r,
        ny2 = node.y + r;
    return function(quad, x1, y1, x2, y2) {
        if (quad.point && (quad.point !== node)) {
            var x = node.x - quad.point.x,
                y = node.y - quad.point.y,
                l = Math.sqrt(x * x + y * y),
                r = node.radius + quad.point.radius;
            if (l < r) {
                l = (l - r) / l * .5;
                node.x -= x *= l;
                node.y -= y *= l;
                quad.point.x += x;
                quad.point.y += y;
                }
            }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    };
}

document.getElementById("todo").addEventListener("click", function() {
    add_node(generate_UUID());
    }
    );

function generate_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

// identificador único de los timers
var pid;

// pregunta 1 ------------------------------

// van entrando los datos de genero
function start_ask_genero() {
    pid = window.setInterval(add_genero, 1500);
    }
function add_genero() {
    added = false;  // ver si quedan para agregar genero
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].genero == null) {
            added = true;
            genero = Math.random() * 10 > 5 ? 'h' : 'm';
            nodes[i].genero = genero;
            if (genero == 'h') {
                nodes[i].stroke = stroke_h;
                nodes[i].color = color_h;
            } else if (genero == 'm') {
                nodes[i].stroke = stroke_m;
                nodes[i].color = color_m;
            }
            break;
        }
    }
    if (added == false) {
        window.clearInterval(pid);
        start_ask_padres();
    } else {
        update_nodes();
    }
}


// pregunta 2 ------------------------------

function start_ask_padres() {
    pid = window.setInterval(add_padres, 1500);
    }
function add_padres() {
    added = false;  // ver si quedan para agregar padres
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].padres == null) {
            added = true;
            padres = Math.random() * 10 > 6 ? 'juntos' : 'separados';
            nodes[i].padres = padres;
            if (padres == 'juntos') {
                nodes[i].stroke_width = 6;
            } else if (genero == 'separados') {
                nodes[i].stroke_width = 3;
            }
            break;
        }
    }
    if (added == false) {
        window.clearInterval(pid);
    } else {
        update_nodes();
    }
}
