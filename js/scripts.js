//JAVASCRIPT CONTENT
"use strict";
const dark = new Dark();
const that = this;
const audio = new window.Audio();
this.cache = {};
this.playCode = 1;
audio.controls = true;
this.state = 0;
this.playerState = true;
dark.selectId("test").innerText = 2.4;

var play = dark.selectId("play");
var pause = dark.selectId("pause");
var picture = dark.selectId("picture");
var box = dark.selectId("box");
var __eul = dark.selectId("lrc");
var next = dark.selectId("next");
var previous = dark.selectId("previous");
var musicInfo = dark.selectId("musicInfo");
var boxBackground = dark.selectId("boxBackground");
var oLRC, ppxx, currentLine;

play.style.left = (window.innerWidth / 2 - 23) + "px";
pause.style.left = (window.innerWidth / 2 - 23) + "px";
picture.style.top = (window.innerHeight / 8) + "px";
picture.style.left = (window.innerWidth / 2 - picture.clientWidth / 2) + "px";
box.style.top = (window.innerHeight / 3) + "px";
box.style.left = (window.innerWidth / 2 - box.clientWidth / 2) + "px";
box.style.height = (window.innerHeight / 2.5) + "px";
boxBackground.style.top = box.style.top;
boxBackground.style.left = box.style.left;
boxBackground.style.height = box.style.height;
next.style.left = (window.innerWidth / 2 + 60) + "px";
previous.style.left = (window.innerWidth / 2 - 106) + "px";

window.onresize = function () {
	play.style.left = (window.innerWidth / 2 - 23) + "px";
	pause.style.left = (window.innerWidth / 2 - 23) + "px";
	picture.style.top = (window.innerHeight / 8) + "px";
	picture.style.left = (window.innerWidth / 2 - picture.clientWidth / 2) + "px";
	musicInfo.style.left = (window.innerWidth / 2 - musicInfo.clientWidth / 2) + "px";
	box.style.top = (window.innerHeight / 3) + "px";
	box.style.left = (window.innerWidth / 2 - box.clientWidth / 2) + "px";
	box.style.height = (window.innerHeight / 2.5) + "px";
	boxBackground.style.top = box.style.top;
	boxBackground.style.left = box.style.left;
	boxBackground.style.height = box.style.height;
	next.style.left = (window.innerWidth / 2 + 60) + "px";
	previous.style.left = (window.innerWidth / 2 - 106) + "px";
	if (document.getElementById("mName").scrollWidth < musicInfo.clientWidth) {
		document.getElementById("mName").style.animationName = null;
	} else if (document.getElementById("mPeo").scrollWidth < musicInfo.clientWidth) {
		document.getElementById("mPeo").style.animationName = null;
	}
	console.log("chenge!");
};

play.addEventListener("click", Play);
pause.addEventListener("click", Pause);
next.addEventListener("click", Next);
previous.addEventListener("click", Previous);

audio.addEventListener("timeupdate", function () {
	for (currentLine = 0; currentLine < oLRC.ms.length; currentLine++) {
		try {
			if (this.currentTime < oLRC.ms[currentLine + 1].t){
				currentLine > 0 ? __eul.children[currentLine - 1].setAttribute("style", "color: auto") : null;
				currentLine > 1 ? __eul.children[currentLine - 2].setAttribute("style", "color: auto") : null;
				currentLine > 2 ? __eul.children[currentLine - 3].setAttribute("style", "color: auto") : null;
				currentLine > 3 ? __eul.children[currentLine - 4].setAttribute("style", "color: auto") : null;
				__eul.children[currentLine].setAttribute("style", "color: rgb(170, 170, 170)");
				__eul.style.transform = "translateY(" + (ppxx - __eul.children[currentLine].offsetTop) + "px)";
				break;
			}
		} catch (err) {
			console.log("Time Error", err);
		}
	}
});
audio.addEventListener("pause", function() {
	Pause();
	console.log("BEEN PAUSE!");
});
audio.addEventListener("play", function() {
	Play();
	console.log("BEEN PLAY!");
});
audio.addEventListener("canplay", function(){
	Play();
	console.log("AUTO PLAY!");
});
audio.addEventListener("ended", function() {
	Pause();
	if (that.eli) {
		__eul.innerHTML = "";
	}
	that.playCode++;
	request();
});

