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
  lastX: 0,
  lastY: 0,
  init: () => {
    const _t = canvas;
    const theCanvas = document.getElementById('canvas');
    _t.context = theCanvas.getContext('2d');

    _t.imageObject = {
      image: new Image(),
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
    _t.imageObject.image.addEventListener('load', _t.setImage());
    _t.imageObject.image.src = '/img/sample.jpg';

    _t.imageDrag = false;

    theCanvas.addEventListener('mousedown', _t.onMouseDown);
    theCanvas.addEventListener('mouseup', _t.onMouseUp, false);
    theCanvas.addEventListener('mousemove', _t.onMouseMove, false);
    theCanvas.addEventListener('mouseout', _t.onMouseOut, false);
  },
  fitWidth: (maxSize, naturalWidth, naturalHeight) => {
    let width = 0, height = 0;
    if (naturalWidth > naturalHeight) {
      // landscape
      height = maxSize;
      const mag = naturalHeight / maxSize;
      width = Math.floor(naturalWidth / mag);
    } else {
      // portrait
      width = maxSize;
      const mag = naturalWidth / maxSize;
      height = Math.floor(naturalHeight / mag);
    }
    return {width, height};
  },
  setImage: () => {
    const _t = canvas;
    return (ev) => {
      const naturalWidth  = ev.target.naturalWidth;
      const naturalHeight = ev.target.naturalHeight;
      const maxSize = 300;
      const geo = _t.fitWidth(maxSize, naturalWidth, naturalHeight);
      _t.imageObject.width = geo.width;
      _t.imageObject.height = geo.height;
      const imageObject = _t.imageObject;
      _t.context.drawImage(imageObject.image, imageObject.x,imageObject.y,imageObject.width,imageObject.height);
    };
  },
  onMouseDown: (ev) => {
    const _t = canvas;
    const x = ev.offsetX * 2;
    const y = ev.offsetY * 2;

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
      _t.lastX = ev.offsetX * 2;
      _t.lastY = ev.offsetY * 2;
      const newX = _t.imageObject.x + _t.lastX - _t.startX;
      const newY = _t.imageObject.y + _t.lastY - _t.startY;

      _t.context.fillStyle = 'white';
      _t.context.fillRect(0, 0, 1280, 960);
      _t.context.drawImage(_t.imageObject.image, newX, newY, _t.imageObject.width, _t.imageObject.height);
    }
  },
  endDrag: () => {
    const _t = canvas;
    if (_t.imageDrag) {
      _t.imageDrag = false;
      _t.imageObject.x += _t.lastX - _t.startX;
      _t.imageObject.y += _t.lastY - _t.startY;
    }
  },
  onMouseUp: (ev) => {
    const _t = canvas;
    _t.endDrag();
  },
  onMouseOut: (ev) => {
    const _t = canvas;
    _t.endDrag();
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
