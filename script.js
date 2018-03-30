var video = document.querySelector("#videoElement");
var downloadVideo = document.querySelector("#downloadVideo");
var recorder;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
var hdConstraints = {
    video: { width: { min: 1280 }, height: { min: 720 } }
};
var startBtn = document.getElementById("startBtn");
var pauseBtn = document.getElementById("pauseBtn");
var timerClock = document.getElementById("timer");
pauseBtn.disabled = true;
var start = null;
var pausedAt = null;


if (navigator.getUserMedia) {
    navigator.getUserMedia(hdConstraints, handleVideo, videoError);
}
downloadVideo.style.visibility = "hidden";


function handleVideo(stream) {
    video.src = window.URL.createObjectURL(stream);
    recorder = new MediaRecorder(stream);
}
function videoError(e) {
    console.log(e);
}

setInterval(function () { myTimer() }, 500);
function myTimer() {
    if (start != null && pausedAt == null) {
        console.log("Start timer");
        console.log(start);
        var diff = new Date() - start;
        console.log(diff);
        timerClock.innerHTML = formatDate(diff);
    }
}

function handleStartButton() {
    console.log(startBtn.innerHTML);
    if (startBtn.innerHTML === "Stop") {
        start = null;
        pausedAt = null;
        pauseBtn.innerHTML = "Pause";
        timerClock.innerHTML = "0:0:0";
        startBtn.innerHTML = "Start";
        pauseBtn.disabled = true;
        timerClock.style.visibility = "hidden";
        recorder.stop();
        recorder.ondataavailable = e => {
            var videoUrl = URL.createObjectURL(e.data);
            downloadVideo.href = videoUrl;
            downloadVideo.download = ['video_', (new Date() + '').slice(4, 28), '.webm'].join('');
            downloadVideo.style.visibility = "visible";
        };
    }
    else {
        start = Date.now();
        startBtn.innerHTML = "Stop";
        pauseBtn.disabled = false;
        timerClock.style.visibility = "visible";
        recorder.start();
        downloadVideo.style.visibility = "hidden";
    }
}
function handlePauseButton() {
    console.log(pauseBtn.innerHTML);
    if (pausedAt == null && startBtn.innerHTML === "Stop") {
        pausedAt = new Date();
        pauseBtn.innerHTML = "Resume";
        recorder.pause();
    }
    else {
        var pausedFor = new Date() - pausedAt;
        start = start + pausedFor;
        pausedAt = null;
        pauseBtn.innerHTML = "Pause";
        recorder.resume();
    }
}

function formatDate(s) {
    //convert to seconds
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;
    return hrs + ':' + mins + ':' + secs;
}


var slider = document.getElementById("brightnessBar");
slider.defaultValue = 100;
slider.oninput = function () {
    var brightness = this.value;
    console.log(brightness);
    video.style.filter = "brightness(" + brightness + "%)";
} 