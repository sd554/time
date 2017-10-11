window.$ = window.jQuery = require('jquery');
var dialogs = require("dialogs")(opts={})
var fs = require("fs");
var exec = require('child_process').exec;
var say = require('say');

var log = "";
var number = "";
var effect = null;
var passcodes = JSON.parse(fs.readFileSync("passcodes.json"));

function sound(src) {
	effect = document.createElement("audio");
	effect.src = src;
	effect.play();
}

function contains(a, obj) {
	var i = a.length;
	while (i--) {
		if (a[i] === obj) {
			return true;
		}
	}
	return false;
}

$(document).ready(function(){
	$(".btn-large").click(function(){
		$(".home").hide();
		$(".input").show();
	});
	$(".login").click(function(){
		log="in";
	});
	$(".logout").click(function(){
		log="out";
	});
	$(".key").click(function(){
		if (number.length<4 || $(this).hasClass('del')) {
			sound("beep.mp3");
		}
	});
	$(".num").click(function(){
		if (number.length<4) {
			number=number+$(this).val();
			$(".numDisplay").text(number);
		}
	});
	$(".del").click(function(){
		if (number.length>0) {
			number = number.slice(0,-1);
			$(".numDisplay").text(number);
		}
	});
	$(".cancel").click(function(){
		$(".home").show();
		$(".input").hide();
		$(".numDisplay").text("");
		log="";
		number="";
	});
	$(".ok").click(function(){
		if (!(contains(Object.keys(passcodes),number))) {
			if (number.length>0) {
				dialogs.alert(number+" isn't a valid passcode.");
			} else {
				dialogs.alert("Please type in a passcode.");
			}
		} else {
			dialogs.confirm("Are you "+passcodes[number]+"?",function(ok){
				if (ok) {
					var you = passcodes[number];
					var io = log;
					var s = null;
					if (fs.existsSync("sounds/"+you.split(" ")[0]+".wav")) {
						s = "sounds/"+you.split(" ")[0]+".wav";
					} else if (fs.existsSync("sounds/"+you.split(" ")[0]+".mp3")) {
						s = "sounds/"+you.split(" ")[0]+".mp3";
					}
					if (io=="in" && s!=null) {
						console.log("yo");
						say.speak("Hello","Samantha",1.0,sound(s));
					} else if (io=="out" && s!=null) {
						say.speak("Goodbye","Samantha",1.0,sound(s));
					} else if (io=="in") {
						say.speak("Hello, "+you.split(" ")[0],"Samantha")
					} else {
						say.speak("Goodbye, "+you.split(" ")[0],"Samantha")
					}
					exec("echo "+you+","+io+" > name.txt");
					exec("python code.py");
					$(".home").show();
					$(".input").hide();
					$(".numDisplay").text("");
					log="";
					number="";
				}
			});
		}
	});
});