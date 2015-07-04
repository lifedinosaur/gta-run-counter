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

  var animTime = 0.35;

  var menuVM = new ViewModel('#gameMenu');

  menuVM.open = ko.observableArray();
  menuVM.buttons = {};

  _.forEach(MENU_TYPES, function (type) {
    menuVM[type + 'Open'] = function () {
      toggleMenu(type);
    };

    menuVM[type + 'IsOpen'] = ko.observable(false);
    menuVM.open.push(menuVM[type + 'IsOpen']);

    menuVM.buttons[type] = $('#menu-btn-' + type);
  });



  function isMenuOpen (p) {
    var open = false;

    _.forEach(menuVM.open(), function (v, k) {
      if (open) {
        return;
      }

      open = v();
    });

    if (open) {
      p.addClass('open');
    }
    else {
      p.removeClass('open');
    }

    return open;
  }

  function closeMenu (menuType) {
    var $btn = $('#menu-btn-' + menuType);

    if (!$btn.length) {
      throw new Error('toggleMenu cannot find the button for menuType ' + menuType);
    }

    var $item = $btn.parents('.menu-item');

    if (!$item.hasClass('open')) {
      return;
    }

    var $primary = $item.parents('.primary');

    var $label = $btn.find('.label-wrapper');

    var $arrow = $btn.find('.arrow');

    $item.removeClass('open');
    menuVM[menuType + 'IsOpen'](false);

    var t = $item.position().top - 64;

    $item.addClass('animating');

    TweenLite.to($item[0], animTime, {
      'top': t,
      onComplete: function () {
        $item.removeClass('animating');
      }
    });

    TweenLite.to($btn[0], animTime, {
      'marginLeft': '0px',
      'paddingLeft': '0px',
      onComplete: function () {
        $item.removeClass('animating');
      }
    });

    TweenLite.to($label[0], animTime, {
      'marginLeft': '0px',
      onComplete: function () {
        $item.removeClass('animating');
      }
    });

    TweenLite.to($arrow[0], animTime, {
      'fontSize': '1.2em',
      'rotation': 0,
      'width': '2em',
      onComplete: function () {
        $item.removeClass('animating');
      }
    });

    $btn.find('.arrow')
      .removeClass('fa-times')
      .addClass('fa-angle-right');

    var open = isMenuOpen($primary);

    if (!open) {
      TweenLite.to($primary[0], animTime, {
        'paddingTop': '0px',
        onComplete: function () {
          $item.removeClass('animating');
        }
      });
    }
  }

  function openMenu (menuType) {
    var $btn = $('#menu-btn-' + menuType);

    if (!$btn.length) {
      throw new Error('toggleMenu cannot find the button for menuType ' + menuType);
    }

    var $item = $btn.parents('.menu-item');

    var $primary = $item.parents('.primary');

    var $label = $btn.find('.label-wrapper');

    var $arrow = $btn.find('.arrow');


    $item.css('top', $item.position().top);

    $item.addClass('open animating');
    menuVM[menuType + 'IsOpen'](true);

    TweenLite.to($item[0], animTime, {
      'top': 0,
      onComplete: function () {
        $item.removeClass('animating');
      }
    });

    TweenLite.to($btn[0], animTime, {
      'marginLeft': '-40px',
      'paddingLeft': '80px',
      onComplete: function () {
        $item.removeClass('animating');
      }
    });

    TweenLite.to($label[0], animTime, {
      'marginLeft': '-120px',
      onComplete: function () {
        $item.removeClass('animating');
      }
    });

    TweenLite.to($arrow[0], animTime, {
      'fontSize': '0.9em',
      'rotation': 90,
      'width': '5em',
      onComplete: function () {
        $item.removeClass('animating');
      }
    });

    $btn.find('.arrow')
      .removeClass('fa-angle-right')
      .addClass('fa-times');

    isMenuOpen($primary);

    TweenLite.to($primary[0], animTime, {
      'paddingTop': '64px',
      onComplete: function () {
        $item.removeClass('animating');
      }
    });
  }

  function toggleMenu (menuType) {
    var $btn = $('#menu-btn-' + menuType);

    if (!$btn.length) {
      throw new Error('toggleMenu cannot find the button for menuType ' + menuType);
    }

    var $item = $btn.parents('.menu-item');

    var open = $item.hasClass('open');

    if (!open) {
      // close all others:
      _.forEach(menuVM.buttons, function (v, k) {
        if (k == menuType) {
          return;
        }

        closeMenu(k);
      });

      openMenu(menuType);
    }
    else {
      closeMenu(menuType);
    }
  }

  menuVM.generateViewModel();
});
