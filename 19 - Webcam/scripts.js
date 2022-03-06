const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
        //returns a promise
        .then(localMediaStream => {
            console.log(localMediaStream);
            // take video and set the source to be that local media stream
            //not gonna work automatically. MediaStream is an object and needs to be converted into a URL. so that video.src (player) can understand.

            //https://stackoverflow.com/questions/53626318/chrome-update-failed-to-execute-createobjecturl-on-url?rq=1
            // video.src = window.URL.createObjectURL(localMediaStream);
            video.srcObject = localMediaStream;
            video.play();
        })
        .catch(err => {
            console.error(`Oh No!!`, err);
        });
}

function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    console.log(width, height);
    
    // important to make sure canvas is SAME size as video.
    canvas.width = width;
    canvas.height = height;

    // every 16ms take image and paint it to canvas.

    // we use return here bc if we ever want to stop canvas from painting, we can just grab the interval.
    return setInterval(() => {
        // start at 0,0 top left corner and paint the width & height
        ctx.drawImage(video, 0, 0, width, height);

        // take pixels out
        let pixels = ctx.getImageData(0, 0, width, height);

            // console.log(pixels);
            // debugger; //stops the code and allows you to view last console data.

        //***mess with pixels***
        pixels = redEffect(pixels);
        
        // pixels = rgbSplit(pixels);
        // ctx.globalAlpha = 0.1; //ghost effect. stacks images with transparency. Each frame will appear for 10 frames as they get overlapped.

        // pixels = greenScreen(pixels);

        // *** put messed up pixels back ***
        ctx.putImageData(pixels, 0, 0);
    }, 16); //16ms
}

function takePhoto() {
    // play sound
    snap.currentTime = 0;
    snap.play();

    // take the data out of the canvas
    const data = canvas.toDataURL('image/jpeg');
    //outputs base64 text representing the image
    // console.log(data); 
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'js30test_handsomemf');
    // link.textContent = 'Download Image';
    link.innerHTML = `<img src = "${data}" alt ="Handsome mf" />`;
    // strip is where we dump our links.
    strip.insertBefore(link, strip.firstChild);
}

//last thing we want to do is add filters.
// concept: get pixels out of canvas --> change RGB values --> put them back in canvas.
function redEffect(pixels) {
    // pixels.length is NOT an array.   pixels.data.length is the array
    for(let i = 0; i < pixels.data.length; i+=4) {
        /* pixels[i] //r
        pixels[i+1] //g 
        pixels[i+2] //b */ 

        pixels.data[i + 0] = pixels.data[i + 0] + 100; // RED   last numbers random
        pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN to give cool effect
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
    }
    // return pixels after messing with rgb values.
    return pixels;
}

function rgbSplit(pixels) {
    for(let i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i - 150] = pixels.data[i + 0]; 
        pixels.data[i + 500] = pixels.data[i + 1]; 
        pixels.data[i - 550] = pixels.data[i + 2]; 
    }
    return pixels;
}

function greenScreen(pixels) {
    // hold min and max green values.
    const levels = {};

    document.querySelectorAll('.rgb input').forEach((input) => {
        levels[input.name] = input.value;
    });

    console.log(levels); //for some reason, not printing the same objects

    for (i = 0; i< pixels.data.length; i += 4) {
        red = pixels.data[i + 0];
        green = pixels.data[i + 1];
        blue = pixels.data[i + 2];
        alpha = pixels.data[i + 3];

        if (red >= levels.rmin
            && green >= levels.gmin
            && blue >= levels.bmin
            && red <= levels.rmax
            && green <= levels.gmax
            && blue <= levels.bmax) {
                // if there's any pixels between the min and max values, take it out by making it transparent!
                pixels.data[i + 3] = 0;
        }
    }
    return pixels;
}

getVideo();

// once video is played in getVideo function, it is going to emit an event called 'canplay' and in turn, it'll run paintToCanvas function
video.addEventListener('canplay', paintToCanvas);
