import * as d3 from '../src/d3.min';


export function showDiagram(w, h, major){
  d3.selectAll('svg').remove();
  var width = w,
        height = h;

var limit = 100;

var svg = d3.select("#vis_table")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

d3.json("CS1.json", function (error, graph) {
    if (error)
        throw error;

    svg.on("click", clickOther);

    //Simulation

    var threshold = 0.5;
    var parameterX = 2;
    var parameterY = 2;

    var linkWidth = 2;
    var lightLinkWidth = 3;

    var linkColor = "#999";
    var lighLinkColor = "#cc2222";

    var fontSize = "18px";
    var smallFontSize = "15px";

    var linkForce = d3.forceLink()
            .distance(function (d) {
                return getLinkDistance(d.weight);
            })
            .id(function (d) {
                return d.id;
            });
    var chargeForce = d3.forceManyBody()
            .strength(function (d) {
                return -100;
            });

    var simulation = d3.forceSimulation()
            .force("link", linkForce)
            .force("charge", chargeForce)
            .force("center", d3.forceCenter(width / parameterX, height / parameterY))
            .force('collision', d3.forceCollide().radius(function (d) {
                return getNodeRadius(d.weight * 1, true);
            }));

    // svg.append('path')
    //         .attr('stroke', '#333')
    //         .attr('stroke-width', '1')
    //         .attr("stroke-opacity", 0.5)
    //         .attr('fill', 'none')
    //         .attr('d', "M230,120L" + 3 * width/4  + ",120");
    //
    // svg.append('path')
    //         .attr('stroke', '#333')
    //         .attr('stroke-width', '1')
    //         .attr("stroke-opacity", 0.5)
    //         .attr('fill', 'none')
    //         .attr('d', "M230,280L" + 3 * width/4 + ",280");
    //
    // svg.append('path')
    //         .attr('stroke', '#333')
    //         .attr('stroke-width', '1')
    //         .attr("stroke-opacity", 0.5)
    //         .attr('fill', 'none')
    //         .attr('d', "M230,450L" + 3 * width/4 + ",450");

    var link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(graph.links)
            .enter()
            .append("line")
            .attr("stroke-width", function (d) {
                if (d.weight > threshold) {
                    return linkWidth;
                } else {
                    return 0;
                }
            })
            .attr("stroke", linkColor)
            .attr("stroke-opacity", 0.5)
            .attr("marker-end", function (d) {
                if (d.weight > threshold) {
                    return "url(#arrow)";
                } else
                    return;
            })
            .on("mouseover", displayLink)
            .on("mouseout", hideLink);

    var node = svg.selectAll(".node")
            .data(graph.nodes)
            .enter()
            .append("g")
            .attr("class", "nodes")
            .attr("id", function (d) {
                return simplify(d.id);
            })
            .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended))
            .on("mouseover", displayNode)
            .on("mouseout", hideNode)
            .on("click", clickNode);

    node.append("circle")
            .attr("r", function (d) {
                return getNodeRadius(d.weight, false);
            })
            .attr("fill", "#cc2222")
            .attr("fill-opacity", 1);

    node.append("text")
            .text(function (d) {
                return simplify(d.id);
            })
            .attr("fill", "white")
            .attr("font-size", function (d) {
                return getFontSize(d.weight);
            })
            .attr("x", function (d) {
                return getFontX(d.id, d.weight);
            });

    var arrowMarker = svg.append("marker")
            .attr("id", "arrow")
            .attr("markerUnits", "userSpaceOnUse")
            .attr("markerWidth", 25)
            .attr("markerHeight", 25)
            .attr("viewBox", "0 0 12 12")
            .attr("refX", 35)
            .attr("refY", 6)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M2,2 L10,6 L2,10 L6,6 L2,2")
            .attr('fill', '#cc2222');

    simulation
            .nodes(graph.nodes)
            .on("tick", ticked)
            .force("link")
            .links(graph.links);

    function ticked() {
        node
                .attr("transform", function (d) {
                    return "translate(" + limitX(d) + "," + limitY(d) + ")";
                });

        link
                .attr("x1", function (d) {
                    return limitX(d.source);
                })
                .attr("y1", function (d) {
                    return limitY(d.source);
                })
                .attr("x2", function (d) {
                    return limitX(d.target);
                })
                .attr("y2", function (d) {
                    return limitY(d.target);
                });
    }

    //Tip

//                var tipNode = d3.tip()
//                        .attr('class', 'd3-tip')
//                        .direction('e')
//                        .offset([0, 0])
//                        .html(function (d) {
//                            return '<p>' + 'Name: ' + d.id + '</p>';
//                        });
//                var tipLink = d3.tip()
//                        .attr('class', 'd3-tip')
//                        .direction('e')
//                        .offset([0, 0])
//                        .html(function (d) {
//                            return '<p>' + 'Course: ' + d.source.id + '</p>' +
//                                    '<p>' + 'Course: ' + d.target.id + '</p>' +
//                                    '<p>' + 'Weight: ' + d.weight + '</p>' +
//                                    '<p>' + 'Distance ' + getLinkDistance(d.weight) + '</p>';
//                        });
//                svg.call(tipNode);
//                svg.call(tipLink);

    //Limit

    function limitX(node) {
        return Math.min(width - limit, Math.max(limit, node.x));
    }

    function limitY(node) {
//                    return Math.min(height - limit, Math.max(limit, node.y));
        if (node.type == 1) {
            return Math.min(50, Math.max(100, node.y));
        } else if (node.type == 2) {
            return Math.min(200, Math.max(250, node.y))
        } else if (node.type == 3) {
            return Math.min(350, Math.max(400, node.y))
        } else {
            return Math.min(550, Math.max(600, node.y))
        }
    }

    //Drag

    function dragstarted(d) {
        if (!d3.event.active)
            simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active)
            simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    //Display and hide

    function displayNode(d) {
//                    tipNode.show(d);
        d3.select(this)
                .selectAll("circle")
                .attr("r", getNodeRadius(d.weight, true))
                .attr("fill", "orange");
        d3.selectAll("line")
                .attr("stroke-width", function (line) {
                    if (line.weight > threshold) {
                        if (line.source.id == d.id)
                            return lightLinkWidth;
                        else
                            return linkWidth;
                    } else {
                        return 0;
                    }
                })
                .attr("stroke", function (line) {
                    if (line.source.id == d.id)
                        return lighLinkColor;
                    else
                        return linkColor;
                })
//                            .attr("marker-end", function (line) {
//                                if (line.weight > threshold) {
//                                    if (line.source.id == d.id) {
//                                        return "url(#arrow)";
//                                    }
//                                } else
//                                    return;
//                            })
    }

    function hideNode(d) {
//                    tipNode.hide(d);
        d3.select(this)
                .selectAll("circle")
                .attr("r", getNodeRadius(d.weight, false))
                .attr("fill", "#cc2222");
        d3.selectAll("line")
                .attr("stroke-width", function (d) {
                    if (d.weight > threshold)
                        return linkWidth;
                    else
                        return 0;
                })
                .attr("stroke", linkColor)
//                            .attr("marker-end", function (d) {
//                                return;
//                            });
    }

    function displayLink(d) {
//                    tipLink.show(d);
        d3.select(this)
                .attr("stroke-width", lightLinkWidth)
                .attr("stroke", "#cc2222")
//                            .attr("marker-end", function (d) {
//                                if (d.weight > threshold)
//                                    return "url(#arrow)";
//                                else
//                                    return;
//                            });
    }

    function hideLink(d) {
//                    tipLink.hide(d);
        d3.select(this)
                .attr("stroke-width", linkWidth)
                .attr("stroke", linkColor)
//                            .attr("marker-end", function (d) {
//                                return;
//                            });
    }

    //Zoom

    var isZoomed = false;
    var nodeClicked = false;

    function clickNode(d) {
        isZoomed = true;
        nodeClicked = true;

        svg.transition()
                .duration(750)
                .call(zoom.transform,
                        d3.zoomIdentity
                        .translate(width / parameterX, height / parameterY)
                        .scale(2)
                        .translate((-limitX(d) / parameterX), -limitY(d) / parameterY));

        svg.selectAll("g")
                .selectAll("text")
                .text(function (d) {
                    return simplify(d.id);
                })
                .attr("font-size", function (d) {
                    return getFontSize(d.weight);
                })
                .attr("x", function (d) {
                    return getFontX(d.id, d.weight);
                });

        svg.selectAll("#" + simplify(d.id))
                .select("text")
                .text(d.id)
                .attr("font-size", function (d) {
                    return getFontSize(d.weight);
                })
                .attr("x", function (d) {
                    return getFontX(d.id, d.weight);
                });
    }

    function clickOther(d) {
        if (nodeClicked) {
            nodeClicked = false;
        } else {
            if (isZoomed) {
                isZoomed = false;
                svg.transition()
                        .duration(750)
                        .call(zoom.transform,
                                d3.zoomIdentity
                                .scale(1));
//                            svg.selectAll("g")
//                                    .selectAll("text")
//                                    .text(function (d) {
//                                        return simplify(d.id);
//                                    })
//                                    .attr("font-size", function (d) {
//                                        return (getNodeRadius(d.weight, false) / 3) + "px";
//                                    })
//                                    .attr("x", function (d) {
//                                        return -simplify(d.id).length * getNodeRadius(d.weight, false) / 10;
//                                    });
            }
        }
    }

    var zoom = d3.zoom()
            .scaleExtent([1, 2])
            .on("zoom", zoomed);

    function zoomed() {
        svg.attr("transform", d3.event.transform);
    }

    //Attribute

    function getFontSize(weight) {
        return (getNodeRadius(weight, false) / 3) + "px";
    }

    function getFontX(id, weight) {
        return -simplify(id).length * getNodeRadius(weight, false) / 10;
    }

    function getLinkDistance(weight) {
        if (weight > threshold) {
            return 1 / weight * 120;
        } else {
            return 250;
        }
    }

    function getNodeRadius(weight, highlight) {
        if (highlight) {
            return Math.sqrt(weight) * 55;
        } else {
            return Math.sqrt(weight) * 50;
        }
    }

    //Util

    function simplify(str) {
        var re = /[A-Z]*[0-9]*/;
        var text = re.exec(str);
        return text[0];
    }
});
}
