document.addEventListener('DOMContentLoaded', () => {
    const qrInput = document.getElementById('qr-input');
    const generateBtn = document.getElementById('generate-btn');
    const qrCode = document.getElementById('qr-code');
    const startBtn = document.getElementById('start-btn');
    const video = document.getElementById('video');
    const output = document.getElementById('output');
    const fileInput = document.getElementById('file-input');
    const downloadBtn = document.getElementById('download-btn');

    generateBtn.addEventListener('click', () => {
        const qrValue = qrInput.value;
        if (qrValue) {
            qrCode.innerHTML = '';
            const qr = new QRCode(qrCode, {
                text: qrValue,
                width: 256,
                height: 256,
                colorDark: "#ffffff",
                colorLight: "#00216e",
            });
            downloadBtn.setAttribute('href', qr._el.firstChild.toDataURL("image/png"));
            downloadBtn.setAttribute('download', 'qr-code.png');
        } else {
            alert('Please enter a valid text or URL');
        }
    });

    startBtn.addEventListener('click', () => {
        video.style.display = 'block';
        startQRCodeScanning();
    });

    async function startQRCodeScanning() {
        try {
            const constraints = {
                video: { facingMode: 'environment' }
            };
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            video.srcObject = stream;
            video.setAttribute('playsinline', true);
            video.play();
            requestAnimationFrame(tick);
        } catch (error) {
            console.error('Error accessing the camera: ', error);
        }
    }

    function tick() {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, canvas.width, canvas.height);
            if (code) {
                output.textContent = `QR Code Data: ${code.data}`;
                video.style.display = 'none';
                stopVideoStream();
            } else {
                requestAnimationFrame(tick);
            }
        } else {
            requestAnimationFrame(tick);
        }
    }

    function stopVideoStream() {
        const stream = video.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
    }

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const context = canvas.getContext('2d');
                    context.drawImage(img, 0, 0, canvas.width, canvas.height);
                    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                    const code = jsQR(imageData.data, canvas.width, canvas.height);
                    if (code) {
                        output.textContent = `QR Code Data: ${code.data}`;
                    } else {
                        output.textContent = 'No QR code found.';
                    }
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
});
