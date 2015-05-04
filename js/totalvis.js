/*
 *
  THIS VISUALIZATION IS A BARCHART SHOWING 3 THINGS: TOTAL NUMBER OF PEOPLE IN SELECTED
  INCOME BRACKET, NUMBER OF PAST-YEAR HEROIN USERS IN SELECTED INCOME BRACKET,
  AND NUMBER OF PAST-MONTH HEROIN USERS IN SELECTED INCOME BRACKET.
  SINCE THE TOTAL NUMBER OF PEOPLE WILL ALWAYS BE MUCH, MUCH BIGGER THAN THE OTHER TWO BARS,
  WE HAVE IMPLEMENTED A SYSTEM WITH TWO DIFFERENT SCALES. THE FIRST HALF OF THE GRAPH (LEFT SIDE) 
  IS SCALED TO THE NUMBER OF HEROIN USERS. THE RIGHT HALF IS SCALED TO THE TOTAL NUMBER OF PEOPLE
 *
 * */
TotalVis = function(_parentElement, _data, _metaData, _metaData2, _totalPop, _eventHandler){

    // NOTE: THIS VIS ONLY USES THE METADATA
    this.parentElement = _parentElement;
    this.data = _data;
    this.metaData = _metaData;
    this.eventHandler = _eventHandler;
    this.metaData2 = _metaData2;
    this.totalPop = _totalPop;
    // this is just the total number or people surveyed, which will be MUCH larger than # of heroin users
    this.upperData = [this.metaData[0]]
    // metaData now just holds the heroin users, which are much smaller numbers
    //this.metaData.splice(0,1);
    this.lowerData = [0, this.metaData[1], this.metaData[2]]

    this.displayData = [];

    // constants
    this.margin = {top: 20, right: 10, bottom: 30, left: 60},
    this.width = getInnerWidth(this.parentElement) - this.margin.left - this.margin.right,
    this.height = 400 - this.margin.top - this.margin.bottom;

    this.initVis();
}

/**
 * Method that sets up the SVG and the variables
 */
