import * as d3 from '../src/d3.min';


export function showDiagram(w, h){
  var width = w,
          height = h ;
  d3.selectAll('svg').remove();
  var svg = d3.select("#vis_table")
          .append("svg")
          .attr("width", width)
          .attr("height", height);

  // var tip_node = d3.tip()
  //         .attr('class', 'd3-tip')
  //         .direction('e')
  //         .offset([0, 0])
  //         .html(function (d) {
  //             return '<p>' + 'Name: ' + d.id + '</p>';
  //         });
  // var tip_link = d3.tip()
  //         .attr('class', 'd3-tip')
  //         .direction('e')
  //         .offset([0, 0])
  //         .html(function (d) {
  //             return '<p>' + 'Course: ' + d.source.id + '</p>' +
  //                     '<p>' + 'Course: ' + d.target.id + '</p>' +
  //                     '<p>' + 'Weight: ' + d.weight + '</p>';
  //         });
  // svg.call(tip_node);
  // svg.call(tip_link);

  var link_force = d3.forceLink()
          .distance(function (d) {
              return get_link_force(d.weight);
          })
          .id(function (d) {
              return d.id;
          });
  var charge_force = d3.forceManyBody()
          .strength(function (d) {
              return 30;
          });

  var simulation = d3.forceSimulation()
          .force("link", link_force)
          .force("charge", charge_force)
          .force("center", d3.forceCenter(width / 2, height / 2))
          .force('collision', d3.forceCollide().radius(function (d) {
              return get_node_size(d.weight, false);
          }));

  d3.json("CS.json", function (error, graph) {
      if (error)
          throw error;

      var link = svg.append("g")
              .attr("class", "links")
              .selectAll("line")
              .data(graph.links)
              .enter()
              .append("line")
              .attr("stroke-width", 3)
              .attr("stroke", "#999")
              .attr("stroke-opacity", function (d) {
                  if (d.weight > 0) {
                      return 0.6;
                  } else {
                      return 0;
                  }
              })
              .on("mouseover", display_link)
              .on("mouseout", hide_link)
              .attr("marker-end", function (d) {
                  if (d.weight > 0) {
                      return "url(#arrow)";
                  } else {
                      return;
                  }
              });

      var node = svg.selectAll(".node")
              .data(graph.nodes)
              .enter()
              .append("g")
              .attr("class", "nodes")
              .on("mouseover", display_node)
              .on("mouseout", hide_node);
      node.append("circle")
              .attr("r", function (d) {
                  return get_node_size(d.weight, false);
              })
              .call(d3.drag()
                      .on("start", dragstarted)
                      .on("drag", dragged)
                      .on("end", dragended))
              .attr("fill", "red")
              .attr("fill-opacity", 1);
      node.append("text")
              .text(function (d) {
                  return d.id;
              })
              .attr("fill", "white");

  //                var node = svg.append("g")
  //                        .attr("class", "nodes")
  //                        .selectAll("circle")
  //                        .data(graph.nodes)
  //                        .enter()
  //                        .append("circle")
  //                        .attr("r", function (d) {
  //                            return get_node_size(d.weight, false);
  //                        })
  //                        .attr("fill", "red")
  //                        .attr("fill-opacity", 0.7)
  //                        .on("mouseover", display_node)
  //                        .on("mouseout", hide_node);

      var arrowMarker = svg.append("marker")
              .attr("id", "arrow")
              .attr("markerUnits", "userSpaceOnUse")
              .attr("markerWidth", 20)
              .attr("markerHeight", 20)
              .attr("viewBox", "0 0 12 12")
              .attr("refX", 50)
              .attr("refY", 6)
              .attr("orient", "auto")
              .append("path")
              .attr("d", "M2,2 L10,6 L2,10 L6,6 L2,2")
              .attr('fill', 'red');

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
  //                    node.attr("cx", function (d) {
  //                        return d.x;
  //                    })
  //                            .attr("cy", function (d) {
  //                                return d.y;
  //                            });
      }
  });

  function limitX(node) {
      return node.x
  //                if(node.type == 1){
  //                    return Math.min(200, Math.max(300, node.x));
  //                }else if(node.type == 2){
  //                    return Math.min(400, Math.max(500, node.x))
  //                }else if(node.type == 3){
  //                    return Math.min(600, Math.max(700, node.x))
  //                }else{
  //                    return Math.min(800, Math.max(900, node.x))
  //                }
  }

  function limitY(node) {
      return node.y;
  }

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

  function display_node(d) {
      tip_node.show(d);
      d3.select(this)
              .selectAll("circle")
              .attr("r", get_node_size(d.weight, true))
              .attr("fill", "orange");
  }

  function hide_node(d) {
      tip_node.hide(d);
      d3.select(this)
              .selectAll("circle")
              .attr("r", get_node_size(d.weight, false))
              .attr("fill", "red");
  }

  function display_link(d) {
      tip_link.show(d);
      d3.select(this)
              .attr("stroke-width", 5);
  }

  function hide_link(d) {
      tip_link.hide(d);
      d3.select(this)
              .attr("stroke-width", 3);
  }

  function get_link_force(weight) {
      return 1 / Math.pow(weight, 5) * 15;
  }

  function get_node_size(weight, highlight) {
      if (highlight) {
          return Math.pow(weight, 3) * 100000;
      } else {
          return Math.pow(weight, 3) * 100000;
      }
  }
}
