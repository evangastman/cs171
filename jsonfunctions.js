/*

Hi! This file contains functions to wrangle the wrangled data even more.

We have 3 basic views that use this dataset:
1. the totals barchart. this is only ever filtered by income.
DATA: 
- total population
- total heroin users in past year
- total heroin users in past month

2. the mental health (mh) pie chart
DATA:
- total number of heroin users (passing the filter) in each mental health category
(each pie slice is this, adjusted by the number of heroin users passing the filter,
which can be found by summing the array)

3. the crime barchart
- total number of heroin users (passing the filter) in each crime category

Our 4th view might be the map, but that will use a differently-wrangled set of data.
Since we haven't really discussed that one, I'm waiting before going forward with it.

My one concern at this point is that our project does not feel quite "interactive"
enough. Even though the views are basically all coordinated, they're just responding
to filters. This isn't technically different from a slider or a brush or whatever,
but those have a "real-time" dynamic feel to them. Unfortunately we can't do time due
to the survey having changed. It's also really hard to do any kind of brush or slider
without continuous varaibles. This survey does not allow respondents to input values,
however, so we have none of those.


NOTE: I HAVE COPIED ALL THESE FUNCTIONS TO index.html

*/

// these need to be loaded in. data is CS171_UsersOnly_JSON.json and metadata is CS171_metaData.json
var data;
var metadata;

var totalcats = ["number", "HERYR", "HERMON"];

var crimecats = ["BOOKED", "BKSRVIOL", "BKSMASLT", "BKDRVINF", "BKDRUG", "HERLAWTR"];

var mhcats = ["MHNSPTR2", "NMHSPTR2", "MHASPTR2"];

var filters = {
	income: null,
	age: null,
	sex: null
}


/* filter the data! I wrote this function to act on a single datum, and I call it in
	the to_crime and to_mh functions. I think this is more efficient than filtering all
	the data at once, since it means we have to loop through it fewer times. But the
	dataset is obviously small enough that this won't be noticeable, so if you would
	rather filter the data all at once then just turn put this code into a for loop.
*/
function filter (d){
	if((d["INCOME"] != filters.income && filters.income != null)
		&& (d["CATAG3"] != filters.age && filters.age != null)
		&& (d["IRSEX"] != filters.sex && filters.sex != null))
		return false;
	else
		return true; 
}

// returns array of length 3: population, heroin users in past year, heroin users in past month
function to_total(_metadata){
	
	var totaldata = [0, 0, 0];

	if(filters.income == null){
		for(i in metadata){
			totaldata[0] += _metadata[i]["number"];
			totaldata[1] += _metadata[i]["HERYR"];
			totaldata[2] += _metadata[i]["HERMON"];
		}

	}

	else{
		for(i in _metadata){
			if(_metadata[i]["INCOME"] == filters.income){
				totaldata[0] == _metadata[i]["number"];
				totaldata[1] == _metadata[i]["HERYR"];
				totaldata[2] == _metadata[i]["HERMON"];
				break;
			}
		}
	}

	

	return totaldata;
}

// returns array of number of heroin users fitting each crime category
function to_crime(_data){

	var crimedata = [0, 0, 0, 0, 0, 0];

	for(i in _data){
		if(filter(_data[i])){
			for(j in crimecats){
				if(data[i][crimecats[j]] == 1){
					crimedata[j] ++;
				}
			}
		}
	}

	return crimedata;
}

// returns array of number of heroin users fitting each mental health category
function to_mh(_data){

	var mhdata = [0, 0, 0];

	for(i in _data){
		if(filter(_data[i])){
			for(j in mhcats){
				if(_data[i][mhcats[j]] == 1){
					mhdata[j] ++;
				}
			}
		}
		
	}

	return mhdata;
}