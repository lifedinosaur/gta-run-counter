define(
[
  'jquery',
  'lodash'
],
function ($, _) {
  'use strict';

  $.fn.cssNumber = function (prop) {
    var v = parseFloat($(this).css(prop), 10);
    return isNaN(v) ? 0 : v;
  };

  var exports = {};

  return exports;
});
