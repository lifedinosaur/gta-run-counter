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
  'knockout',
  'greensock/gsap'
],
function ($, _, ko, TweenLite) {
  'use strict';


  function ViewModel (targetNodeId) {
    if (targetNodeId === undefined) {
      throw new Error('The parameter \'targetNodeId\' must be defined.');
    }

    if (!$(targetNodeId).length) {
      throw new Error('The element referenced by \'targetNodeId\' must exist.');
    }

    this.bindingNodeId = targetNodeId;
  }

  ViewModel.prototype = {
    'constructor': ViewModel,

    bindingNodeId: undefined,

    generateViewModel: function () {
      ko.applyBindings(this, $(this.bindingNodeId)[0]);
    },

    removeViewModel: function () {
      ko.cleanNode($(this.bindingNodeId)[0]);
    }
  };


  var MENU_TYPES = {
    KILLS: 'kills',
    STARS: 'stars',
    WEAPONS: 'weapons',
    VEHICLES: 'vehicles',
    LOCATIONS: 'locations'
  };

  var menuVM = new ViewModel('#gameMenu');

  function addMenuClick (menuType) {
    menuVM[menuType + 'Open'] = function () {
      openMenu(menuType);
    };

    menuVM[menuType + 'IsOpen'] = ko.observable(false);
  }

  _.forEach(MENU_TYPES, function (type) {
    addMenuClick(type);
  });


  function openMenu (menuType) {
    var $btn = $('#menu-btn-' + menuType);

    if (!$btn.length) {
      throw new Error('openMenu cannot find the button for menuType ' + menuType);
    }

    var animTime = 0.35;

    var $item = $btn.parents('.menu-item');

    var $label = $btn.find('.label-wrapper');

    var $arrow = $btn.find('.arrow');


    var open = $item.hasClass('open');

    if (!open) {
      $item.css('top', $item.position().top);

      $item.addClass('open');

      TweenLite.to($item[0], animTime, {
        'top': 0
      });

      TweenLite.to($btn[0], animTime, {
        'marginLeft': '-40px',
        'paddingLeft': '80px',
        'paddingRight': '100%'
      });

      TweenLite.to($label[0], animTime, {
        'marginLeft': '-120px'
      });

      TweenLite.to($arrow[0], animTime, {
        'rotation': 90
      });

      $btn.find('.arrow')
        .removeClass('fa-angle-right')
        .addClass('fa-times');
    }
    else {
      $item.removeClass('open');

      var t = $item.position().top;

      $item.addClass('open');

      TweenLite.to($item[0], animTime, {
        'top': t,
        onComplete: function () {
          $item.removeClass('open');
        }
      });

      TweenLite.to($btn[0], animTime, {
        'marginLeft': '0px',
        'paddingLeft': '0px',
        'paddingRight': '0%'
      });

      TweenLite.to($label[0], animTime, {
        'marginLeft': '0px'
      });

      TweenLite.to($arrow[0], animTime, {
        'rotation': 0
      });

      $btn.find('.arrow')
        .removeClass('fa-times')
        .addClass('fa-angle-right');
    }

    menuVM[menuType + 'IsOpen'](open);
  }

  menuVM.generateViewModel();
});
