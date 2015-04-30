// /*
// 	Hi! this makes a pie chart for our mental health data
// */

mhVis = function(_parentElement, _data, _metaData, _eventHandler){
    this.parentElement = _parentElement;
    this.data = _data;
    this.metaData = _metaData;
    this.eventHandler = _eventHandler;
    this.displayData = [];

    // TODO: define all constants here

    this.margin = {top: 20, right: 0, bottom: 30, left: 30},
    this.width = getInnerWidth(this.parentElement) - this.margin.left - this.margin.right,
    this.height = 315 - this.margin.top - this.margin.bottom

    // set radius for pie chart
    this.radius = Math.min(this.width, this.height) / 2;

    this.initVis();
}


/**
 * Method that sets up the SVG and the variables
 */
mhVis.prototype.initVis = function(){
    var that = this;

    this.color = d3.scale.category20();

  this.pie = d3.layout.pie()
  	.sort(null)
  	.value(function(d) { return d; });

	this.arc = d3.svg.arc()
	    .innerRadius(this.radius - 100)
	    .outerRadius(this.radius - 20);

	this.svg = this.parentElement.append("svg")
		.attr("width", this.width)
	    .attr("height", this.height)
	    .attr("class", "pie")
	  .append("g")
	    .attr("transform", "translate(" + this.width / 2 + ", 0" + this.height / 2 + ")");

    this.updateVis();
}

mhVis.prototype.updateVis = function(){
	var that = this;

  	this.path = this.svg.datum(this.data).selectAll("path")
      .data(this.pie)
      .enter().append("path")
        .attr("class", "pie")
        .attr("fill", function (d,i) {return that.color(i);})
        .attr("d", this.arc)
        .each(function (d) {this._current = d;})

      console.log(this.arc.centroid(37));
    this.svg.append("text")
      .attr("transform", function(d) {
        console.log(d); 
        d.outerRadius = that.outerRadius; 
        d.innerRadius = that.outerRadius;
        return "translate(" + that.arc.centroid(d[0]) + ")"; 
      })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function(d, i) { return mhcats[i]; });
}

mhVis.prototype.render = function (data) {
   var that = this

  this.path = this.svg.datum(this.data).selectAll("path")
    .data(this.pie)
  
   this.path.transition()
     .duration(750)
     .attrTween("d", this.arcTween);
}


mhVis.prototype.arcTween = function (a) {

var arc = d3.svg.arc()
      .innerRadius(132.5 - 100)
      .outerRadius(132.5 - 20);

  var that = this;
  var i = d3.interpolate(this._current, a);
  this._current = i(0);
  return function(t) {
    return arc(i(t));
  };
}


mhVis.prototype.onSelectionChange= function (filteredData){
    // set data to be the filtered data
    this.data = filteredData

    // update the bar chart
    this.render(this.data);
}
