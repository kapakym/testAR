import {
  cameraButton,
  cameraOptions,
  canvas,
  fileInput,
  imgFile,
  logData,
  logs,
  maxHeight,
  maxWidth,
  points,
  sendButton,
  trackingButton,
  urlServer,
  video,
} from "./consts.js";

import { init, setCursor, setPoint,  } from "./map.js";
import {
  convertPolarToDecart,
  getNewPositonPolar,
  getRangePolar,
  LatLonToMercator,
} from "./math.js";
import { loadImageFile, getCameraSelection, convertToGray } from "./image.js";
import { handleGetData } from "./server.js";
import * as THREE from "./threejs.js";

console.log(THREE);
const vector = new THREE.Vector3(1, 1, 1);
console.log(vector);
let myMap;
let request = 0;
let tracking = false;
let isPlayVideo = false;

let currentPoint = 0;

let cursor;
let cursorDirection

// Получаем файл из инпута
fileInput.onchange = async () => {
  console.log(fileInput.files[0]);
  await loadImageFile(fileInput.files[0], canvas, maxWidth, maxHeight, imgFile);
};

// Выводим данные полученные от сервера
async function printLog(result) {
  console.log("------->", result.data.attributes);

  if (result.data.attributes) {
    const dec = convertPolarToDecart({
      lat: result.data.attributes.location.gps.latitude,
      long: result.data.attributes.location.gps.longitude,
    });
    logData.value = `Отправлено запросов: ${request} \n 
    Широта: ${result.data.attributes.location.gps.latitude} \n 
    Долгота: ${result.data.attributes.location.gps.longitude} \n 
    время: ${new Date(
      result.data.attributes.location.gps.timestamp
    ).toLocaleDateString()}\n
    Координаты дек: x: ${dec.x} - y: ${dec.y} - z: ${dec.z}    
    Компас\n
    Азимут: ${result.data.attributes.location.compass.heading}\n
    время: ${new Date(
      result.data.attributes.location.compass.timestamp
    ).toLocaleDateString()}\n`;

    cursor(
      result.data.attributes.location.gps.latitude,
      result.data.attributes.location.gps.longitude,
      result.data.attributes.location.compass.heading
    );

   

    myMap.setCenter(
      [
        result.data.attributes.location.gps.latitude,
        result.data.attributes.location.gps.longitude,
      ],
      18
    );

    console.log(
      getRangePolar(
        result.data.attributes.location.gps.latitude,
        result.data.attributes.location.gps.longitude,
        points[0].lat,
        points[0].lon
      )
    );
    
  }

  const resString = await JSON.stringify(result, undefined, 4);
  logs.value += resString;
}

// Подключаею кнопки
sendButton.addEventListener("click", () =>
  canvas.toBlob((blob) => requestData(blob))
);

trackingButton.addEventListener("click", () => {
  tracking = !tracking;
  if (!tracking) request = 0;
  if (tracking) {
    console.log(tracking);
    canvas.toBlob((blob) => requestData(blob));
  }
});

// Отправляем запросы
async function requestData(blob) {
  const result = await handleGetData(blob, urlServer);
  if (result && tracking) {
    console.log("result");
    printLog(result.data);
    if (isPlayVideo) getImageFromVideo();
    canvas.toBlob((blob) => requestData(blob));
  }
  if (!result && tracking) {
    if (isPlayVideo) getImageFromVideo();
    setTimeout(() => {
      canvas.toBlob((blob) => requestData(blob));
    }, 2500);
  }
}

// Запускаем видеопоток с камеры
cameraButton.addEventListener("click", () => {
  console.log(isPlayVideo);
  isPlayVideo = !isPlayVideo;
  if (isPlayVideo) {
    navigator.mediaDevices
      .getUserMedia({ audio: false, video: { deviceId: cameraOptions.value } })
      .then((stream) => {
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error(`An error occurred: ${err}`);
      });
  }
  if (!isPlayVideo) video.remove();
});

// Делаем скриншот с камеры
function getImageFromVideo() {
  if (video.videoWidth && video.videoHeight) {
    const ctx = canvas.getContext("2d");
    canvas.width = maxWidth;
    canvas.height = maxHeight;
    ctx.drawImage(video, 0, 0, maxWidth, maxHeight);
    convertToGray(canvas, imgFile);
  }
}

await getCameraSelection(cameraOptions);

// Функция ymaps.ready() будет вызвана, когда
// загрузятся все компоненты API, а также когда будет готово DOM-дерево.
ymaps.ready(() => {
  myMap = init();
  cursor = setCursor(myMap, 0, 0, 0);
  cursorDirection = setCursor(myMap, 0, 0, 0);
  // for ()
  // setPoint()
});

function getAngle(lat, lon, lat1, lon1) {
  const vector1 = LatLonToMercator(lat, lon);
  const vector2 = LatLonToMercator(lat1, lon1);

  const th_vector1 = new THREE.Vector2(vector1.X, vector1.Y).normalize();
  const th_vector2 = new THREE.Vector2(vector2.X, vector2.Y).normalize();
  const multy = th_vector1.multiply(th_vector2);
  console.log("theta", (Math.acos(multy.x + multy.y) * 180) / Math.PI);
}

const vec = new THREE.Vector2(1, 1).normalize();
const vec2 = new THREE.Vector2(2, -1).normalize();
const multi = vec.multiply(vec2);
console.log(
  "----------------->",
  (Math.acos(multi.x + multi.y) * 180) / Math.PI
);
console.log("test");
