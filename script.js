const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

video.style.display = "block";
canvas.style.display = "block";

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/* MediaPipe Hands */
const hands = new Hands({
  locateFile: (file) =>
    https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7
});

hands.onResults((results) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (results.image) {
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
  }

  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
        color: "#00ffff",
        lineWidth: 2
      });
      drawLandmarks(ctx, landmarks, {
        color: "#00ffff",
        radius: 4
      });
    }
  }
});

/* Camera */
const camera = new Camera(video, {
  onFrame: async () => {
    await hands.send({ image: video });
  },
  width: 640,
  height: 480
});

camera.start().catch(err => {
  console.error("Camera error:", err);
});
