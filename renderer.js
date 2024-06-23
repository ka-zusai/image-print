window.onload = () => {
  document.querySelector('button[onclick="convertImage()"]').onclick =
    convertImage;
  document.querySelector('button[onclick="saveCanvasImage()"]').onclick =
    saveCanvasImage;
};

function convertImage() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const image = new Image();
  const fileInput = document.getElementById("fileInput");
  const outputType = document.getElementById("outputType").value;

  image.onload = () => {
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    if (outputType === "2D") {
      convertTo2D(ctx, canvas);
    } else if (outputType === "3D") {
      convertTo3D(ctx, canvas);
    }
    console.log("設計図が完成しました。");
  };

  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      image.src = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    console.error("ファイルが選択されていません。");
  }
}

function convertTo2D(ctx, canvas) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = brightness; // R
    data[i + 1] = brightness; // G
    data[i + 2] = brightness; // B
  }
  ctx.putImageData(imageData, 0, 0);
}

function convertTo3D(ctx, canvas) {
  // ここに3D設計図生成のロジックを追加する
  console.log("3D設計図の生成中...");
}

function saveCanvasImage() {
  const canvas = document.getElementById("canvas");
  const imageType = "image/png";
  try {
    const imageData = canvas.toDataURL(imageType);
    window.electron.ipcRenderer
      .invoke("save-image", imageData)
      .then((response) => {
        if (response.success) {
          console.log("画像を保存しました。");
        } else {
          console.error("画像の保存に失敗しました:", response.error);
        }
      });
  } catch (error) {
    console.error("画像の保存に失敗しました:", error);
  }
}
