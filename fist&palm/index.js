// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel

const modelUrl = "./models/model.json";
const metadataUrl = "./models/metadata.json";

const startButton = document.getElementById("start-button");
const stopButton = document.getElementById("stop-button");
const webcamElement = document.getElementById("webcam");
const canvasElement = document.getElementById("canvas");
const webcam = new Webcam(webcamElement, "user", canvasElement);

startButton.addEventListener("click", init);
stopButton.addEventListener("click", stop);

let model, labelContainer, maxPredictions,id;

async function loadModel() {
  if (model) return;

  model = await tmImage.load(modelUrl, metadataUrl);
  maxPredictions = model.getTotalClasses();
}

// Load the image model and setup the webcam
async function init() {
  // you need to create File objects, like with file input elements (<input type="file" ...>)

  await loadModel();

  webcam
    .start()
    .then((result) => {
      console.log("webcam started");
     id = window.requestAnimationFrame(loop);
    })
    .catch((err) => {
      console.log(err);
    });

  // append elements to the DOM
  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) {
    // and class labels
    labelContainer.appendChild(document.createElement("div"));
  }
}

async function loop() {
  await predict();
 id = window.requestAnimationFrame(loop);
}

function stop() {
  cancelAnimationFrame(id)
  webcam.stop();
  webcamElement.srcObject = null;
  labelContainer.childNodes[0].innerHTML = null
  labelContainer.childNodes[1].innerHTML = null

}

// run the webcam image through the image model
async function predict() {
  // predict can take in an image, video or canvas html element
  const prediction = await model.predict(webcamElement);
  for (let i = 0; i < maxPredictions; i++) {
    const classPrediction =
      prediction[i].className + ": " + prediction[i].probability.toFixed(2);
    labelContainer.childNodes[i].innerHTML = classPrediction;
  }
}
