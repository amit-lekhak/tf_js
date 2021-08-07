const btnStart = document.querySelector(".btn-start");
const btnStop = document.querySelector(".btn-stop");
const canvas = document.getElementById("canvas");
const video = document.getElementById("video");

const ctx = canvas.getContext("2d");

btnStart.addEventListener("click", start);
btnStop.addEventListener("click", stopWebCam);

function stopWebCam() {
  console.log("Stop");
  var stream = video.srcObject;
  var tracks = stream.getTracks();

  for (var i = 0; i < tracks.length; i++) {
    var track = tracks[i];
    track.stop();
  }
  video.srcObject = null;

  const url = canvas.toDataURL();
  console.log(url);
}

function start() {

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function (stream) {
        video.srcObject = stream;

        loadCanvas();
      })
      .catch(function (error) {
        console.log("Something went wrong");
      });
  }
}

function loadCanvas() {
  ctx.drawImage(video, 0, 0, 200, 200);
  window.requestAnimationFrame(loadCanvas);
}
