const settings = {
	last_canvas: null,
	last_dithering: null,
	last_source: "",

	width: 62,
	greyscale_mode: "luminance",
	inverted: false,
	dithering: false,
	monospace: false,
	boxes: false,
	minecraft: false,
	redIntensity:2,
	greenIntensity:2,
	blueIntensity:2,
	
}
function updateRGBCounts() {
    document.querySelector('#redCount').innerText = document.getElementById('redIntensity').value
    document.querySelector('#greenCount').innerText = document.getElementById('greenIntensity').value
    document.querySelector('#blueCount').innerText = document.getElementById('blueIntensity').value
}

function setUIElement(selector, value) {
	
	const elem = document.querySelector(selector);
	switch(elem.getAttribute("type")) { //should all be <input>
		case "checkbox":
			elem.checked = value;
			break;

		default:
			elem.value = value;
	}
	return elem;
}

function initUI() {
	document.querySelector('#redIntensity').onchange = () => { updateRGBCounts(); r() }
    document.querySelector('#greenIntensity').onchange = () => { updateRGBCounts(); r() }
    document.querySelector('#blueIntensity').onchange = () => { updateRGBCounts(); r() }
	document.body.ondragover = (e) => e.preventDefault();
	document.body.ondrop = (e) => {
		e.preventDefault();
		loadNewImage(URL.createObjectURL(e.dataTransfer.items[0].getAsFile()));
	}
	document.body.onpaste = (e) => {
		event.preventDefault();
		loadNewImage(URL.createObjectURL(e.clipboardData.items[0].getAsFile()));
	}

	//buttons
	const r = () => parseCanvas(settings.last_canvas); //shorten for compactness

	document.querySelector('input[type="file"]').onchange = (e) => {
		 loadNewImage(URL.createObjectURL(e.target.files[0]));
	}

	setUIElement('#darktheme', settings.inverted).onchange = (e) => {
		const element = document.querySelector('#text');
		if(e.target.checked) element.classList.add("dark");
		else element.classList.remove("dark");
	};

	setUIElement('#inverted', settings.inverted).onchange = (e) => {settings.inverted = e.target.checked; r()};
	setUIElement('#dithering', settings.dithering).onchange = (e) => {settings.dithering = e.target.checked; r()};
	setUIElement('#monospace', settings.monospace).onchange = (e) => {settings.monospace = e.target.checked; r()};
	setUIElement('#boxes', settings.boxes).onchange = (e) => {settings.boxes = e.target.checked; r()};
	setUIElement('#minecraft', settings.minecraft).onchange = (e) => {settings.minecraft = e.target.checked; r()};
	
	
	
	setUIElement('#redIntensity', settings.redIntensity).onchange = (e) => {settings.redIntensity = e.target.checked; r()};
	setUIElement('#greenIntensity', settings.greenIntensity).onchange = (e) => {settings.greenIntensity = e.target.checked; r()};
	setUIElement('#blueIntensity', settings.blueIntensity).onchange = (e) => {settings.blueIntensity = e.target.checked; r()};
	
	
	
	document.querySelector('#greyscale_mode').onchange = (e) => {
		settings.greyscale_mode = e.target.value;
		parseCanvas(settings.last_canvas);
	};

	setUIElement('#width', settings.width).onchange = (e) => {
		settings.width = e.target.value;
		loadNewImage(settings.last_source);
	};

	document.querySelector('#clipboard').onclick = (e) => {
		 document.querySelector('#text').select();
		 document.execCommand("copy");
	}
}

async function loadNewImage(src) {
	if(src === undefined) return;

	if(settings.last_source && settings.last_source !== src) URL.revokeObjectURL(settings.last_source);

	settings.last_source = src;
	const canvas = await createImageCanvas(src);
	settings.last_canvas = canvas;
	settings.last_dithering = null;
	await parseCanvas(canvas);
}

async function parseCanvas(canvas) {
	const text = canvasToText(canvas);
	document.querySelector('#text').value = text;
	document.querySelector('#charcount').innerText = text.length;
}

window.onload = () => {
	initUI();
	loadNewImage("select.png");
}
