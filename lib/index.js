'use strict'

var React = require('react');
var qr = require('qr.js');

function getBackingStorePixelRatio(ctx) {
  return (
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio ||
    1
  );
}

var getDOMNode;
if (/^0\.14/.test(React.version)) {
  getDOMNode = function(ref) {
    return ref;
  }
} else {
  getDOMNode = function(red) {
    return ref.getDOMNode();
  }
}

var QRCode = React.createClass({
  propTypes: {
    value: React.PropTypes.string.isRequired,
    size: React.PropTypes.number,
    bgColor: React.PropTypes.string,
    fgColor: React.PropTypes.string,
    logo: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      size: 128,
      bgColor: '#FFFFFF',
      fgColor: '#000000',
      value: 'http://facebook.github.io/react/',
    };
  },

  shouldComponentUpdate: function(nextProps) {
    var that = this;
    return Object.keys(QRCode.propTypes).some(function(k) {
      return that.props[k] !== nextProps[k];
    });
  },

  componentDidMount: function() {
    this.update();
  },

  componentDidUpdate: function() {
    this.update();
  },

  utf16to8: function(str) {
    var out, i, len, c;
    out = "";
    len = str.length;
    for(i = 0; i < len; i++) {
      c = str.charCodeAt(i);
      if ((c >= 0x0001) && (c <= 0x007F)) {
        out += str.charAt(i);
      } else if (c > 0x07FF) {
        out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
        out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
        out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
      } else {
        out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
        out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
      }
    }
    return out;
  },

  update: function() {
    var value = this.utf16to8(this.props.value);
    var qrcode = qr(value);
    var canvas = getDOMNode(this.refs.canvas);

    var ctx = canvas.getContext('2d');
    var cells = qrcode.modules;
    var tileW = this.props.size / cells.length;
    var tileH = this.props.size / cells.length;
    var scale = window.devicePixelRatio / getBackingStorePixelRatio(ctx);
    canvas.height = canvas.width = this.props.size * scale;
    ctx.scale(scale, scale);

    cells.forEach(function(row, rdx) {
      row.forEach(function(cell, cdx) {
        ctx.fillStyle = cell ? this.props.fgColor : this.props.bgColor;
        var w = (Math.ceil((cdx + 1) * tileW) - Math.floor(cdx * tileW));
        var h = (Math.ceil((rdx + 1) * tileH) - Math.floor(rdx * tileH));
        ctx.fillRect(Math.round(cdx * tileW), Math.round(rdx * tileH), w, h);
      }, this);
    }, this);

    if(this.props.logo) {
      var size = this.props.size;
      var image = document.createElement('img');
      image.src = this.props.logo;
      image.onload = function () {
          var dx = size / 2 - size * 0.1;
          var dwidth = size * 0.2;
          ctx.drawImage(image, dx, dx, dwidth, dwidth);
      }
    }
  },

  render: function() {
    return React.createElement('canvas', {
      style: { height: this.props.size, width: this.props.size },
      height: this.props.size,
      width: this.props.size,
      ref: 'canvas'
    });
  }
});

module.exports = QRCode;
