/*
 	Hi! this makes a bar chart for our crime data
*/

CrimeVis = function(_parentElement, _data, _metaData, _eventHandler){
    this.parentElement = _parentElement;
    this.data = _data;
    this.metaData = _metaData;
    this.eventHandler = _eventHandler;
    this.displayData = [];
    // global variable to store original data, to build bar chart of total
    this.origData = [];

    // TODO: define all constants here

    this.margin = {top: 20, right: 120, bottom: 250, left: 62},
    this.width = getInnerWidth(this.parentElement) - this.margin.left - this.margin.right,
    this.height = 500 - this.margin.top - this.margin.bottom;

    this.initVis();
}


/**
 * Method that sets up the SVG and the variables
 */
CrimeVis.prototype.initVis = function(){

    var that = this; // read about the this

     // constructs SVG layout
    this.svg = this.parentElement.append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    // creates axis and scales
    this.y = d3.scale.linear()
      .range([this.height - 10, 0]);

    // yScale for total data
    this.origY = d3.scale.linear()
      .range([this.height -10, 0]);  

    this.x = d3.scale.ordinal()
      .rangeRoundBands([0, this.width], .1);

    this.color = d3.scale.category20();

    this.xAxis = d3.svg.axis()
      .scale(this.x)
      .orient("bottom");

    this.yAxis = d3.svg.axis()
      .scale(this.y)
      .orient("left");

    // Add axes visual elements
    // this.svg.append("g")
    //   .attr("class", "x axis")
    //   .attr("transform", "translate(0," + this.height + ")")
    //   .append("text")
    //     .attr("transform", "translate(70,20)")
    //     .attr("y", 6)
    //     .attr("dy", ".71em")
    //     .style("text-anchor", "end")
    //     .text("type of arrest");;

  this.svg.append("g")
      .attr("class", "y axis")
       .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("number of crimes");;

    // filter, aggregate, modify data
    // this.wrangleData(null);

    // set origData to be the display data of the total dataset
    this.origData = this.displayData;

    // call the update method
    this.updateVis();
}


// /**
//  * Method to wrangle the data. In this case it takes an options object
//  * @param _filterFunction - a function that filters data or "null" if none
//  */
CrimeVis.prototype.wrangleData= function(_filterFunction){

    // displayData should hold the data which is visualized
    this.displayData = this.filterAndAggregate(_filterFunction);
}



// /**
//  * the drawing function - should use the D3 selection, enter, exit
//  */
CrimeVis.prototype.updateVis = function() {
  var that = this;
    // updates scales
    this.y.domain(d3.extent(this.data, function(d) { return d; }));
    this.x.domain(this.data.map(function(d, i) { return i }));

    // updates axis
    this.svg.select(".y.axis")
        .call(this.yAxis);

    this.svg.select(".x.axis")
    	.call(this.xAxis)

    // updates graph

    // Data join
    var bar = this.svg.selectAll(".bar")
      .data(this.data, function(d) { return d; });

    // Append new bar groups, if required
    var bar_enter = bar.enter().append("g");

    // Append a rect and a text only for the Enter set (new g)
    bar_enter.append("rect");
    bar_enter.append("text");

    // Add attributes (position) to all bars
    bar
      .attr("class", "bar")
      .attr("transform", function(d, i) {return "translate(" + that.x(i) + ", 0)"; })

    // Remove the extra bars
    bar.exit()
      .remove();

    // Update all inner rects and texts (both update and enter sets)

    bar.select("rect")
      .attr("x", 0)
      .attr("y", function (d) { 
           	return that.y(d)
      })
      .attr("height", function (d) {
      	return that.height - that.y(d)})
      .transition()
      .attr("width", function(d, i) { 
          return that.x.rangeBand(i);
      });

    bar.select("text")
      .attr("y", 0)
      .attr("x", 0)
      .attr("text-anchor", "middle")
      .attr("transform", function(d,i) {return "translate (" + that.x.rangeBand(i)/2 + "," + (that.height + 10) + ")"; })
      .text(function(d, i) {return crimecats[i]; })
      .attr("class", "type-label")
      .attr("dy", ".35em")
}

// /**
//  * Gets called by event handler and should create new aggregated data
//  * aggregation is done by the function "aggregate(filter)". Filter has to
//  * be defined here.
//  * @param selection
//  */
CrimeVis.prototype.onSelectionChange= function (filteredData){
    // set data to be the filtered data
    this.data = filteredData

    // update the bar chart
    this.updateVis();
}

// huh???
CrimeVis.prototype.filterAndAggregate = function(_filter){


    // Set filter to a function that accepts all items
    // ONLY if the parameter _filter is NOT null use this parameter
    var filter = function(){return true;}
    if (_filter != null){
        filter = _filter;
    }

    var that = this;

    // create an array of values for priorities 1-16
    var res = d3.range(16).map(function () {
         return 0;
    });

    // accumulate all values that fulfill the filter criterion

    // TODO: implement the function that filters the data and sums the values
    this.data
        .filter(filter)
        .forEach(function (d) {
            d3.range(16).forEach(function (e){
               res[e] += d.prios[e]; 
            })
        })

    return res;
}