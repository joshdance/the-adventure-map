const width = 1150;
const height = 920;
const ratio = 2;

const canvas = document.createElement('canvas');
canvas.width = width * ratio;
canvas.height = width * ratio;
const canvasContext = canvas.getContext('2d');

function createGraphicFileFromDocumentText(documentText) {
    const originalData = new Blob([documentText], { type: 'image/svg+xml' });
    return URL.createObjectURL(originalData);
}

function urlToImageElement(url) {
    return new Promise((resolve) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.src = url;
    });
}

export async function generateImage(graphic, documentElement, outputimage) {
    const documentText = `<?xml version="1.0" encoding="utf-8"?>
        <svg xmlns="http://www.w3.org/2000/svg" 
             viewBox="0 0 ${width} ${height}" 
             width="${width}px" 
             height="${height}px">
            ${graphic.innerHTML}
        </svg>`;

    const dataurl = createGraphicFileFromDocumentText(documentText);
    const image = await urlToImageElement(dataurl);
    
    // Fill background
    canvasContext.fillStyle = documentElement.style.backgroundColor;
    canvasContext.fillRect(0, 0, width * ratio, width * ratio);
    
    // Draw image
    canvasContext.drawImage(
        image,
        0, 0,
        width, height,
        0, (width - height) * ratio / 2,
        width * ratio, height * ratio
    );

    return new Promise(resolve => {
        canvas.toBlob(elementdata => {
            const url = URL.createObjectURL(elementdata);
            
            // Update UI
            outputimage.style.display = '';
            outputimage.querySelector('img').src = url;
            
            resolve(url);
        }, 'image/png');
    });
}

export function downloadImage(url, filename = 'US Level 0.png') {
    const isSocialMedia = /weibo|qq/i.test(navigator.userAgent);
    const element = document.createElement('a');
    
    if (!isSocialMedia) {
        element.download = filename;
    }
    element.href = url;
    element.click();
} 