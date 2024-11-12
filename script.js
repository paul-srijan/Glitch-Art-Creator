const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const pixelDisplace = document.getElementById("pixelDisplace");
const channelShift = document.getElementById("channelShift");
const staticNoise = document.getElementById("staticNoise");
const randomize = document.getElementById("randomize");
const download = document.getElementById("download");

let image = new Image();

// Load the uploaded image onto the canvas
upload.addEventListener("change", (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        image.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

image.onload = () => {
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
};

// Function to apply glitch effects
function applyGlitch() {
    if (!image.src) return;
    ctx.drawImage(image, 0, 0);
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;

    // Pixel displacement effect
    for (let i = 0; i < data.length; i += 4) {
        let displacement = Math.floor(Math.random() * pixelDisplace.value);
        if (i + displacement * 4 < data.length) {
            data[i] = data[i + displacement * 4];
            data[i + 1] = data[i + displacement * 4 + 1];
            data[i + 2] = data[i + displacement * 4 + 2];
        }
    }

    // Color channel shift effect
    for (let i = 0; i < data.length; i += 4) {
        let shift = Math.floor(Math.random() * channelShift.value);
        if (i + shift * 4 < data.length) {
            data[i] = data[i + shift * 4]; // Red channel
            data[i + 1] = data[i + shift * 4 + 1]; // Green channel
            data[i + 2] = data[i + shift * 4 + 2]; // Blue channel
        }
    }

    // Static noise effect
    for (let i = 0; i < data.length; i += 4) {
        if (Math.random() < staticNoise.value / 100) {
            data[i] = Math.random() * 255;     // Red
            data[i + 1] = Math.random() * 255; // Green
            data[i + 2] = Math.random() * 255; // Blue
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

// Add event listeners for sliders
[pixelDisplace, channelShift, staticNoise].forEach(slider => {
    slider.addEventListener("input", applyGlitch);
});

// Randomize effect intensities
randomize.addEventListener("click", () => {
    pixelDisplace.value = Math.floor(Math.random() * 50);
    channelShift.value = Math.floor(Math.random() * 50);
    staticNoise.value = Math.floor(Math.random() * 50);
    applyGlitch();
});

// Download image as a PNG file
download.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "glitch_art.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
});