request();
function request() {
	dark.Ajax({
		"method": "GET",
		"url": "https://api.uomg.com/api/rand.music",
		"headers": {
			"Content-Type": "application/x-www-form-urlencoded"
		},
		"parameter": {
			"sort": "热歌榜",
			"format": "json"
		},
		"dataType": "json",
		"responseType": "json",
		"success": function() {
			that.req = 0;
			that.cache[(window.Object.keys(that.cache).length + 1)] = this.response;
			initPicture(this.response);
			resource(this.response);
			playerInit(this.response);
		},
		"fail": function() {
			console.log("Try again: ", that.req++);
			if (that.req > 6) {
				window.alert("Error is " + that.req + ", Please reflash view that try.");
				return false;
			}
			req();
		}
	});
}
function resource(obj) {
	dark.Ajax({
		"method": "POST",
		"url": "http://106.13.11.200:5000/req",
		"headers": {
			"Content-Type": "application/x-www-form-urlencoded"
		},
		"parameter": {
			"songids": /url\?id\=(\d{3,12})/.exec(obj.data.url)[1]
		},
		"dataType": "json",
		"responseType": "json",
		"success": function () {
			if (window.JSON.parse(this.response[0]).data[0].url == null) {
				console.log("The current song has no copyright, Please next song.");
				that.playerState = true;
				Next();
				return false;
			}
			initAudioRes(this.response);
			initAudioLyric(this.response);
		}
	});
}
function initPicture(obj) {
	picture.style.backgroundImage = "url(" + obj.data.picurl + ")";
}
function initAudioRes(obj) {
	audio.src = window.JSON.parse(obj[0]).data[0].url;
	return that.state = 1;
}
function initAudioLyric(obj) {
	createLrcObj(window.JSON.parse(obj[1]).lrc.lyric);
}
function playerInit(result) {
	musicInfo.innerHTML = "<p id=\"mName\" style=\"font-size: 30px; margin-top: 3px; margin-bottom: 3px; font-weight: bolder;\">" + result.data.name + "</p>" + "<p id=\"mPeo\" style=\"font-size: 15px; margin-top: 1px;\">" + result.data.artistsname + "</p>";
	musicInfo.style.left = (window.innerWidth / 2 - musicInfo.clientWidth / 2) + "px";
	if (document.getElementById("mName").scrollWidth > musicInfo.clientWidth) {
		console.log("Text is long.");
		musicNameAnimation();
	} else if (document.getElementById("mPeo").scrollWidth > musicInfo.clientWidth) {
		console.log("Text is long.");
		musicPeoAnimation();
	}
}
function Previous() {
	that.playCode--;
	if (window.Object.keys(that.cache).length < 2 || that.playCode <= 0) {
		console.log("No cache");
		return false;
	}
	Pause();
	if (that.eli) {
		__eul.innerHTML = "";
	}
	initPicture(that.cache[that.playCode]);
	resource(that.cache[that.playCode]);
	playerInit(that.cache[that.playCode]);
	previousAnimation();
	previous.addEventListener("animationend", function () {
		previous.style.animationName = "none";
		console.log("Next animation is end.");
	});
}
function Next() {
	if (that.playerState != true) {
		console.log("Don't click");
		return false;
	}
	if (that.playCode < window.Object.keys(that.cache).length){
		that.playCode++;
		Pause();
		if (that.eli) {
			__eul.innerHTML = "";
		}
		initPicture(that.cache[that.playCode]);
		resource(that.cache[that.playCode]);
		return true;
	}
	request();
	that.playCode++;
	audio.src = null;
	console.log("Next is click!");
	if (that.eli) {
		__eul.innerHTML = "";
	}
	Pause();
	nextAnimation();
	next.addEventListener("animationend", function () {
		next.style.animationName = "none";
		console.log("Next animation is end.");
	});
}
function Play() {
	console.log("Play is click!");
	if (that.state == 1 && that.playerState == true) {
		audio.play();
		playAnimation();
	} else {
		console.log("state", that.state);
		return false;
	}
}
function Pause() {
	console.log("Pause is click!");
	if (that.state == 0 && that.playerState == true) {
		audio.pause();
		pauseAnimation();
	} else {
		console.log("state", that.state);
		return false;
	}
}
function playAnimation() {
	picture.style.animationPlayState = "running";
	play.style.animationName = "cShow, zoomOut";
	play.style.animationDuration = "0.4s, 0.15s";
	play.style.animationTimingFunction = "linear, linear";
	play.style.animationIterationCount = "1, 1";
	play.style.display = "none";
	pause.style.animationName = "show, zoomIn";
	pause.style.animationDuration = "0.4s, 0.15s";
	pause.style.animationTimingFunction = "linear, linear";
	pause.style.animationIterationCount = "1, 1";
	pause.style.display = "inline";
	that.state = 0;
}
function pauseAnimation() {
	picture.style.animationPlayState = "paused";
	pause.style.animationName = "cShow, zoomOut";
	pause.style.animationDuration = "0.4s, 0.15s";
	pause.style.animationTimingFunction = "linear, linear";
	pause.style.animationIterationCount = "1, 1";
	pause.style.display = "none";
	play.style.animationName = "show, zoomIn";
	play.style.animationDuration = "0.4s, 0.15s";
	play.style.animationTimingFunction = "linear, linear";
	play.style.animationIterationCount = "1, 1";
	play.style.display = "inline";
	that.state = 1;
}
function nextAnimation() {
	next.style.animationName = "sTurn";
	next.style.animationDuration = "0.2s";
	next.style.animationTimingFunction = "linear";
	next.style.animationIterationCount = 6;
	next.style.animationDirection = "alternate";
}
function previousAnimation() {
	previous.style.animationName = "sTurn";
	previous.style.animationDuration = "0.2s";
	previous.style.animationTimingFunction = "linear";
	previous.style.animationIterationCount = 6;
	previous.style.animationDirection = "alternate";
}
function musicNameAnimation() {
	document.getElementById("mName").style.animationName = "wordsLoop";
	document.getElementById("mName").style.animationDuration = "6s";
	document.getElementById("mName").style.animationTimingFunction = "linear";
	document.getElementById("mName").style.animationIterationCount = "infinite";
}
function musicPeoAnimation() {
	document.getElementById("mPeo").style.animationName = "wordsLoop";
	document.getElementById("mPeo").style.animationDuration = "6s";
	document.getElementById("mPeo").style.animationTimingFunction = "linear";
	document.getElementById("mPeo").style.animationIterationCount = "infinite";
}
function createLrcObj(lrc) {
	oLRC = null;
	if(lrc.length==0) return;
	var lrcs = lrc.split('\n');
	oLRC = {
		ti: "",
		ar: "",
		al: "",
		by: "",
		offset: 0,
		ms: []
	};
	currentLine = 0;
	for(var i in lrcs) {
		lrcs[i] = lrcs[i].replace(/(^\s*)|(\s*$)/g, "");
		var t = lrcs[i].substring(lrcs[i].indexOf("[") + 1, lrcs[i].indexOf("]"));
		var s = t.split(":");
		if (isNaN(parseInt(s[0]))) {
			for (var i in oLRC) {
				if (i != "ms" && i == s[0].toLowerCase()) {
					oLRC[i] = s[1];
				}
			}
		} else {
			var arr = lrcs[i].match(/\[(\d+:.+?)\]/g);
			var start = 0;
			for(var k in arr) {
				start += arr[k].length;
			}
			var content = lrcs[i].substring(start);
			for (var k in arr) {
				var t = arr[k].substring(1, arr[k].length-1);
				var s = t.split(":");
				oLRC.ms.push({
					t: (parseFloat(s[0])*60+parseFloat(s[1])).toFixed(3),
					c: content
				});
			}
		}
	}
	oLRC.ms[(window.Object.keys(oLRC.ms).length)] = {
		"t": (window.Math.floor(oLRC.ms[(window.Object.keys(oLRC.ms).length - 1)].t) + 3),
		"c": ""
	};
	ppxx = 150;
	console.log(oLRC.ms.length);
	for (var i in oLRC.ms) {
		that.eli = document.createElement("li");
		that.eli.innerText = oLRC.ms[i].c;
		__eul.appendChild(that.eli);
	}
}
window.onkeydown = function(e) {
	if (e.keyCode == 32) {
		console.log("Speace!");
		if (that.state == 1) {
			Play();
		} else if (that.state == 0) {
			Pause();
		} else {
			console.log("Error!");
		}
	}
	if (e.shiftKey && e.keyCode == 78) {
		console.log("NEXT");
		Next();
	}
	if (e.shiftKey && e.keyCode == 82) {
		console.log("PREVIOUS");
		Previous();
	}
};
