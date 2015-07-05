require.config(
{
    baseUrl: 'assets/js/',
    paths:
    {
      bootstrap: 'lib/bootstrap/',
      greensock: 'lib/greensock/',
      jquery: 'lib/jquery',
      knockout: 'lib/knockout',
      lodash: 'lib/lodash'
    }
});

define(
[
  'jquery',
  'lodash',
  'score-menu'
],
function ($, _, ScoreMenu) {
  'use strict';

  var scoreMenu = new ScoreMenu('#gameMenu');
});
