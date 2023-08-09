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
	char: "",
	autocopy: false,
	canrun: true,
	
}
function updateRGBCounts() {
    document.querySelector('#redCount').innerText = document.getElementById('redIntensity').value
    document.querySelector('#greenCount').innerText = document.getElementById('greenIntensity').value
    document.querySelector('#blueCount').innerText = document.getElementById('blueIntensity').value
	
}
async function pasted(){
try{
	
		const text = await navigator.clipboard.readText();
		
	
settings.char = text
document.getElementById('char').value = text
loadNewImage(settings.last_source);
	} catch(error){console.log(error)}
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
	

	document.querySelector('#char').oninput = () => {settings.char = document.getElementById('char').value;r()};

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
		if(e.target.checked){ element.classList.add("dark");}
		else {element.classList.remove("dark");
		
	}
	};

	setUIElement('#inverted', settings.inverted).onchange = (e) => {settings.inverted = e.target.checked; r()};
	setUIElement('#dithering', settings.dithering).onchange = (e) => {settings.dithering = e.target.checked; r()};
	setUIElement('#monospace', settings.monospace).onchange = (e) => {settings.monospace = e.target.checked; r()};
	setUIElement('#boxes', settings.boxes).onchange = (e) => {settings.boxes = e.target.checked; r()};
	setUIElement('#minecraft', settings.minecraft).onchange = (e) => {settings.minecraft = e.target.checked; r()};
	setUIElement('#autocopy', settings.autocopy).onchange = (e) => {settings.autocopy = e.target.checked; r()};
	document.querySelector('#greyscale_mode').onchange = (e) => {
		settings.greyscale_mode = e.target.value;
		parseCanvas(settings.last_canvas);
	};

	setUIElement('#width', settings.width).onchange = (e) => {
		settings.width = parseInt(e.target.value);
		loadNewImage(settings.last_source);

		
	};
	//autoscales the image... or tries to
	

	document.querySelector('#autoScale').onclick = (e) => {
		if(settings.canrun == true) {
			settings.canrun = false
		if(document.querySelector('#charcount').innerText<4300 || document.querySelector('#charcount').innerText>=4500){
		for(i=0;i<150;i++){
			if(document.querySelector('#charcount').innerText>=10000){
				settings.width = 30
				document.getElementById('width').value = 30
				loadNewImage(settings.last_source);
				break;
			}
			if(settings.width <= 2){
				settings.width = 10
				document.getElementById('width').value = 30
				loadNewImage(settings.last_source);
				break;
			}
			setTimeout(()=>{
				
			if(document.querySelector('#charcount').innerText<4300){
				settings.width += 1;
				document.getElementById('width').value = settings.width
				loadNewImage(settings.last_source);

			} else if (document.querySelector('#charcount').innerText>=4500){
				settings.width -= 1;
				document.getElementById('width').value = settings.width
				loadNewImage(settings.last_source);

			}
		},1500)
		
	}

		}
		settings.canrun = true
	}


	}
	

	document.querySelector('#clipboard').onclick = (e) => {
		 document.querySelector('#text').select();
		 document.execCommand("copy");
		 
	}
	//resets draggy things on the side
	document.querySelector('#rReset').onclick = (e) => {
		document.querySelector('#redCount').innerText = 2
		document.getElementById('redIntensity').value = 2
		loadNewImage(settings.last_source);
   }
    document.querySelector('#gReset').onclick = (e) => {
		document.querySelector('#greenCount').innerText = 2
		document.getElementById('greenIntensity').value = 2
		loadNewImage(settings.last_source);
	}
	document.querySelector('#bReset').onclick = (e) => {
		document.querySelector('#blueCount').innerText = 2
		document.getElementById('blueIntensity').value = 2
		loadNewImage(settings.last_source);
	}
}

async function loadNewImage(src) {
	
	if(src === undefined) return;

	if(settings.last_source && settings.last_source !== src) URL.revokeObjectURL(settings.last_source);

	settings.last_source = src;
	//console.log(URL. createObjectURL(settings.last_source))
	const canvas = await createImageCanvas(src);
	settings.last_canvas = canvas;
	console.log(settings.last_canvas)
	settings.last_dithering = null;
	await parseCanvas(canvas);

}

async function parseCanvas(canvas) {
	const text = canvasToText(canvas);
	document.querySelector('#text').value = text;
	document.querySelector('#charcount').innerText = text.length;
	if(settings.autocopy==true){
		if(settings.canrun == true){
	document.querySelector('#text').select();
	document.execCommand("copy");
		}
	}
}

window.onload = () => {
	initUI();
	settings.char = "█"
	document.getElementById('char').value = "█"
	loadNewImage("select.png");
}
