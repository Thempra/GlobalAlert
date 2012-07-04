//Title of the app
var TITLE = "Global Alert";
//RSS url
var RSS = "http://feeds.feedburner.com/RsoeEdis-EarthquakeReportM25";
//Stores alerts
var alerts = [];
var selectedEntry = "";

//listen for detail links
$(".contentLink").live("click", function() {
	selectedEntry = $(this).data("entryid");
});

function renderAlerts() {
    var s = '';
    $.each(alerts, function(i, v) {
    
    	aTitle=v['title'].split("-");
    	magnitud=aTitle[0].split(" ");
    	if (magnitud[1] >4 )
    		if (magnitud[1] >5 )
	    		s += '<li><img src="images/redalert.png" style="float:left"> <a href="#contentPage" class="contentLink" data-entryid="'+i+'">' +magnitud[1] + " "+ aTitle[1] + '</a></li>';
    		else
        		s += '<li><img src="images/yellowalert.png" style="float:left"> <a href="#contentPage" class="contentLink" data-entryid="'+i+'">' +magnitud[1] + " "+ aTitle[1] + '</a></li>';
        else
        	s += '<li><img src="images/greenalert.png" style="float:left"><a href="#contentPage" class="contentLink" data-entryid="'+i+'">' +magnitud[1] + " "+ aTitle[1] + '</a></li>';
    });
    $("#linksList").html(s);
    $("#linksList").listview("refresh");		
}

//Listen for main page
$("#mainPage").live("pageinit", function() {
	//Set the title
	$("h1", this).text(TITLE);
	
	$.ajax({
		url:RSS,
		success:function(res,code) {

			var xml = $(res);
			var items = xml.find("item");
			
			$.each(items, function(i, v) {
				alerts[i]=[];
				alerts[i]['title']= $(v).find("title").text();
				alerts[i]['link']= $(v).find("link").text();
				alerts[i]['description']= $(v).find("description").text();
				alerts[i]['content']= $(v).find('[nodeName="content:encoded"]').text();
				//content:$.trim($(v).find('[nodeName="content:encoded"]').text();
				
			});
			//store alerts
			localStorage["alerts"] = JSON.stringify(alerts);
			renderAlerts();
		},
		error:function(jqXHR,status,error) {
			//try to use cache
			if(localStorage["alerts"]) {
				$("#status").html("Using cached version...");
				alerts = JSON.parse(localStorage["alerts"])
				renderEntries();				
			} else {
				$("#status").html("Sorry, we are unable to get the news.");
			}
		}
	});
	
});

$("#mainPage").live("pagebeforeshow", function(event,data) {
	if(data.prevPage.length) {
		$("h1", data.prevPage).text("");
		$("#entryText", data.prevPage).html("");
	};
});

//Listen for the content page to load
$("#contentPage").live("pageshow", function(prepage) {
	//Set the title
	$("h1", this).text(alerts[selectedEntry]['title']);
	var contentHTML = "";
	contentHTML += alerts[selectedEntry]['content']
	
	$("#entryText",this).html(contentHTML);
});
	
