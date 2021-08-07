const webcamElement = document.getElementById('webcam');
const canvasElement = document.getElementById('canvas');
const webcam = new Webcam(webcamElement, 'user',canvasElement);


webcam.start()
  .then(result =>{
    console.log("webcam started");
    window.requestAnimationFrame(loop)
})
.catch(err => {
    console.log(err);
});


function loop() {
    let picture = webcam.snap();
    document.querySelector('#canvas').src = picture;
    window.requestAnimationFrame(loop)
}


