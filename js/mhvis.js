// /*
// 	Hi! this makes a pie chart for our mental health data
// */

mhVis = function(_parentElement, _data, _metaData){
    this.parentElement = _parentElement;
    this.data = _data;
    this.metaData = _metaData;
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


// /**
//  * Method to wrangle the data. In this case it takes an options object
//  * @param _filterFunction - a function that filters data or "null" if none
//  */
// mhVis.prototype.wrangleData= function(_filterFunction){

//     // displayData should hold the data which is visualized
//     this.displayData = this.filterAndAggregate(_filterFunction);

//     //// you might be able to pass some options,
//     //// if you don't pass options -- set the default options
//     //// the default is: var options = {filter: function(){return true;} }
//     //var options = _options || {filter: function(){return true;}};
// }


mhVis.prototype.updateVis = function(){
	var that = this;

  	this.g = this.svg.selectAll(".arc")
      .data(this.pie(this.data))
    .enter().append("g")
      .attr("class", "arc");

  this.g.append("path")
      .attr("d", this.arc)
      .style("fill", function(d, i) { return that.color(i); });

  this.g.append("text")
      .attr("transform", function(d) { return "translate(" + that.arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function(d, i) { return mhcats[i]; });
}


// /**
//  * Gets called by event handler and should create new aggregated data
//  * aggregation is done by the function "aggregate(filter)". Filter has to
//  * be defined here.
//  * @param selection
//  */
// mhVis.prototype.onSelectionChange= function (selectionStart, selectionEnd){
    
//     // if brush is empty, give wrangleData null as its argument
//     if(selectionStart == "empty") {
//         this.wrangleData(null)
//         }
//     // else wrangle the data to get the data in the brush selection
//     else {
//             this.wrangleData(function (d) { 
//                 return d.time > selectionStart && d.time < selectionEnd
//             })
//         }

//     this.updateVis();
// }


// /**
//  * The aggregate function that creates the counts for each age for a given filter.
//  * @param _filter - A filter can be, e.g.,  a function that is only true for data of a given time range
//  * @returns {Array|*}
//  */
// mhVis.prototype.filterAndAggregate = function(_filter){


//     // Set filter to a function that accepts all items
//     // ONLY if the parameter _filter is NOT null use this parameter
//     var filter = function(){return true;}
//     if (_filter != null){
//         filter = _filter;
//     }
//     //Dear JS hipster, a more hip variant of this construct would be:
//     // var filter = _filter || function(){return true;}

//     var that = this;

//     // create an array of values for age 0-100
//     var res = d3.range(100).map(function () {
//          return 0;
//     });

//     // accumulate all values that fulfill the filter criterion

//     // TODO: implement the function that filters the data and sums the values
//     this.data
//         .filter(filter)
//         .forEach(function (d) {
//             d3.range(100).forEach(function (e){
//                res[e] += d.ages[e]; 
//             })
//         })

//     return res;

// }

