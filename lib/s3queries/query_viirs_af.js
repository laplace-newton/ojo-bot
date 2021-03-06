var util 			= require('util'),
	fs				= require('fs'),
	async	 		= require('async'),
	path			= require('path'),
	moment			= require('moment'),
	_				= require('underscore'),
	Hawk			= require('hawk'),
	filesize 		= require('filesize'),
	Query			= require('./query_s3');
	
	var	bbox		=	[60, 40, 80, 20];				// lng,lat bottom left - top right
	var	centerlon	=  	(bbox[0]+bbox[2])/2;
	var	centerlat	=	(bbox[1]+bbox[3])/2;
	
	var options = {
		bucket: 		'ojo-*',
		subfolder: 		'viirs_af',
		browse_img: 	'_thn.jpg',						// will be something like subfolder.yyyymmddxxxxx
		geojson: 		'.geojson',
		geojsongz: 		'.geojson.gz',
		topojson: 		undefined,
		topojson_gz: 	undefined,
		source: 		'sources.viirs',
		sensor: 		'sensors.viirs',
		resolution: 	'375m',
		original_url:   'http://viirsfire.geog.umd.edu/pages/mapsData.php',
		product: 		'active_fires',
		tags: 			['active_fires', 'fires', 'viirs', 'hazard', 'disaster'],
		bbox: 			bbox,							// lng,lat bottom left - top right
		target: 		[centerlon, centerlat],
		minzoom: 		6,
		prefix_map: 	{
			'active_fires': 'viirs_af'
		}
	}

	var colors = [ "#f7fcf0","#e0f3db","#ccebc5","#a8ddb5","#7bccc4","#4eb3d3","#2b8cbe","#0868ac","#084081","#810F7C" ]

	options.credits	= function(req) {
		var json = {
			"credits":  req.gettext("legend.active_fires_viirs.credits"),
			"url": 		"https://earthdata.nasa.gov",
		};
		return json;
	}

	options.style = function(req) {
		var host = req.protocol + "://"+ req.get('Host')
		var json = {
			"true": {
				property: 'brightness',
				scale: 0.02,
				fillOpacity: 0.5,
				weight: 0.5,
				color: '#ff0000',
				icon: host + "/img/fire2.png",
				iconSize: [48,48],
				iconAnchor:[24,48]
			}
		}
		return json
	}

	options.legend = function(req) {
		var host 	= req.protocol + "://"+ req.get('Host')
		var iconUrl = host + "/img/fire2.png"
		
		var html = "<style id='viirs_af_legend_style' >"
	    html += ".viirs_af_map-info .legend-scale ul {"
	    html += "   margin: 0;"
	    html += "   margin-bottom: 5px;"
	    html += "   padding: 0;"
	    html += "   float: right;"
	    html += "   list-style: none;"
	    html += "   }"
		html += ".viirs_af_map-info .legend-scale ul li {"
		html += "   font-size: 80%;"
		html += "   list-style: none;"
		html += "    margin-left: 0;"
		html += "    line-height: 18px;"
		html += "    margin-bottom: 2px;"
		html += "}"
	    html += ".viirs_af_map-info ul.legend-labels li span {"
	    html += "  display: block;"
	    html += "  float: left;"
	    html += "  height: 16px;"
	    html += "  width: 30px;"
	    html += "  margin-right: 5px;"
	    html += "  margin-left: 0;"
	    html += "  border: 1px solid #999;"
	    html += "}"
	    html += ".viirs_af_map-info .legend-source {"
	    html += "   font-size: 70%;"
	    html += "   color: #999;"
	    html += "   clear: both;"
	    html += "}"
		html += ".viirs_af_map-info {"
		html += "    padding: 6px 8px;"
		html += "    font: 14px/16px Arial, Helvetica, sans-serif;"
		html += "    background: white;"
		html += "    background: rgba(255,255,255,0.8);"
		html += "    box-shadow: 0 0 15px rgba(0,0,0,0.2);"
		html += "    border-radius: 5px;"
		html += "	 position: relative;"
		html += "	 float: right;"
		html += "    line-height: 18px;"
		html += "    color: #555;"
	
		html += "}"
		html += "</style>"
	
		html += "<div id='viirs_af_legend' class='viirs_af_map-info'>"
		html += "  <div class='legend-title'>"+ req.gettext("legend.active_fires_viirs.title")+"</div>"
		html += "  <div class='legend-scale'>"
		html += "    <ul class='legend-labels'>"
		html += "	   <li><img src='"+iconUrl+"' width=32 />&nbsp;"+ req.gettext("legend.active_fires_viirs.legend") +"</li>"
		html += "    </ul>"
		html += "  </div>"
		html += "<div class='legend-source'>"+ req.gettext("legend.active_fires_viirs.source.label")+": <a href='https://earthdata.nasa.gov/data/near-real-time-data/firms/active-fire-data'>"+ req.gettext("legend.active_fires_viirs.source.source")+"</a>"
		html += "</div>&nbsp;&nbsp;"
		
		return html
	}
		
	var query				= new Query(options)
	query.source			= "viirs"
	module.exports.query 	= query;



