"use strict";

const debug = true;
/* eslint-disable-next-line no-unused-vars */
const log = (() => {
  if (!debug) return () => {
    return null;
  };
  return (...arg) => {
    /* eslint-disable-next-line no-console */
    console.log(...arg);
  };
})();

const canvas = {
  startX: -1,
  startY: -1,
  init: () => {
    const _t = canvas;
    const theCanvas = document.getElementById('canvas');
    _t.context = theCanvas.getContext('2d');

    _t.imageObject = {
      image: new Image(),
      x: 0,
      y: 0,
      width: 178,
      height: 100,
    };
    _t.imageObject.image.addEventListener('load', _t.drawImage());
    _t.imageObject.image.src = '/img/sample.jpg';

    _t.imageDrag = false;

    theCanvas.addEventListener('mousedown', _t.onMouseDown);
    theCanvas.addEventListener('mouseup', _t.onMouseUp, false);
    theCanvas.addEventListener('mousemove', _t.onMouseMove, false);
  },
  drawImage: () => {
    const _t = canvas;
    return (ev) => {
      _t.imageObject.width = 178;
      _t.imageObject.height = 100;
      const imageObject = _t.imageObject;
      _t.context.drawImage(imageObject.image, imageObject.x,imageObject.y,imageObject.width,imageObject.height);
    };
  },
  onMouseDown: (ev) => {
    const _t = canvas;
    const x = ev.offsetX;
    const y = ev.offsetY;

    // log('onMouseDown');
    const isEvInImgGeo = {
      left   : (x > _t.imageObject.x),
      right  : (x < _t.imageObject.x + _t.imageObject.width),
      top    : (y > _t.imageObject.y),
      bottom : (y < _t.imageObject.y+_t.imageObject.height),
    };
    const isEvInImg = (isEvInImgGeo.left && isEvInImgGeo.right && isEvInImgGeo.top && isEvInImgGeo.bottom);
    if (isEvInImg) {
      _t.imageDrag = true;
      _t.startX = x;
      _t.startY = y;
    }
  },
  onMouseMove: (ev) => {
    const _t = canvas;
    if (_t.imageDrag === true) {
      const x = ev.offsetX;
      const y = ev.offsetY;
      const newX = _t.imageObject.x + x - _t.startX;
      const newY = _t.imageObject.y + y - _t.startY;

      _t.context.fillStyle = 'white';
      _t.context.fillRect(0, 0, 640, 480);
      _t.context.drawImage(_t.imageObject.image, newX, newY, _t.imageObject.width, _t.imageObject.height);
    }
  },
  onMouseUp: (ev) => {
    const _t = canvas;
    if(_t.imageDrag) {
      _t.imageDrag = false;
      const x = ev.offsetX;
      const y = ev.offsetY;
      _t.imageObject.x += x - _t.startX;
      _t.imageObject.y += y - _t.startY;
    }
  },
};

// page load handler
const loadHandler = () => {
  canvas.init();
};

// ページロード監視
if (document.readyState !== 'loading') {
  loadHandler();
} else {
  document.addEventListener('DOMContentLoaded', loadHandler);
}
