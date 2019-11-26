const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
	navigator.mediaDevices
		.getUserMedia({ video: true, audio: false })
		.then(localMediaStream => {
			console.log(localMediaStream);
			video.src = window.URL.createObjectURL(localMediaStream);
			video.play();
		})
		// catch error if user does not allow webcam access or does not have cam device
		.catch(err => {
			console.error(`Oh sorry you need to give access to your cam`, err);
		});
}

function paintToCanvas() {
	const width = video.videoWidth;
	const height = video.videoHeight;
	//console.log(width, height);
	canvas.width = width;
	canvas.height = height;

	return setInterval(() => {
		ctx.drawImage(video, 0, 0, width, height);
		// take the pixels out

		// play around with the pixels
		// pixels = redEffect(pixels);

		// pixels = rgbSplit(pixels);
		pixels = greenScreen(pixels);
		// put them back
		// ctx.globalAlpha = 0.8;
		// console.log(pixels);
		let pixels = ctx.getImageData(0, 0, width, height);
	}, 16);
}

function takePhoto() {
	// play the sound on button click
	snap.currentTime = 0;
	snap.play();

	// take the data out of the canvas
	const data = canvas.toDataURL('image/jpeg');
	//console.log(data);
	const link = document.createElement('a');
	link.href = data;
	link.setAttibute('download', 'handsome');
	link.innerHTML = `<img src="${data}" alt="Handsome Man" />`;
	link.textContent = 'Download Image';
	strip.insertBefore(link, strip.firstChild);
}

function redEffect() {
	for (let i = 0; i < pixels.data.length; i += 4) {
		pixels[i + 0] = pixels.data[i + 0] + 100; // red
		pixels[i + 1] = pixels.data[i + 1] - 50; // green
		pixels[i + 2] = pixels.data[i + 2] * 0.5; // blue
	}
	return pixels;
}

function greenScreen(pixels) {
	const level = {};

	document.querySelectorAll('.rgb input').forEach(input => {
		levels[input.name] = input.value;
	});
	for (i = 0; i < pixels.data.length; i += 4) {
		red = pixels.data[i + 0];
		green = pixels.data[i + 1];
		blue = pixels.data[i + 2];
		alpha = pixels.data[i + 3];

		if (
			red >= levels.rmin &&
			green >= levels.gmin &&
			blue >= levels.bmin &&
			red <= levels.rmax &&
			green <= levels.gmax &&
			blue <= levels.bmax
		) {
			// take it out
			pixels.data[i + 3] = 0;
		}
	}
}

function rgbSplit() {
	for (let i = 0; i < pixels.data.length; i += 4) {
		pixels[i - 150] = pixels.data[i + 0] + 100; // red
		pixels[i + 100] = pixels.data[i + 1] - 50; // green
		pixels[i - 550] = pixels.data[i + 2] * 0.5; // blue
	}
}
getVideo();

video.addEventListener('canplay', paintToCanvas);
