var fs = require("fs");
var QRCode = require('qrcode');
var { createCanvas, Image } = require('canvas');
var hexRgb = require('hex-rgb');

function renderForm(req, res) {
    res.render("index")
}

async function generateQR(req, res) {
    try {
        let canvas = await generateCanvas(req);
        res.render("qr", {
            dataURL: canvas.toDataURL(),
            isURI: false
        })
    } catch (err) {
        res.status(500).send({message: err.message})
    }
}

async function generateQRURI(req, res) {
    try {
        let canvas = await generateCanvas(req);
        res.render("qr", {
            dataURL: canvas.toDataURL(),
            isURI: true
        })
    } catch (err) {
        res.status(500).send({message: err.message})
    }
}

async function downloadQR(req, res) {
    try {
        let canvas = await generateCanvas(req);
        res.set({
            'Cache-Control': 'no-cache',
            'Content-Type': "image/jpeg",
            'Content-Disposition': 'attachment; filename=' + "qrCode.jpeg"
        });
        res.status(200);
        canvas.pngStream().pipe(res);
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

function generateCanvas(req) {
    return new Promise((resolve, reject) => {
        try {
            let options = setQRGenerationOptions(req);
            let canvas = createCanvas(options.width, options.height);
            drawQR(canvas, req.body.content, options, (err, canvas) => {
                if (err) {
                    reject(err)
                } else {
                    if (options.frontColor) {
                        canvas = changeColor(options.frontColor, canvas);
                    }

                    if (req.body.logoImage) {
                        canvas = drawLogo(options, canvas);
                    }
                    resolve(canvas)
                }
            })

        } catch (err) {
            console.error("Error generating canvas: ", err.message);
            reject(err);
        }
    })
}

function setQRGenerationOptions(req) {
    let options = {};
    options.setErrorCorrectionLevel = getErrorCorrectionLevel(req.body.content);
    options.width = parseInt(req.body.width) || 200;
    options.height = parseInt(req.body.height) || 200;
    if(req.body.logoImage) {
        options.logo = req.body.logoImage
    }
    if(req.body.color) {
        options.frontColor = req.body.color
    }
    return options;
}

function drawQR(canvas, content, options, callback) {
    let ctx = canvas.getContext('2d');
    
    let image = new Image();
    QRCode.toDataURL(content, options, (err, data) => {
        if (err) {
            callback(err)
        } else {
            image.src = data;
            ctx.drawImage(image, 1 , 1, options.width - 5, options.height - 5);
            callback(null, canvas);
        }
    })
}

function getErrorCorrectionLevel(content = "") {
    //console.log(content.length)
    if (content.length > 36) {
        return "M";
    } else if (content.length > 16) {
        return "Q";
    } else {
        return "H";
    }
}

function changeColor(color, canvas) {
    try {
        let { red, green, blue } = hexRgb(color);
        let ctx = canvas.getContext('2d');
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let len = imageData.data.length;
        for (let i = 0; i < len; i += 4) {
            imageData.data[i] = red | imageData.data[i];
            imageData.data[i + 1] = green | imageData.data[i + 1];
            imageData.data[i + 2] = blue | imageData.data[i + 2];
        }
        ctx.putImageData(imageData, 0, 0);
        return canvas
    } catch(err) {
        console.error("changeColor Error: "+ err.message)
        return canvas;
    }
}

function drawLogo(options, canvas) {
    try {
        let ctx = canvas.getContext('2d');
        let image = new Image();
        image.src = options.logo || ""
        //image.width = options.width / 2;
        //image.height = options.height / 2;
        let x = (options.width - image.width) / 2;
        let y = (options.height - image.height) / 2;
        ctx.drawImage(image, x, y);
        return canvas; 
    } catch(err) {
        console.error("drawLogo Error: " + err.message)
        return canvas;
    }
    
}

module.exports = {
    renderForm,
    generateQR,
    downloadQR,
    generateQRURI
}