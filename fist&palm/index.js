// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel

const button = document.getElementsByTagName("button")[0];

button.addEventListener("click", init);

// const URL = "./models/";

let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function init() {

  // const modelURL = URL + "model.json";
  // const modelWeightsUrl = URL + "weights.bin";
  // const metadataURL = URL + "metadata.json";


  // you need to create File objects, like with file input elements (<input type="file" ...>)
  const uploadModel = document.getElementById("upload-model");
  const uploadWeights = document.getElementById("upload-weights");
  const uploadMetadata = document.getElementById("upload-metadata");

  
  model = await tmImage.loadFromFiles(
    uploadModel.files[0],
    uploadWeights.files[0],
    uploadMetadata.files[0]
  );

  // model = await tmImage.loadFromFiles(modelURL, modelWeightsUrl, metadataURL);

  maxPredictions = model.getTotalClasses();

  // Convenience function to setup a webcam
  const flip = true; // whether to flip the webcam
  webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
  await webcam.setup(); // request access to the webcam
  await webcam.play();
  window.requestAnimationFrame(loop);

  // append elements to the DOM
  document.getElementById("webcam-container").appendChild(webcam.canvas);
  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) {
    // and class labels
    labelContainer.appendChild(document.createElement("div"));
  }
}

async function loop() {
  webcam.update(); // update the webcam frame
  await predict();
  window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
  // predict can take in an image, video or canvas html element
  const prediction = await model.predict(webcam.canvas);
  for (let i = 0; i < maxPredictions; i++) {
    const classPrediction =
      prediction[i].className + ": " + prediction[i].probability.toFixed(2);
    labelContainer.childNodes[i].innerHTML = classPrediction;
  }
}
