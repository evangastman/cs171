/*
 *
 * ======================================================
 * We follow the vis template of init - wrangle - update
 * ======================================================
 *
  THIS VISUALIZATION IS A BARCHART SHOWING 3 THINGS: TOTAL NUMBER OF PEOPLE IN SELECTED
  INCOME BRACKET, NUMBER OF PAST-YEAR HEROIN USERS IN SELECTED INCOME BRACKET,
  AND NUMBER OF PAST-MONTH HEROIN USERS IN SELECTED INCOME BRACKET.

  SINCE THE TOTAL NUMBER OF PEOPLE WILL ALWAYS BE MUCH, MUCH BIGGER THAN THE OTHER TWO BARS,
  I SUGGEST IMPLEMENTING A FEATURE THAT HIDES IT AND THEN RE-SCALES SO WE CAN COMPARE THE OTHER
  TWO BARS.
 *
 *
 * */

TotalVis = function(_parentElement, _data, _metaData){

    // NOTE: THIS VIS ONLY USES THE METADATA

    this.parentElement = _parentElement;
    this.data = _data;
    this.metaData = _metaData;

    this.displayData = [];

    // TODO: define all constants here
    this.margin = {top: 20, right: 10, bottom: 30, left: 60},
    this.width = getInnerWidth(this.parentElement) - this.margin.left - this.margin.right,
    this.height = 400 - this.margin.top - this.margin.bottom;


    console.log(this.metaData);
    console.log(to_total(this.metaData));


    console.log(to_total(this.metaData));
    // console.log(filters);

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
   
    this.x = d3.scale.linear()
      .range([this.width, 0]);

    this.y = d3.scale.ordinal()
      .rangeRoundBands([this.height, 0], .1);


    this.xAxis = d3.svg.axis()
      .scale(this.x)
      .orient("bottom")

    this.yAxis = d3.svg.axis()
    	.scale(this.y)
      .orient("left");

    // Add axes visual elements
    this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.height + ")")

    this.svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(20, 0)")
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

    // y.domain will depend on whether or not we show total population
    this.y.domain(["PAST-MONTH", "PAST-YEAR", "TOTAL"]);
    

    this.x.domain([100, 0]);

    // updates axis
    this.svg.select(".x.axis")
        .call(this.xAxis);

    this.svg.select(".y.axis")
        .call(this.yAxis)

    // updates graph
    // Data join
    var bar = this.svg.selectAll(".bar")

      .data(this.displayData, function(d,i) { 

        return d; });

    // Append new bar groups, if required
    var bar_enter = bar.enter().append("g");

    // Append a rect and a text only for the Enter set (new g)
    bar_enter.append("rect");
    //bar_enter.append("text");

    // Add attributes (position) to all bars
    bar
      .attr("class", "bar")
      .transition()
      //.attr("transform", function(d, i) { 
      	//return "translate(" + ((that.displayData.indexOf(d))*that.width/16) + "," + (that.height - that.y(d)) + ")"; })

    // Remove the extra bars
    bar.exit()
      .remove();

    // Update all inner rects and texts (both update and enter sets)
    bar.selectAll("rect")
      .attr("x", function(d, i){
      	return 30;
      })
      .attr("y", function(d, i){
      	return i * 10;
      })

      .attr("height", function(d){
      	return that.height/6;
      })

      .attr("width", function(d, i){

        //console.log(that.displayData[i].number);
        console.log(that.x(that.displayData[i].number));

        // console.log(that.displayData[i].number);

        return that.x(that.displayData[i].number);
      })
      /*
      .style("fill", function(d) {
        var i = that.displayData.indexOf(d);
        return that.metaData["priorities"][i.toString()]["item-color"];
      }) */

      .transition()

}


/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
TotalVis.prototype.onSelectionChange= function (selectionStart, selectionEnd){

    // TODO: call wrangle function
    this.wrangleData(function(d) { return (d.time >= selectionStart && d.time <= selectionEnd); });

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
