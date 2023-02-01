// Загружаем картинку из инпута в канву
export const loadImageFile = async (
  fileData,
  canvas,
  maxWidth,
  maxHeight,
  src
) => {
  const reader = new FileReader();
  canvas.toDataURL("image/jpeg");
  const ctx = canvas.getContext("2d");
  reader.onload = async function (event) {
    const img = new Image();
    img.onload = function () {
      canvas.width = maxWidth;
      canvas.height = maxHeight;
      ctx.drawImage(img, 0, 0, maxWidth, maxHeight);
      convertToGray(canvas, src);
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(fileData);
};

// Преобразовываем картинку в градации серого
export const convertToGray = (canvas, src) => {
  const ctx = canvas.getContext("2d");
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = avg; // red
    data[i + 1] = avg; // green
    data[i + 2] = avg; // blue
  }
  ctx.putImageData(imageData, 0, 0);
  src.setAttribute("src", canvas.toDataURL());
};

// Очищаем канвас
function clearImage(canvas, src) {
  const context = canvas.getContext("2d");
  context.fillStyle = "#AAA";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const data = canvas.toDataURL("image/jpeg");
  src.setAttribute("src", data);
}


export const getCameraSelection = async (cameraOptions) => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter((device) => device.kind === "videoinput");
    const options = videoDevices.map((videoDevice) => {
      return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`;
    });
    console.log(devices, "sadffsfsdffsd")
    cameraOptions.innerHTML = options.join("");
  };
