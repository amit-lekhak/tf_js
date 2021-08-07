// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel

const button = document.getElementsByTagName("button")[0];
const webcamElement = document.getElementById("webcam");
const canvasElement = document.getElementById("canvas");
const webcam = new Webcam(webcamElement, "user", canvasElement);

button.addEventListener("click", init);


let model, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function init() {

  // you need to create File objects, like with file input elements (<input type="file" ...>)
  const uploadModel = document.getElementById("upload-model");
  const uploadWeights = document.getElementById("upload-weights");
  const uploadMetadata = document.getElementById("upload-metadata");

  model = await tmImage.loadFromFiles(
    uploadModel.files[0],
    uploadWeights.files[0],
    uploadMetadata.files[0]
  );


  maxPredictions = model.getTotalClasses();

  webcam
    .start()
    .then((result) => {
      console.log("webcam started");
      window.requestAnimationFrame(loop);
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
  window.requestAnimationFrame(loop);
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
