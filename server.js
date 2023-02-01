// Отправляем запрос
export const handleGetData = async (blob, urlServer) => {
  const json3 = {
    data: {
      attributes: {
        location_ids: ["kutuza32-floor11"],
        session_id: "8f969253-653c-4118-b41d-e7c69d546e53",
        user_id: "30ae34e4-3014-4091-9011-f0dc6549101c",
        timestamp: Date.now(),
        location: null,
        client_coordinate_system: "unity",
        tracking_pose: { x: 0.0, y: 0.0, z: 0.0, rx: 0.0, ry: 0.0, rz: 0.0 },
        intrinsics: {
          width: 540,
          height: 960,
          fx: 722.12384,
          fy: 722.12384,
          cx: 270.0,
          cy: 480.0,
        },
      },
    },
  };
  const jsonStr = JSON.stringify(json3);

  const imageData = new FormData();
  imageData.append("json", jsonStr);
  imageData.append("image", blob, "1.jpg");

  try {
    const result = await axios.post(urlServer, imageData, {
      mode: "cors",
      headers: {
        accept: "application/json",
        "Accept-Language": "en-US,en;q=0.8",
        "Content-Type": `multipart/form-data;`,
      },
    });
    // printLog(result.data);
    return result;
  } catch (e) {
    return false;
  }
};
