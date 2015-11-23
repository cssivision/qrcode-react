# qrcode-react

A React component to generate [QRCode](http://en.wikipedia.org/wiki/QR_code) with logo.
Inspired by [zpao](https://github.com/zpao/qrcode.react)

## Installation

```sh
npm install qrcode-react
```

## Usage

```js
var React = require('react');
var QRCode = require('qrcode.react');

React.render(
  <QRCode value="http://facebook.github.io/react/" />,
  mountNode
);
```

## Available Props

prop      | type                 | default value
----------|----------------------|--------------
`value`   | `string`             |
`size`    | `number`             | `128`
`bgColor` | `string` (CSS color) | `"#FFFFFF"`
`fgColor` | `string` (CSS color) | `"#000000"`
`logo'    | `string` (URL / PATH)|

<img src="qrcode.png" height="256" width="256">
