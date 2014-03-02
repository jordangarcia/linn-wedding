
var MOBILE_REGEX = /mobile|ip(hone|od)|android|symbian|blackberry|nokia|sonyericson|webos|^lg|^samsung|opera mini|palmsource/i;

function isMobile(ua) {
  return MOBILE_REGEX.test(ua || navigator.userAgent);
}

module.exports = isMobile;
