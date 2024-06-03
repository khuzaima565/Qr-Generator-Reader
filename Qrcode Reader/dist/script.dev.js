"use strict";

document.addEventListener('DOMContentLoaded', function () {
  var qrInput = document.getElementById('qr-input');
  var generateBtn = document.getElementById('generate-btn');
  var qrCode = document.getElementById('qr-code');
  var startBtn = document.getElementById('start-btn');
  var video = document.getElementById('video');
  var output = document.getElementById('output');
  var fileInput = document.getElementById('file-input');
  var downloadBtn = document.getElementById('download-btn');
  generateBtn.addEventListener('click', function () {
    var qrValue = qrInput.value;

    if (qrValue) {
      qrCode.innerHTML = '';
      var qr = new QRCode(qrCode, {
        text: qrValue,
        width: 256,
        height: 256,
        colorDark: "#ffffff",
        colorLight: "#00216e"
      });
      downloadBtn.setAttribute('href', qr._el.firstChild.toDataURL("image/png"));
      downloadBtn.setAttribute('download', 'qr-code.png');
    } else {
      alert('Please enter a valid text or URL');
    }
  });
  startBtn.addEventListener('click', function () {
    video.style.display = 'block';
    startQRCodeScanning();
  });

  function startQRCodeScanning() {
    var constraints, stream;
    return regeneratorRuntime.async(function startQRCodeScanning$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            constraints = {
              video: {
                facingMode: 'environment'
              }
            };
            _context.next = 4;
            return regeneratorRuntime.awrap(navigator.mediaDevices.getUserMedia(constraints));

          case 4:
            stream = _context.sent;
            video.srcObject = stream;
            video.setAttribute('playsinline', true);
            video.play();
            requestAnimationFrame(tick);
            _context.next = 14;
            break;

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](0);
            console.error('Error accessing the camera: ', _context.t0);

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[0, 11]]);
  }

  function tick() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      var canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      var context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      var code = jsQR(imageData.data, canvas.width, canvas.height);

      if (code) {
        output.textContent = "QR Code Data: ".concat(code.data);
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
    var stream = video.srcObject;
    var tracks = stream.getTracks();
    tracks.forEach(function (track) {
      return track.stop();
    });
    video.srcObject = null;
  }

  fileInput.addEventListener('change', function (event) {
    var file = event.target.files[0];

    if (file) {
      var reader = new FileReader();

      reader.onload = function (e) {
        var img = new Image();

        img.onload = function () {
          var canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          var context = canvas.getContext('2d');
          context.drawImage(img, 0, 0, canvas.width, canvas.height);
          var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          var code = jsQR(imageData.data, canvas.width, canvas.height);

          if (code) {
            output.textContent = "QR Code Data: ".concat(code.data);
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
//# sourceMappingURL=script.dev.js.map
