var loginFlag = false;
var updateDateFlag = "false";
var students = [];
var announcement;

var positionList = [];
var gradeList = [];
var sectionList = [];

var schoolIdx = $("#school-idx").text();
$("#main-page").hide();

function getSchoolDetail(){
    $.ajax({
        type: "POST",
        url: "get-school-detail.php",
        dataType: 'html',
        data: {
            dummy:"dummy"
        },
        success: function(response){
            var resp = response.split("*_*");
            if(resp[0] == "true"){
                renderSchoolDetail(resp[1]);
            }else{
                myAlert(response, 1000);
            }
        }
    });
}

function renderSchoolDetail(data){
    var lists = JSON.parse(data);
    lists.forEach(function(list){
        var positions = JSON.parse(list.positionlist);
        var grades = JSON.parse(list.gradelist);
        var sections = JSON.parse(list.sectionlist);

        positions.forEach(function(pos){
            positionList[pos.idx] = pos.name;
        });

        grades.forEach(function(grade){
            gradeList[grade.idx] = grade.name;
        });

        sections.forEach(function(section){
            sectionList[section.idx] = section.name;
        });
    });

    updateTime();
    updateDate();
    getAnnouncementList();
}

function processCard(cardId){
    if(loginFlag){
        getCardDetail(cardId);
    }else{
        kioskLogin(cardId);
    }
}

function kioskLogin(cardId){
    showProcessing();
    $.ajax({
        type: "POST",
        url: "kiosk-login.php",
        dataType: 'html',
        data: {
            cardid:cardId,
            schoolidx:schoolIdx
        },
        success: function(response){
            hideProcessing();
            if(response == "true"){
                loginFlag = true;
                $("#login-page").hide();
                $("#main-page").show();
                getSchoolDetail();
            }else{
                myAlert(response, 1000);
            }
        }
    });
}

function getCardDetail(cardId){
    showProcessing();
    $.ajax({
        type: "POST",
        url: "get-card-detail.php",
        dataType: 'html',
        data: {
            cardid:cardId,
            schoolidx:schoolIdx
        },
        success: function(response){
            var resp = response.split("*_*");
            if(resp[0] == "true"){
                renderCardDetail(resp[1]);
            }else{
                hideProcessing();
                myAlert(response, 1000);
            }
        }
    });
}

function renderCardDetail(data){
    var lists = JSON.parse(data);
    lists.forEach(function(list){
        var details = new Map();
        details.set("image",list.image);
        details.set("firstname", list.firstname);
        details.set("lastname", list.lastname);
        details.set("activity", list.activity);
        
        if(list.type == "student"){
            details.set("grade",gradeList[list.grade]);
            details.set("section",sectionList[list.section]);
        }else{
            var saccess = list.saccess;
            if(saccess == "faculty"){
                details.set("grade", "Faculty");
            }else{
                details.set("grade",positionList[list.saccess]);
            }
            details.set("section","&nbsp;");
        }
        
        if(students.length > 11){
            students.pop();
        }
        students.unshift(details);
    })
    renderCards(students);
}

function myAlert(msg,duration){
    var alt = document.createElement("div");
    alt.setAttribute("style","position:absolute;top:40%;left:40%;padding:20px;border-radius:50px;background-color:red;color:white;");
    alt.innerHTML = msg;
    setTimeout(function(){
        alt.parentNode.removeChild(alt);
    },duration);
    document.body.appendChild(alt);
}

function renderCards(students){
    var markUp = '<div class="row-6">';
    var i = 0;
    for(var z=0; z<students.length; z++){
        var map = students[z];
        i ++;
        var image = map.get("image");
        if(image == ""){
            if(!image.includes("data:image/png;base64")){
                image = "../system/images/no-image-available.jpg";
            }
        }
        
        var activity = map.get("activity");
        if(activity == "logout"){
            color = "#d9534f";
        }else{
            color = "#5cb85c";
        }
        markUp += '<div class="col-2 d-inline m-1">\
                        <div style="border:3px solid '+color+'">\
                            <img class="w-100 bg-warning" src='+image+'>\
                            <div class="p-2" style="background-color:'+color+'">';
        markUp += '<p class="p-0 m-0 text-center text-white font-weight-bold">'+map.get("lastname")+'</p>';
        markUp += '<p class="p-0 m-0 text-center text-white">'+map.get("firstname")+'</p>';
        markUp += '<p class="p-0 m-0 text-center text-white">'+map.get("grade")+'</p>';
        markUp += '<p class="p-0 m-0 text-center text-white">'+map.get("section")+'</p>';            
        markUp += '</div></div></div>';
        if(i > 5){
            i = 0;
            markUp += '</div><div class="row-6">';
        }
    }
    if(i != 0){
        for(var z=0;i<6;i++){
            markUp += '<div class="col"></div>';
        }
        markUp += '</div>';
    }
    $("#detected-student-container").html(markUp);
    hideProcessing();
}

function updateDate(){
    var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    var today = new Date();
    var month = today.getMonth();
    var day = today.getDate();
    var year = today.getFullYear();
    var date = months[month] + " " + day + ", " + year; 
    $("#date").text(date);
}

function updateTime(){
    var today = new Date();
    var hour = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds();
    if(hour == 0 && updateDateFlag == "false"){
        updateDateFlag = "true";
        updateDate();
    }
    if(hour == 1 && updateDateFlag == "true"){
        updateDateFlag = "false";
    }
    if(hour > 12){
        hour = hour - 12;
    }
    if(minutes < 10){
        minutes = "0" + minutes;
    }
    if(seconds < 10){
        seconds = "0" + seconds;
    }
    
    var time = hour + ":" + minutes + ":" + seconds;
    $("#clock").text(time);
    setTimeout(function(){
        updateTime();
    },1000);
}

function getAnnouncementList(){
    $.ajax({
        type: "POST",
        url: "get-announcement-list.php",
        dataType: 'html',
        data: {
            dummy:"dummy"
        },
        success: function(response){
            setTimeout(function(){
                getAnnouncementList();
            },10000)
            var resp = response.split("*_*");
            if(resp[0] == "true"){
                renderAnnouncementList(resp[1]);
            } else{
                myAlert(response, 1000);
            }
        }
    });
}

function renderAnnouncementList(data){
    if(announcement == data){
        return;
    }else{
        announcement = data;
    }
    var lists = JSON.parse(announcement);
    var markUp = '<marquee behavior="scroll" scrollamount="10" direction="left" style="font-size:30px;color:white;"><span class="fa fa-circle mr-2"></span>Powered by: DMDTech Solutions';
    lists.forEach(function(list){
        markUp += '&nbsp;&nbsp;&nbsp;&nbsp;<span class="fa fa-circle mr-2"></span>'+list.text;
    })
    markUp += '</marquee>';
    $("#announcement-container").html(markUp);
}

function showProcessing(){
    $("#spinner").show();
}

function hideProcessing(){
    $("#spinner").hide();
}


/************** RFID Reader ************/
var startCapture = false;
$(function() {
	$(window).keypress(function(e) {
		var ev = e || window.event;
		var key = ev.keyCode || ev.which;
		if(startCapture == false){
			cardId = "";
			startCapture = true;
			setTimeout(function(){
				startCapture = false;
			},600);
		}
		if(key == 13 && startCapture == true){
            startCapture = false;
            processCard(cardId);
		}
        if(startCapture == true){
			var c = String.fromCharCode(key);
            if(c != '\r'){
                cardId += c;
            }
		}
	});
});
