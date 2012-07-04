//Title of the app
var TITLE = "Global Alert";
//RSS url
var RSS = "http://feeds.feedburner.com/RsoeEdis-EarthquakeReportM25";
//Stores alerts
var alerts = [];
var selectedEntry = "";


//Activate this line for Ajax in Windows Phone
$.support.cors = true;
$.mobile.allowCrossDomainPages = true;

//listen for detail links
$(".contentLink").live("click", function () {
    selectedEntry = $(this).data("entryid");
});

function renderAlerts() {
    var s = '';
    if (alerts.length<1)
        s += "Found " + alerts.length + " alerts. Please, check your Internet connection. <br>";
    else {
        $.each(alerts, function (i, v) {

            aTitle = v['title'].split("-");
            magnitud = aTitle[0].split(" ");

            if (magnitud[1] > 4)
                if (magnitud[1] > 5)
                    s += '<li><img src="images/redalert.png" style="float:left"> <a href="#contentPage" class="contentLink" data-entryid="' + i + '">' + magnitud[1] + " " + aTitle[1] + '</a></li>';
                else
                    s += '<li><img src="images/yellowalert.png" style="float:left"> <a href="#contentPage" class="contentLink" data-entryid="' + i + '">' + magnitud[1] + " " + aTitle[1] + '</a></li>';
            else
                s += '<li><img src="images/greenalert.png" style="float:left"><a href="#contentPage" class="contentLink" data-entryid="' + i + '">' + magnitud[1] + " " + aTitle[1] + '</a></li>';
        });
    }
    $("#linksList").html(s);
    $("#linksList").listview("refresh");
}



function cdc(path, success, fail) {

    PhoneGap.exec(         //PhoneGap.exec = function(success, fail, service, action, args)
                            success, //success
                            fail, //fail
                            "Cdc", //service
                            "Call", //action
                             path //args
                           );
};


    //Listen for main page
    $("#mainPage").live("pageinit", function () {
        //Set the title
        $("h1", this).text(TITLE);
   
    });



    function processRSS(dataxml) {      
        var xml = $(dataxml);
        var items = xml.find("item");

        $.each(items, function (i, v) {

            alerts[i] = [];

            alerts[i]['title'] = $(v).find("title").text();
            alerts[i]['link'] = $(v).find("link").text();
            alerts[i]['description'] = $(v).find("description").text();
            alerts[i]['content'] = $(v).find('content\\:encoded').html().replace("&gt;", "");
            console.log(alerts[i]['content']);

        });


        renderAlerts();
       
    }


    function onDeviceReady(e) {


        $("#mainPage").live("pagebeforeshow", function (event, data) {
            if (data.prevPage.length) {
                $("h1", data.prevPage).text("");
                $("#entryText", data.prevPage).html("");
            };
        });


        //Listen for the content page to load
        $("#contentPage").live("pageshow", function (prepage) {
            //Set the title
            $("h1", this).text(alerts[selectedEntry]['title']);
            var contentHTML = "";
            contentHTML += alerts[selectedEntry]['content'];

            $("#entryText", this).html(contentHTML);

        });



        var result = cdc(
                    {
                        path: RSS
                    },
                    function (arg) {
                        processRSS(arg);

                    }, function (arg) {
                        //If error:
                        document.getElementById('status').innerHTML = "Error, please check your internet conection";
                    });

    }

    document.addEventListener("deviceready", onDeviceReady, false);