TotalVis.prototype.initVis = function(){

    var that = this; // read about the this

    // constructs SVG layout
    this.svg = this.parentElement.select("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    // creates axis and scales

    // scale for lower values
    this.xLower = d3.scale.linear()
      .range([0, this.width/2])
      .clamp(true);
    // different scale for upper values
    this.xUpper = d3.scale.linear()
      .range([this.width/2, this.width])
      .clamp(true);

    this.y = d3.scale.ordinal()
      .rangeRoundBands([this.height, 0], .1);

    this.xAxisLower = d3.svg.axis()
      .scale(this.xLower)
      .orient("bottom")

    this.xAxisUpper = d3.svg.axis()
      .scale(this.xUpper)
      .orient("bottom")
      .ticks(5);

    this.yAxis = d3.svg.axis()
      .scale(this.y)
      .orient("left");

    // Add axes visual elements
    this.svg.append("g")
        .attr("class", "x axis lower")
        .attr("transform", "translate(0," + this.height + ")")

    this.svg.append("g")
        .attr("class", "x axis upper")
        .attr("transform", "translate(0," + this.height + ")")
        .style("fill", "purple")

    this.svg.append("g")
        .attr("class", "y axis")
       // .attr("transform", "translate(20, 0)")
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")

    // filter, aggregate, modify data
    this.wrangleData(null);

    // call the update method
    this.updateVis();
}

/**
 * Method to wrangle the data. In this case it takes an options object
 * @param _filterFunction - a function that filters data or "null" if none
 */
TotalVis.prototype.wrangleData= function(_filterFunction){

    // displayData should hold the data which is visualized
    this.displayData = this.filterAndAggregate();
}

/**
 * the drawing function - should use the D3 selection, enter, exit
 */
TotalVis.prototype.updateVis = function(){

    var that = this;  

    this.cats = ["TOTAL", "PAST-YEAR", "PAST-MONTH"];

    // y.domain will depend on whether or not we show total population
    this.y.domain(this.cats);
    
    this.xLower.domain([0, this.metaData[1]]);
    this.xUpper.domain([this.metaData[1], this.upperData]);

    // updates axis
    this.svg.select(".x.axis.lower")
        .transition()
        .duration(750)
        .call(this.xAxisLower);

    this.svg.select(".x.axis.upper")
        .transition()
        .duration(750)
        .call(this.xAxisUpper);

    this.svg.select(".y.axis")
        .transition()
        .duration(750)
        .call(this.yAxis)

    // updates graph
    // Data join
    var barLower = this.svg.selectAll(".lowerBar")
      .data(this.lowerData);

    // Append new bar groups, if required
    var barLower_enter = barLower.enter().append("g");

    // Append a rect and a text only for the Enter set (new g)
    barLower_enter.append("rect")
       .on("mouseover", function (d, i) {
         d3.select("#tooltip")
          .attr("class", "notHidden")
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY + "px")
          .style("opacity", 1)
          .select("#value")
          .text(totalLabels[totalcats[i]] + ": " + that.metaData[i])
        })
      .on("mouseout", function () {
    // Hide the tooltip on mouseout
       d3.select("#tooltip")
          .style("opacity", 0);;
      });;
    //bar_enter.append("text");

    // Add attributes (position) to lower bars
    barLower
      .attr("class", "barLower")
      .attr("transform", function (d, i) {
        return "translate (0," + that.y(that.cats[i]) + ")";
      })

    var barUpper = this.svg.selectAll(".upperBar")
      .data(this.upperData);

    // Append new bar groups, if required
    var barUpper_enter = barUpper.enter().append("g");

    // Append a rect and a text only for the Enter set (new g)
    barUpper_enter.append("rect")
       .on("mouseover", function (d, i) {
         d3.select("#tooltip")
          .attr("class", "notHidden")
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY + "px")
          .style("opacity", 1)
          .select("#value")
          .text(totalLabels[totalcats[i]] + ": " + that.metaData[i])
        })
      .on("mouseout", function () {
    // Hide the tooltip on mouseout
       d3.select("#tooltip")
          .style("opacity", 0);;
      });;

    // Add attributes (position) to all bars
    barUpper
      .attr("class", "barUpper")
      .attr("transform", function (d, i) {
        return "translate (0," + that.y(that.cats[i]) + ")";
      })

    // Remove the extra bars
    barLower.exit()
      .remove();

    barUpper.exit()
      .remove();

    // place lower bars
    barLower.select("rect")
      .transition()
      .duration(750)
      .attr("x", function(d, i){
        return 0;
      })
      .attr("y", function(d, i){
        return 25;
      })
      .attr("height", function(d){
        return that.height/8;
      })
      .attr("width", function(d, i){(console.log(d));
        return that.xLower(d);
      })

    //place upper bars
    barUpper.select("rect")
      .transition()
      .duration(750)
      .attr("x", function(d, i){
        return 0;
      })
      .attr("y", function(d, i){
        return 25;
      })
      .attr("height", function(d){
        return that.height/8;
      })
      .attr("width", function(d, i){
        return that.xUpper(d);
      })
}

/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
TotalVis.prototype.onSelectionChange= function (_filteredData){
    this.metaData = _filteredData;

    // update lowerData
    this.lowerData = [0, this.metaData[1], this.metaData[2]];
    // update upper data
    this.upperData = [this.metaData[0]]
  
    this.updateVis();
}

/**
 * The aggregate function that creates the counts for each age for a given filter.
 * @param _filter - A filter can be, e.g.,  a function that is only true for data of a given time range
 * @returns {Array|*}
 */
TotalVis.prototype.filterAndAggregate = function(_filter){

    // Set filter to a function that accepts all items
    // ONLY if the parameter _filter is NOT null use this parameter
    var filter = function(){return true;}
    if (_filter != null){
        filter = _filter;
    }

    var that = this;

    var filtered = this.metaData.filter(filter);

    return filtered;
}