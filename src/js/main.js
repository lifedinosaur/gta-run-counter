require.config(
{
    baseUrl: 'assets/js/',
    paths:
    {
      bootstrap: 'lib/bootstrap/',
      jquery: 'lib/jquery'
    }
});

define(
[
  'jquery'
],
function ($) {
  'use strict';

  console.log('success!', $);
});
