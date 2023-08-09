
function createImageCanvas(src) {
	return new Promise((resolve, reject) => {
		const canvas = document.createElement("CANVAS");
		const image = new Image();

		image.onload = () => {
			//var scale = Math.min((200/img.width),(200/img.height));
			//image.width = image.width/50;
			//image.height = image.height/50;

			let width = image.width;
			let height = image.height;
			if(image.width != (settings.width * 2)) {
				width = settings.width * 2;
				height = width * image.height / image.width;
			}

			//nearest multiple
			canvas.width = width - (width % 2);
			canvas.height = height - (height % 4);
		

			ctx = canvas.getContext("2d");
			ctx.fillStyle = "#FFFFFF"; //get rid of alpha
			ctx.fillRect(0,0, canvas.width,canvas.height);

			ctx.mozImageSmoothingEnabled = false;
			ctx.webkitImageSmoothingEnabled = false;
			ctx.msImageSmoothingEnabled = false;
			ctx.imageSmoothingEnabled = false;

			ctx.drawImage(image, 0,0, canvas.width,canvas.height);
			resolve(canvas);
		}

		image.src = src;
	});
}

// https://stackoverflow.com/questions/13806483/increase-or-decrease-color-saturation rgb/hsv hsv/rgb functions by hoffmann https://stackoverflow.com/users/3485/hoffmann
RGBtoHSV= function(color) {
	var r,g,b,h,s,v;
	r= color[0];
	g= color[1];
	b= color[2];
	min = Math.min( r, g, b );
	max = Math.max( r, g, b );


	v = max;
	delta = max - min;
	if( max != 0 )
		s = delta / max;        // s
	else {
		// r = g = b = 0        // s = 0, v is undefined
		s = 0;
		h = -1;
		return [h, s, undefined];
	}
	if( r === max )
		h = ( g - b ) / delta;      // between yellow & magenta
	else if( g === max )
		h = 2 + ( b - r ) / delta;  // between cyan & yellow
	else
		h = 4 + ( r - g ) / delta;  // between magenta & cyan
	h *= 60;                // degrees
	if( h < 0 )
		h += 360;
	if ( isNaN(h) )
		h = 0;
	return [h,s,v];
};
// https://stackoverflow.com/questions/13806483/increase-or-decrease-color-saturation rgb/hsv hsv/rgb functions by hoffmann https://stackoverflow.com/users/3485/hoffmann
HSVtoRGB= function(color) {
	var i;
	var h,s,v,r,g,b;
	h= color[0];
	s= color[1];
	v= color[2];
	if(s === 0 ) {
		// achromatic (grey)
		r = g = b = v;
		return [r,g,b];
	}
	h /= 60;            // sector 0 to 5
	i = Math.floor( h );
	f = h - i;          // factorial part of h
	p = v * ( 1 - s );
	q = v * ( 1 - s * f );
	t = v * ( 1 - s * ( 1 - f ) );
	switch( i ) {
		case 0:
			r = v;
			g = t;
			b = p;
			break;
		case 1:
			r = q;
			g = v;
			b = p;
			break;
		case 2:
			r = p;
			g = v;
			b = t;
			break;
		case 3:
			r = p;
			g = q;
			b = v;
			break;
		case 4:
			r = t;
			g = p;
			b = v;
			break;
		default:        // case 5:
			r = v;
			g = p;
			b = q;
			break;
	}
	return [r,g,b];
}


function pixelsToCharacter(pixels_lo_hi) { //expects an array of 8 bools
	//Codepoint reference - https://www.ssec.wisc.edu/~tomw/java/unicode.html#x2800
	const shift_values = [0, 1, 2, 6, 3, 4, 5, 7]; //correspond to dots in braille chars compared to the given array
	let codepoint_offset = 0;
	for(const i in pixels_lo_hi) {
		codepoint_offset += (+pixels_lo_hi[i]) << shift_values[i];
		
	}

	if(codepoint_offset === 0 && settings.monospace === false) { //pixels were all blank
		codepoint_offset = 4; //0x2800 is a blank braille char, 0x2804 is a single dot
	}
    return String.fromCharCode(0x2800 + codepoint_offset);
}

function toGreyscale(r, g, b) {
	switch(settings.greyscale_mode) {
		case "luminance":
			return (0.22 * r) + (0.72 * g) + (0.06 * b);

		case "lightness":
			return (Math.max(r,g,b) + Math.min(r,g,b)) / 2;

		case "average":
			return (r + g + b) / 3;

		case "value":
			return Math.max(r,g,b);

		default:
			console.error("Greyscale mode is not valid");
			return 0;
	}
}


