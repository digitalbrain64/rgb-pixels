var img = $("#selected-image").get(0);

$(document).ready(()=>{
    $("#process-image").on('click', ()=>{
        $("#rgb-results").hide();
        $('#loading-div').show();
        $('#process-image').hide();
        
        setTimeout(function(){
            processImage();
        },100);
    });
});


// reading and displaying the selected image
let readFile = (selectedFile)=>{
    // if selected files != null
    if (selectedFile.files && selectedFile.files[0]) {
        $(img).fadeOut(1);

        var reader = new FileReader();

        reader.onload = function (e) {
            $(img).fadeIn(1000);
            $(img).attr('src', e.target.result);
            
        };
        reader.readAsDataURL(selectedFile.files[0]);

        // show/hide some elements
        $('#rgb-results .rgb-items-row').empty();
        $("#process-image").fadeIn(300);
        $("#rgb-results").hide();
    }
}

let processImage = ()=>{
    var pxlArr = [];

    var canvas = $("#canvas")[0];

    // width and height with offset 
    var imgWidth = img.naturalWidth;
    var imgHeight = img.naturalHeight;

    // getting the context of canvas
    var canvasContext = canvas.getContext("2d");

    // setting the canvas width and height
    canvasContext.canvas.width = imgWidth;
    canvasContext.canvas.height = imgHeight;

    // drawing a copy of the original image
    canvasContext.drawImage(img, 0, 0, imgWidth, imgHeight);
    //$(canvas).css({'display':'none'});
    
    
    // getting the data about the individual pixels from canvasContext
    var imageData = canvasContext.getImageData(0,0,imgWidth,imgHeight);
    var pixelsData = imageData.data;

    // loop through all pixels
    for (var i = 0; i < imageData.width * imageData.height; i++) {
        
        var r = pixelsData[i*4]; // getting the value of Red
        var g = pixelsData[i*4+1]; // getting the value of Green
        var b = pixelsData[i*4+2]; // getting the value of Blue
        var a = pixelsData[i*4+3]; // getting the value of Alpha
        
        // getting the x,y coordinates of each pixel
        var y = parseInt(i / imageData.width, 10);
        var x = i - y * imageData.width;

    
        // getting the coordinates of each 'popular' pixel was for later displaying these pixel on each individual canvas
        // to show the location of the 'popular' pixels on the current image
        // because of perforamance issues the idea was dropped
        var pixelObj = {
            corX: x,
            corY: y,
        }
        var pixelIndex = findPixel(r,g,b, pxlArr);

        // if pixelIndex == null - add new pixel object
        if(!pixelIndex){
            pxlArr.push({
                red: r,
                green: g,
                blue: b,
                alpha: a,
                pixels: [pixelObj]  
            })
        }
        // else - add the x,y of the pixel to the pixel object
        else{
            pxlArr[pixelIndex].pixels.push(pixelObj);
        }
    }

    // diaplay to console the number of unique pixels
    console.log(pxlArr.length);

    // display the pixel array with all pixels sorted
    console.log(pxlArr);

    // sort the array from high to low by pixels.length (length of the pixel array in the pixel object)
    pxlArr.sort((a,b)=>{
        return b.pixels.length - a.pixels.length ;
    });

    // some show/hide effects on some elements
    $('#loading-div').hide();
    $("#process-image").hide();
    $("#rgb-results").show();

    // diaplay results
    displayMostCommonPixels(pxlArr);
}

// function to find the pixel in the array
let findPixel = (r,g,b, arr)=>{
    for (let i = 0; i < arr.length; i++) {
        if(arr[i].red == r && arr[i].green == g && arr[i].blue == b){
            return i; // if pixel found in the array - return the index
        }
    }
    return null;
}

let displayMostCommonPixels = (pxlArr)=>{
    if(pxlArr.length < 5){
        // in case there are less then 5 'popular' pixels
        pxlArr.forEach(element => {
            createRgbItem(pxlArr[i]);
        });
    }
    else{
        for (let i = 0; i < 5; i++) {
            createRgbItem(pxlArr[i])
        }
    }
    
}

let createRgbItem = (pxl)=>{
    var rgb_item_template = $('<div>',{
        class: 'rgb-item'
    });
    $(rgb_item_template).load('templates/rgb-item.html', function(){
        $(this).find('.rgb-percentage-block').css({background: `rgba(${pxl.red},${pxl.green},${pxl.blue})`});
        
        if(pxl.red < 150 || pxl.green < 150 || pxl.blue < 150){
            $(this).find(".rgb-percentage-block h5").css({'color': 'white'})
        }
        var pixelPercentage = ((pxl.pixels.length * 100) / (img.naturalWidth * img.naturalHeight ) ).toFixed(2);
        $(this).find(".rgb-percentage-block h5").text(`${pixelPercentage}%`);
        $(this).find('.colors').children().eq(0).text(`R:${pxl.red}`);
        $(this).find('.colors').children().eq(1).text(`G:${pxl.green}`);
        $(this).find('.colors').children().eq(2).text(`B:${pxl.blue}`);    

        $(this).find('[data-toggle="popover"]').popover();
        $(this).find('[data-toggle="popover"]').attr('data-content', `${pxl.pixels.length} pixels`);
    });
    $('#rgb-results .rgb-items-row').append(rgb_item_template);
}

