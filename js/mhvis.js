// /*
// 	Hi! this makes a pie chart for our mental health data
// */

mhVis = function(_parentElement, _data, _metaData, _total, _eventHandler){
    this.parentElement = _parentElement;
    this.data = _data;

    this.metaData = _metaData;

    // total number of users who have used heroin in the last year, given filter parameters
    this.total = _total;
    this.eventHandler = _eventHandler;
    this.displayData = [];

    this.margin = {top: 20, right: 0, bottom: 30, left: 30},
    this.width = getInnerWidth(this.parentElement) - this.margin.left - this.margin.right,
    this.height = 315 - this.margin.top - this.margin.bottom

    // set radius for pie chart
    this.radius = Math.min(this.width, this.height) / 2;

    // have data also include users who have not had MH problems. See completeData function below for more details
    //this.data = this.completeData(this.data, this.total);

    this.initVis()
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
	    .outerRadius(this.radius);

	this.svg = this.parentElement.append("svg")
		.attr("width", this.width)
	    .attr("height", this.height)
	    .attr("class", "pie")
	  .append("g")
	    .attr("transform", "translate(" + this.width / 2 + ", 0" + this.height / 2 + ")");

    this.updateVis();
    this.render();
}

mhVis.prototype.updateVis = function(){
	var that = this;

  	this.path = this.svg.datum(this.data).selectAll("g.path")
      .data(this.pie)
      .enter().append("g")
      .attr("class", "slice")

    this.path.append("path")
        .attr("fill", function (d,i) { return that.color(i);})
        .attr("d", this.arc)
        .each(function (d) {this._current = d;})

    this.text = this.path.append("text")
        .attr("transform", function(d) {
          d.outerRadius = that.outerRadius;
          d.innerRadius = that.innerRadius;
          return "translate (" + that.arc.centroid(d) + ")";
        })
        .attr("text-anchor", "middle")
        .attr("font", "8px sans-serif")
        .text(function(d, i) { return mhLabels[mhcats[i]]; });
}

mhVis.prototype.render = function (data) {
  var that = this

  var arc = d3.svg.arc()
     .innerRadius(132.5 - 100)
     .outerRadius(132.5);

  // update data for slices
  this.path = this.svg.datum(this.data).selectAll("path")
    .data(this.pie)
    // on mouseover, show tooltip with number of users in that category
    .on("mouseover", function (d, i) {
        d3.select("#tooltip")
            .attr("class", "notHidden")
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY + "px")
            .style("opacity", 1)
            .select("#value")
            .text(mhLabels[mhcats[i]] + ": " + d.value)
        })
    .on("mouseout", function () {
      // Hide the tooltip on mouseout
      d3.select("#tooltip")
      .style("opacity", 0);;
    })

  
  // transition slices
  this.path.transition()
    .duration(750)
    .attrTween("d", this.arcTween);

  // transition text
  this.text
    .data(this.pie)
    .transition()
    .duration(750)
    .attr("transform", function(d) {
      d.outerRadius = that.outerRadius;
      d.innerRadius = that.outerRadius;
      return "translate (" + that.arc.centroid(d) + ")";
      })
}


mhVis.prototype.arcTween = function (a) {

var arc = d3.svg.arc()
      .innerRadius(132.5 - 100)
      .outerRadius(132.5);

  var that = this;
  var i = d3.interpolate(this._current, a);
  this._current = i(0);
  return function(t) {
    return arc(i(t));
  };
}

mhVis.prototype.onSelectionChange= function (filteredData, filteredTotal){
    // set total to be filtered total heroin users
    this.total = filteredTotal;

    // set data to be the filtered data
    this.data = filteredData;

    // update the bar chart
    this.render(this.data);
}

// initially, this.data gives us numbers for all the people who have mental health problems. This.total
// tells us how many people have used heroin. We want to know how many people have used heroin and have had 
// no MH problems, and add this value to the end of this.data. This function does that
/*
mhVis.prototype.completeData = function (MH, total) {

    // sum up users with MH problems
    this.sum = MH.reduce (function (a,b) {
      return a + b
    })

    // subtract users with MH problems from total users
    this.difference = total - this.sum

    // add the users without MH problems to our dataset
    MH.push(this.difference);

    return MH;
} */