function randomizer(){
    

    var a1 = Math.floor(Math.random() * 2)
    var a2 =Math.floor(Math.random() * 2)
    var a3 =Math.floor(Math.random() * 2)
    var a4 =Math.floor(Math.random() * 2)
    var a5 =Math.floor(Math.random() * 2)
    
    var a6 =Math.floor(Math.random() * 4)
    var a7 =Math.floor(Math.random() * 15)
    var a8 =Math.floor(((Math.random() * 72)+1)-36)
    var a9 =Math.floor(((Math.random() * 72)+1)-36)
    var a10 =Math.floor(((Math.random() * 72)+1)-36)
    var a11 =(((Math.random() * 10)+1))
    var a12 =(((Math.random() * 255)+1))
   
    //a1==0?settings.inverted=false:settings.inverted=true;
    if(a1==0){
        document.getElementById('inverted').checked = false
        settings.inverted=false
    } else{
        document.getElementById('inverted').checked = true
        settings.inverted=true
    }
    if(a2==0){
        document.getElementById('dithering').checked = false
        settings.dithering=false
    } else{
        document.getElementById('dithering').checked = true
        settings.dithering=true
    }
    if(a3==0){
        document.getElementById('monospace').checked = false
        settings.monospace=false
    } else{
        document.getElementById('monospace').checked = true
        settings.monospace=true
    }
    if(a4==0){
        document.getElementById('minecraft').checked = false
        settings.minecraft=false
    } else{
        document.getElementById('minecraft').checked = true
        settings.minecraft=true
    }
    if(a5==0){
        document.getElementById('I4').checked = false
        settings.I4=false
    } else{
        document.getElementById('I4').checked = true
        settings.I4=true
    }
    //non on and off
    
    switch(a6){
        case 0:settings.greyscale_mode ="luminance"
            document.getElementById('greyscale_mode').value = "luminance"
        break;
        case 1:settings.greyscale_mode ="lightness"
            document.getElementById('greyscale_mode').value = "lightness"
        break;
        case 2:settings.greyscale_mode ="average"
            document.getElementById('greyscale_mode').value = "average"
        break;
        case 3:settings.greyscale_mode = "value"
            document.getElementById('greyscale_mode').value = "value"
        break;
        default:
            console.error("No Selection")
            break;
    }



    switch(a7) {
		case 0:
		    settings.intensity_mode = "pow"
            document.getElementById('intensitymode').value = "pow"
		    break;
		case 1:  
            settings.intensity_mode = "sqrt"
            document.getElementById('intensitymode').value = "sqrt" 
		    break;
		case 2: 
            settings.intensity_mode = "floor"
            document.getElementById('intensitymode').value = "floor"
			break;
		case 3: 
            settings.intensity_mode = "max"
            document.getElementById('intensitymode').value = "max"
			break;
		case 4: 
            settings.intensity_mode = "min"
            document.getElementById('intensitymode').value = "min"
			break;
		case 5:
			settings.intensity_mode ="random"
            document.getElementById('intensitymode').value = "random"
			break;
		case 6:
			settings.intensity_mode ="cbrt"
            document.getElementById('intensitymode').value = "cbrt"
			break;
		case 7:
			settings.intensity_mode = "imul"
            document.getElementById('intensitymode').value = "imul"
			break;
		case 8:
			settings.intensity_mode ="expm1"
            document.getElementById('intensitymode').value = "expm1"
			break;
		case 9:
			settings.intensity_mode ="exp"
            document.getElementById('intensitymode').value = "exp"
			break;
		case 10:
			settings.intensity_mode ="atan2"
            document.getElementById('intensitymode').value = "atan2"
			break;
		case 11:
			settings.intensity_mode ="atan"
            document.getElementById('intensitymode').value = "atan"
			break;
		case 12:
			settings.intensity_mode ="log1p"
            document.getElementById('intensitymode').value = "log1p"
			break;
		case 13:
			settings.intensity_mode ="clz32"
            document.getElementById('intensitymode').value = "clz32"
			break;
		case 14:
			settings.intensity_mode ="sin"
            document.getElementById('intensitymode').value = "sin"
			break;
		default: console.error("No Selection")
		break;
	}

    document.getElementById('rint').value = a8
    document.getElementById('redIntensity').value = a8
    document.getElementById('gint').value = a9
    document.getElementById('greenIntensity').value = a9
    document.getElementById('bint').value = a10
    document.getElementById('blueIntensity').value = a10

    document.getElementById('satt').value =a11
    document.getElementById('saturation').value = a11
	document.getElementById('thresh').value = a12
    document.getElementById('threshold').value = a12
    loadNewImage(settings.last_source)
  }