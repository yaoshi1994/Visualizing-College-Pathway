import * as d3 from '../src/d3.min';


export function showDiagram(w, h, major){
  d3.selectAll('svg').remove();
  var width = w,
          height = h;
  var major_select = major;
  var limit = 30;

  var svg = d3.select("#vis_table")
          .append("svg")
          .attr("width", width)
          .attr("height", height);

  d3.json(major_select, function (error, graph) {
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
      var lighLinkColor = "red";

      var fontSize = "15px";
      var smallFontSize = "10px";

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
              .attr("stroke-opacity", 0.6)
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
              .attr("fill", "red")
              .attr("fill-opacity", 1);

      node.append("text")
              .text(function (d) {
                  return simplify(d.id);
              })
              .attr("fill", "black")
              .attr("font-size", fontSize)
              .attr("x", function (d) {
                  return -simplify(d.id).length * 4;
              });

      var arrowMarker = svg.append("marker")
              .attr("id", "arrow")
              .attr("markerUnits", "userSpaceOnUse")
              .attr("markerWidth", 25)
              .attr("markerHeight", 25)
              .attr("viewBox", "0 0 12 12")
              .attr("refX", 25)
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
          return Math.min(height - limit, Math.max(limit, node.y));
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
                  .attr("marker-end", function (line) {
                      if (line.weight > threshold) {
                          if (line.source.id == d.id) {
                              return "url(#arrow)";
                          }
                      } else
                          return;
                  })
      }

      function hideNode(d) {
  //                    tipNode.hide(d);
          d3.select(this)
                  .selectAll("circle")
                  .attr("r", getNodeRadius(d.weight, false))
                  .attr("fill", "red");
          d3.selectAll("line")
                  .attr("stroke-width", function (d) {
                      if (d.weight > threshold)
                          return linkWidth;
                      else
                          return 0;
                  })
                  .attr("stroke", linkColor)
                  .attr("marker-end", function (d) {
                      return;
                  });
      }

      function displayLink(d) {
  //                    tipLink.show(d);
          d3.select(this)
                  .attr("stroke-width", lightLinkWidth)
                  .attr("stroke", "red")
                  .attr("marker-end", function (d) {
                      if (d.weight > threshold)
                          return "url(#arrow)";
                      else
                          return;
                  });
      }

      function hideLink(d) {
  //                    tipLink.hide(d);
          d3.select(this)
                  .attr("stroke-width", linkWidth)
                  .attr("stroke", linkColor)
                  .attr("marker-end", function (d) {
                      return;
                  });
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
                          .translate((-d.x / parameterX), -d.y / parameterY));

          svg.selectAll("g")
                  .selectAll("text")
                  .text(function (d) {
                      return simplify(d.id);
                  })
                  .attr("fill", "black")
                  .attr("font-size", fontSize)
                  .attr("x", function (d) {
                      return -simplify(d.id).length * 4;
                  });

          svg.selectAll("#" + simplify(d.id))
                  .select("text")
                  .text(d.id)
                  .attr("font-size", smallFontSize)
                  .attr("x", -d.id.length * 3);
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
                  svg.selectAll("g")
                          .selectAll("text")
                          .text(function (d) {
                              return simplify(d.id);
                          })
                          .attr("fill", "black")
                          .attr("font-size", fontSize)
                          .attr("x", function (d) {
                              return -simplify(d.id).length * 4;
                          });
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

      function getLinkDistance(weight) {
          return 1 / weight * 160;
      }

      function getNodeRadius(weight, highlight) {
          if (highlight) {
              return Math.sqrt(weight) * 35;
          } else {
              return Math.sqrt(weight) * 30;
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
