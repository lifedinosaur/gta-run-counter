require.config(
{
    baseUrl: 'assets/js/',
    paths:
    {
      bootstrap: 'lib/bootstrap/',
      greensock: 'lib/greensock/',
      jquery: 'lib/jquery',
      knockout: 'lib/knockout',
      lodash: 'lib/lodash',
      TweenLite: 'lib/greensock/TweenLite'
    }
});

define(
[
  'jquery',
  'lodash',
  'menu/score-menu'
],
function ($, _, ScoreMenu) {
  'use strict';

  var scoreMenu = new ScoreMenu('#gameMenu');

  var windowResized = _.debounce(function () {
    $(document).trigger('resize.counter');
  }, 17);

  $(window).resize(windowResized);
});