var intensitymode;
function canvasToText(canvas) {
	
	switch(settings.intensity_mode) {
		case "pow":
		intensitymode = Math.pow
		break;
		case "sqrt":  
		//intensitymode = Math.sqrt
		intensitymode = Math.sqrt  //works: Math.random Math.cbrt Math.imul Math.expm1 Math.exp Math.atan2 Math.atan Math.log1p  Math.clz32 Math.sin



		break;
		case "floor": 
			intensitymode = Math.floor
			break;
		case "max": 
			intensitymode = Math.max
			break;
		case "min": 
			intensitymode = Math.min
			break;
		case "random":
			intensitymode =Math.random
			break;
		case "cbrt":
			intensitymode =Math.cbrt
			break;
		case "imul":
			intensitymode =Math.imul
			break;
		case "expm1":
			intensitymode =Math.expm1
			break;
		case "exp":
			intensitymode =Math.exp
			break;
		case "atan2":
			intensitymode =Math.atan2
			break;
		case "atan":
			intensitymode =Math.atan
			break;
		case "log1p":
			intensitymode =Math.log1p
			break;
		case "clz32":
			intensitymode =Math.clz32
			break;
		case "sin":
			intensitymode =Math.sin
			break;
		default: console.error("No Selection")
		break;
	}

	const ctx = canvas.getContext("2d");
	const width = canvas.width;
	const height = canvas.height;

	let image_data = [];
	if(settings.dithering) {
		if(settings.last_dithering === null || settings.last_dithering.canvas !== canvas) {
			settings.last_dithering = new Dithering(canvas);
		}
		image_data = settings.last_dithering.image_data;
	} else {
		image_data = new Uint8Array(ctx.getImageData(0,0,width,height).data.buffer);
	}
	
	let output = "";
	let clr = "";
	
	for(let imgy = 0; imgy < height; imgy += 4) {
		let oldclr = "";
		for(let imgx = 0; imgx < width; imgx += 2) {
			const braille_info = [0,0,0,0,0,0,0,0];
			let dot_index = 0;
			for(let x = 0; x < 2; x++) {
				for(let y = 0; y < 4; y++) {
					const index = (imgx+x + width * (imgy+y)) * 4;
					const pixel_data = image_data.slice(index, index+4); //ctx.getImageData(imgx+x,imgy+y,1,1).data
					if(pixel_data[3] >= 128) { //account for alpha
						let sat = document.getElementById('saturation').value
						const grey = toGreyscale(pixel_data[0], pixel_data[1], pixel_data[2]);
						if(settings.minecraft ==true){
							try{
						let temppix = RGBtoHSV(pixel_data)
						let temppix2 = HSVtoRGB([temppix[0], temppix[1] * sat, temppix[2]])
						rgbToMcColorCode(temppix2[0], temppix2[1], temppix2[2])
							} catch(error){
								console.log(error)
							}
						}
						if(settings.inverted) {
							if(grey >= 128) braille_info[dot_index] = 1;
						} else {
							if(grey <= 128) braille_info[dot_index] = 1;
						}
					}
					dot_index++;
				}
			}
			

			if(settings.minecraft == true) {
			if(settings.boxes == false) {
			if (pixelsToCharacter(braille_info) === String.fromCharCode(0x2800)) {
				
                output += pixelsToCharacter(braille_info);

            } else {
				if(oldclr !== clr) {
                output += clr + pixelsToCharacter(braille_info);
				} else {
					output +=pixelsToCharacter(braille_info);
				}
            }
		} else {
			if(oldclr !== clr){
			output += clr + settings.char; //circle 0x25CF block 0x2588 X 0x2573
			} else {
				output += settings.char; //circle 0x25CF block 0x2588 X 0x2573
			}	
		}


		} else {
			output += pixelsToCharacter(braille_info);
		}
		oldclr = clr
	}
		
		output += "\n";
	}

	
	function rgbToMcColorCode(r, g, b) {
		const mcMaxRgb = {
			black: { rgb: [0, 0, 0], cc: '&0' },
			darkBlue: { rgb: [0, 0, 170], cc: '&1' },
			darkGreen: { rgb: [0, 170, 0], cc: '&2' },
			darkAqua: { rgb: [0, 170, 170], cc: '&3' },
			darkRed: { rgb: [170, 0, 0], cc: '&4' },
			darkPurple: { rgb: [170, 0, 170], cc: '&5' },
			gold: { rgb: [255, 170, 0], cc: '&6' },
			gray: { rgb: [170, 170, 170], cc: '&7' },
			darkGray: { rgb: [85, 85, 85], cc: '&8' },
			blue: { rgb: [85, 85, 255], cc: '&9' },
			green: { rgb: [85, 255, 85], cc: '&a' },
			aqua: { rgb: [85, 255, 255], cc: '&b' },
			red: { rgb: [255, 85, 85], cc: '&c' },
			lightPurple: { rgb: [255, 85, 255], cc: '&d' },
			yellow: { rgb: [255, 255, 85], cc: '&e' },
			white: { rgb: [255, 255, 255], cc: '&f' }
		}
		
		

		let minDistance = Infinity;
        let closestColor = null;
        for (const color in mcMaxRgb) {
            const colorDistance = Math.sqrt(intensitymode(r - mcMaxRgb[color]["rgb"][0], document.getElementById('redIntensity').value) + intensitymode(g - mcMaxRgb[color]["rgb"][1], document.getElementById('greenIntensity').value) + intensitymode(b - mcMaxRgb[color]["rgb"][2], document.getElementById('blueIntensity').value));
            if (colorDistance < minDistance) {
                minDistance = colorDistance;
                closestColor = color;
            }
        }
    
        return clr = mcMaxRgb[closestColor]["cc"]
	}
	
	return output;
	
}
