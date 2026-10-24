const fontSize = document.getElementById("fontSize");
const textColor = document.getElementById("textColor");
const topY= document.getElementById("topY");
const bottomY= document.getElementById("bottomY");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const topText = document.getElementById("topText");
const bottomText = document.getElementById("bottomText");
const templates = document.querySelectorAll(".template");

let currentImage = null;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (currentImage) {
    ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);
  }
  ctx.font = fontSize.value + "px Impact";
  ctx.fillStyle = textColor.value;
  ctx.strokeStyle = "black";
  ctx.lineWidth = 4;
  ctx.textAlign = "center";
  ctx.strokeText(topText.value, 250, Number(topY.value));
  ctx.fillText(topText.value, 250, Number(topY.value));
  ctx.strokeText(bottomText.value, 250, Number(bottomY.value));
  ctx.fillText(bottomText.value, 250, Number(bottomY.value));
}


templates.forEach((img) => {
  img.addEventListener("click", () => {
    currentImage = img;
    draw();
  });
});

topText.addEventListener("input", draw);
bottomText.addEventListener("input", draw);
[fontSize, textColor, topY, bottomY].forEach((el)=>{
    el.addEventListener("input", draw);
});
const downloadBtn = document.getElementById("downloadBtn");

downloadBtn.addEventListener("click",() =>{
    const link = document.createElement("a");
    link.download = "my-meme.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
});
const saveBtn = document.getElementById("saveBtn");
const myMemes = document.getElementById("myMemes");

let saved = JSON.parse(localStorage.getItem("memes")) || [];

function showSaved() {
  myMemes.innerHTML = "";
  saved.forEach((src) => {
    const img = document.createElement("img");
    img.src = src;
    img.width = 150;
    myMemes.appendChild(img);
  });
}

saveBtn.addEventListener("click", () => {
  saved.push(canvas.toDataURL("image/jpeg", 0.7));
  localStorage.setItem("memes", JSON.stringify(saved));
  showSaved();
});

showSaved();
const gallery = document.querySelector(".gallery");

fetch("https://api.imgflip.com/get_memes")
  .then((response) => response.json())
  .then((result) => {
    result.data.memes.forEach((meme) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = meme.url;
      img.alt = meme.name;
      img.className = "template";
      img.addEventListener("click", () => {
        currentImage = img;
        draw();
      });
      gallery.appendChild(img);
    });
  });
  const upload = document.getElementById("upload");

upload.addEventListener("change", () => {
  const file = upload.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      currentImage = img;
      draw();
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});