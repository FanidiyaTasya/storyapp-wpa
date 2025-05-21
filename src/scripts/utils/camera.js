export async function startCamera(videoElement) {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  videoElement.srcObject = stream;
  await videoElement.play();
  return stream;
}

export function stopCamera(videoElement) {
  const stream = videoElement.srcObject;
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    videoElement.srcObject = null;
  }
}

export function takePhoto(videoElement, canvas) {
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg');
}
