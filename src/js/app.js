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

const picture = {
  startX: -1,
  startY: -1,
  lastX: 0,
  lastY: 0,
  init: () => {
    const _t = picture;
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
    const _t = picture;
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
    const _t = picture;
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
    const _t = picture;
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
    const _t = picture;
    if (_t.imageDrag) {
      _t.imageDrag = false;
      _t.imageObject.x += _t.lastX - _t.startX;
      _t.imageObject.y += _t.lastY - _t.startY;
    }
  },
  onMouseUp: (ev) => {
    const _t = picture;
    _t.endDrag();
  },
  onMouseOut: (ev) => {
    const _t = picture;
    _t.endDrag();
  },
};

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

class Particle {
  constructor (ctx, index) {
    // 初期座標
    this.ctxWidth = ctx.canvas.width;
    this.ctxHeight = ctx.canvas.height;
    this.x = getRandomInt(this.ctxWidth);
    this.y = getRandomInt(this.ctxHeight);
    // this.y = Math.floor(getRandomInt(this.ctxHeight));
    // 進行角度
    const runDegree = getRandomInt(Math.PI * 360);
    this.toX = Math.cos( runDegree );
    this.toY = Math.sin( runDegree );


    this.speed = getRandomInt(3) + 1;
    this.speedDiff = Math.random() / 10;
    this.size = getRandomInt(8) + 1;
    this.isSpeedIncrese = getRandomInt(2);
    this.color = `hsl(${getRandomInt(256)}, ${getRandomInt(40) + 60}%, 50%)`;
  };
  move () {
    this.x += this.toX * this.speed;
    this.y += this.toY * this.speed;
    if (this.isSpeedIncrese === 1) {
      this.speed += this.speedDiff;
      if (this.speed >= 10) {
        this.isSpeedIncrese = 0;
      }
    } else {
      this.speed -= this.speedDiff;
      if (this.speed <= 2) {
        this.speed = 2;
        this.isSpeedIncrese = 1;
      }
    }
    // はみだし検知
    if (this.x + this.size < 0) {
      this.x = this.ctxWidth;
    } else if (this.x > this.ctxWidth) {
      this.x = 0 - this.size;
    }
    if (this.y + this.size < 0) {
      this.y = this.ctxHeight;
    } else if (this.y > this.ctxHeight) {
      this.y = 0 - this.size;
    }
  }
}
const waves = {
  y50: 0,
  amplitude: 100,
  amplitudeDelta: 2,
  amplitudePlus:  true,
  angle:  0,
  PI:  Math.PI * 90,
  draw: (ctx) => {
    const _t = waves;
    _t.y50 = Math.floor(ctx.canvas.height / 2);

    ctx.beginPath();
    ctx.strokeStyle = '#0f0';
    ctx.moveTo(0,_t.y50);
    for (let i = 0; i < ctx.canvas.width; i++) {
      ctx.lineTo(i, Math.cos((i + _t.angle) / 90) * _t.amplitude + _t.y50);
    }
    ctx.stroke();
    _t.angle += 1;
    if (_t.angle > _t.PI) _t.angle = _t.PI * -1;
    if (_t.amplitudePlus === true) {
      if (_t.amplitude <= 200) {
        _t.amplitude += _t.amplitudeDelta;
      } else {
        _t.amplitudePlus = false;
      }
    } else {
      if (_t.amplitude >= -200 ) {
        _t.amplitude -= _t.amplitudeDelta;
      } else {
        _t.amplitudePlus = true;
      }
    }

  },

};

const particles = [];
// page load handler
const loadHandler = () => {
  const theCanvas = document.getElementById('canvas');
  const ctx = theCanvas.getContext('2d');

  for (let i = 0; i < 100; i++) {
    particles[i] = new Particle(ctx, i);
  }

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const draw = () => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.arc(p.x, p.y, p.size, 0, 360 * Math.PI);
      ctx.fill();
      p.move();
    }
    // draw wave
    waves.draw(ctx);
  };
  // 起動
  setInterval(draw, 25);
};

// ページロード監視
if (document.readyState !== 'loading') {
  loadHandler();
} else {
  document.addEventListener('DOMContentLoaded', loadHandler);
}
