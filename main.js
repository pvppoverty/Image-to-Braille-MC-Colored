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
	intensity_mode: "pow",
	satt: 1,
	
	
}
function updateRGBCounts() {
    document.getElementById('rint').value = document.getElementById('redIntensity').value
    document.getElementById('gint').value = document.getElementById('greenIntensity').value
    document.getElementById('bint').value = document.getElementById('blueIntensity').value
	document.getElementById('satt').value = document.getElementById('saturation').value
}
async function pasted(){
try{
	
		const text = await navigator.clipboard.readText();
		
	
settings.char = text
document.getElementById('char').value = text
loadNewImage(settings.last_source);
	} catch(error){}
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


let asCount = 0

function autoScale() {
    if (asCount >= 150) { asCount = 0; return console.error('failed'); }
    asCount++
    if (document.querySelector('#charcount').innerText <= 4250) {
        document.getElementById('width').value++
        settings.width++
        loadNewImage(settings.last_source);
    } else if (document.querySelector('#charcount').innerText >= 4450) {
        document.getElementById('width').value--
        settings.width--
        loadNewImage(settings.last_source);
    } else {
		
        asCount = 0
        settings.canrun = true
		loadNewImage(settings.last_source);
        return
    }
    setTimeout(() => {
        autoScale()
    }, 1);
}

function initUI() {
	

	document.querySelector('#char').oninput = () => {settings.char = document.getElementById('char').value;r()};

	document.querySelector('#redIntensity').onchange = () => { updateRGBCounts(); r() }
    document.querySelector('#greenIntensity').onchange = () => { updateRGBCounts(); r() }
    document.querySelector('#blueIntensity').onchange = () => { updateRGBCounts(); r() }
	document.querySelector('#saturation').onchange = () => { updateRGBCounts(); r() }
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
	document.querySelector('#intensitymode').onchange = (e) => {
		settings.intensity_mode = e.target.value;
		
		loadNewImage(settings.last_source);
	};

	setUIElement('#width', settings.width).onchange = (e) => {
		settings.width = parseInt(e.target.value);
		loadNewImage(settings.last_source);

		
	};

	setUIElement('#satt', settings.satt).onchange = (e) => {
		settings.satt = e.target.value
		document.getElementById('saturation').value = settings.satt
		loadNewImage(settings.last_source);
	};
	setUIElement('#rint').onchange = (e) => {
		
		document.getElementById('redIntensity').value = document.getElementById('rint').value
		loadNewImage(settings.last_source);
	};
	setUIElement('#gint').onchange = (e) => {
		
		document.getElementById('greenIntensity').value = document.getElementById('gint').value
		loadNewImage(settings.last_source);
	};
	setUIElement('#bint').onchange = (e) => {
		
		document.getElementById('blueIntensity').value = document.getElementById('bint').value
		loadNewImage(settings.last_source);
	};
	//autoscales the image... or tries to
	

	
	document.querySelector('#autoScale').onclick = (e) => {
		if (!settings.canrun) return console.error('fail: canrun is not true.')
		settings.canrun = false
		if (document.querySelector('#charcount').innerText <= 4200 || document.querySelector('#charcount').innerText >= 4500) {
			// base to estimate
			settings.width = 20
			document.getElementById('width').value = 20
			loadNewImage(settings.last_source);
			autoScale()
		} 
		}
	

	document.querySelector('#clipboard').onclick = (e) => {
		 document.querySelector('#text').select();
		 document.execCommand("copy");
		 
	}
	//resets draggy things on the side
	document.querySelector('#rReset').onclick = (e) => {
		document.getElementById('rint').value = 2
		document.getElementById('redIntensity').value = 2
		loadNewImage(settings.last_source);
   }
    document.querySelector('#gReset').onclick = (e) => {
		document.getElementById('gint').value = 2
		document.getElementById('greenIntensity').value = 2
		loadNewImage(settings.last_source);
	}
	document.querySelector('#bReset').onclick = (e) => {
		document.getElementById('bint').value = 2
		document.getElementById('blueIntensity').value = 2
		loadNewImage(settings.last_source);
	}

	document.querySelector('#sReset').onclick = (e) => {
		document.getElementById('satt').value = 1
		
		document.getElementById('saturation').value = 1
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
	//console.log(settings.last_canvas)
	settings.last_dithering = null;
	await parseCanvas(canvas);

}

async function parseCanvas(canvas) {
	const text = canvasToText(canvas);
	document.querySelector('#text').value = text;
	settings.txt = text;
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
