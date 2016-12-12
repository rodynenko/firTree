/*
	part of firTree project;
	created by Taras Rodynenko (fb.com/taras.rodynenko)
*/
var data = [
	{ year: 2008, type: 'комбінована', president: "Ющенко", height:35},
	{ year: 2009, type: 'комбінована', president: "Ющенко", height:35},
	{ year: 2010, type: 'штучна', president: "Янукович", height:35},
	{ year: 2011, type: 'штучна', president: "Янукович", height:40},
	{ year: 2012, type: 'штучна', president: "Янукович", height:35},
	{ year: 2013, type: 'штучна', president: "Янукович", height:0},
	{ year: 2014, type: 'натуральна', president: "Порошенко", height:24},
	{ year: 2015, type: 'натуральна', president: "Порошенко", height:25},
	{ year: 2016, type: 'натуральна', president: "Порошенко", height:26}
];

var types = {
	'комбінована': getRectanglePath,
	'штучна': getTrianglePath,
	'натуральна': getCirclePath
}

var presidentColor ={
	"Ющенко" : 'orange',
	"Янукович" : 'DeepSkyBlue',
	"Порошенко": 'green'

}

buildViz(data);

function buildViz(data){

	var width = 600,
			height = 500,
			barChartHeight = 300,
			pointRadius = 5;
			barWidth = (width)/data.length;

	var svg = d3.select('#viz')
		.append('svg')
		.attr('width', width)
		.attr('height', height)
		.append('g');

	// tooltip with description and image
	var tooltip = d3.select('body')
		.append('div')
		.attr('class', 'tooltip tooltip__hide');

	/*
		SVG structure:
		1. (30px) color and icons legend
		2. (300px) bar chart of firTree height + axis Y
		3. (30px) year titles (axis X)
	*/

	// axis X
	var axisX = svg.append('g')
		.attr('transform', 'translate(0, 440)');

	axisX.selectAll('.axisx-line')
		.data(data)
		.enter()
		.append('line')
			.attr('class', 'axisx-line')
			.attr('x1', function(d,i){return i*barWidth;})
			.attr('y1', 0)
			.attr('x2', function(d,i){return (i+1)*barWidth-1;})
			.attr('y2', 0)
			.style('stroke-width', 2)
			.style('stroke', function(d){return presidentColor[d.president];});

	axisX.selectAll('.axisx-label')
		.data(data)
		.enter()
		.append('text')
			.attr('class', 'axisx-label')
			.attr('transform',function(d,i){ return 'translate('+(i*barWidth + barWidth/2)+',20)'; })
			.text(function(d){return d.year;})
			.attr('text-anchor','middle');

	// axis Y
	var y = d3.scaleLinear()
		.domain([0, d3.max(data, function(el){ return el.height; })])
		.range([300, 0]);

	// legend

	var legend = svg.append('g')
		.attr('transform','translate(0,0)');

		// presidents' colors

	var legendPresidents = legend.append('g')
		.attr('transform', 'translate(83,20)');

	legendPresidents.selectAll('.legend_president-color')
		.data(Object.keys(presidentColor))
		.enter().append('rect')
			.attr('width', 50)
			.attr('height', 20)
			.attr('transform', function(d,i){ return 'translate('+160*i+',0)'})
			.style('fill', function(d){ return presidentColor[d]; });

	legendPresidents.selectAll('.legend_president-text')
		.data(Object.keys(presidentColor))
		.enter().append('text')
			.attr('transform', function(d,i){ return 'translate('+(160*i+55)+',15)'})
			.text(function(d){ return d;});

		// figures types
	var legendTypes = legend.append('g')
		.attr('transform', 'translate(130,60)');

	legendTypes.selectAll('.legend_types')
		.data(Object.keys(types))
		.enter().append('path')
			.attr('d', function(d){ return types[d](5);})
			.attr('transform', function(d,i){ return 'translate('+(125*i)+',0)'})
			.style('fill', "gray")
			.append('text')
			.text(function(d){ return d;});

	legendTypes.selectAll('.legend_types-text')
		.data(Object.keys(types))
		.enter().append('text')
			.attr('transform', function(d,i){ return 'translate('+(125*i +15)+',10)'})
			.text(function(d){ return d;});

	// bar chart
	var barChart = svg.append('g')
		.attr('transform','translate(0, 140)');

	barChart.selectAll('.firTree-height-point_line')
		.data(data)
		.enter()
		.append('line')
			.attr('class', 'firTree-height-point_line')
			.attr('x1', function(d,i){ return i*barWidth+barWidth/2; })
			.attr('y1', function(d){ return y(d.height); })
			.attr('x2', function(d,i){ return i*barWidth+barWidth/2; })
			.attr('y2', function(d){ return y(0); });

	barChart.selectAll('.firTree-height-point')
		.data(data)
		.enter()
		.append('path')
			.attr('class', 'firTree-height-point')
			.attr('d', function(d){ return types[d.type](7); })
			.attr('transform', function(d,i){ return "translate("+(i*barWidth+barWidth/2-7)+","+(y(d.height)-7)+")"; })
			.style('fill', function(d){ return presidentColor[d.president]; });

	barChart.selectAll('.firTree-height-point_label')
		.data(data)
		.enter()
		.append('text')
			.attr('class', 'firTree-height-point_label')
			.attr('x', function(d,i){ return i*barWidth+barWidth/2; })
			.attr('y', function(d){ return y(d.height)-pointRadius-5; })
			.attr('text-anchor', 'middle')
			.text(function(d){ return d.height+" м"});

}

function getCirclePath(radius){
	return "M0,"+radius+"a"+radius+","+radius+" 0 1,0 "+2*radius+",0a"+radius+","+radius+" 0 1,0 -"+2*radius+",0";
}

function getRectanglePath(radius){
	var width = 2*radius;
	return "M 0 0 H "+width+" V "+width+" H 0 Z";
}

function getTrianglePath(radius){
	var width = 2*radius;
	return "M 0 "+width+" H "+width+" L "+width/2+" 0 Z"
}
