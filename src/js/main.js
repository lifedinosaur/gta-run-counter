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

  var buttonHeight = 56;

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

  function setMenuForAnim ($primary, $btn) {
    $primary.css('height', $primary.outerHeight());

    TweenLite.to($primary[0], animTime, {
      onComplete: function () {
        $primary.css('height', 'auto');
      }
    });


    var after = false;
    var set = [];
    _.forEach(menuVM.buttons, function ($b, k) {
      if ($b[0] == $btn[0]) {
        after = true;
        return;
      }

      if (!after) {
        return;
      }

      var $i = $b.parents('.menu-item');

      set.unshift($i);
    });

    _.forEach(set, function ($i, idx) {
      var it = $i.position().top;

      $i.css('top', it + 'px');
      $i.addClass('animating');

      TweenLite.to($i[0], animTime, {
        onComplete: function () {
          $i.removeClass('animating');
        }
      });
    });
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

    setMenuForAnim($primary, $btn);


    $item.removeClass('open');
    menuVM[menuType + 'IsOpen'](false);


    var t = $item.position().top - buttonHeight;

    $item.addClass('animating');

    TweenLite.to($item[0], animTime, {
      'top': t,
      onComplete: function () {
        $item.removeClass('animating');
      }
    });

    TweenLite.to($btn[0], animTime, {
      'borderRadius': '4px',
      'marginLeft': '0px',
      'paddingLeft': '0px'
    });

    TweenLite.to($label[0], animTime, {
      'marginLeft': '0px'
    });

    TweenLite.to($arrow[0], animTime, {
      'fontSize': '1.2em',
      'rotation': 0,
      'width': '2em'
    });

    $btn.find('.arrow')
      .removeClass('fa-times')
      .addClass('fa-angle-right');

    var open = isMenuOpen($primary);

    if (!open) {
      TweenLite.to($primary[0], animTime, {
        'paddingTop': '0px'
      });
    }
    else {
      console.log('TODO: find any menu items above the item and push them up buttonHeight');
    }
  }

  function openMenu (menuType) {
    console.log('open menu', menuType);

    var $btn = $('#menu-btn-' + menuType);

    if (!$btn.length) {
      throw new Error('toggleMenu cannot find the button for menuType ' + menuType);
    }

    var $item = $btn.parents('.menu-item');

    var $primary = $item.parents('.primary');

    var $label = $btn.find('.label-wrapper');

    var $arrow = $btn.find('.arrow');


    setMenuForAnim($primary, $btn);


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
      'borderRadius': '0px',
      'marginLeft': '-40px',
      'paddingLeft': '80px'
    });

    TweenLite.to($label[0], animTime, {
      'marginLeft': '-120px'
    });

    TweenLite.to($arrow[0], animTime, {
      'fontSize': '0.9em',
      'rotation': 90,
      'width': '5em'
    });

    $btn.find('.arrow')
      .removeClass('fa-angle-right')
      .addClass('fa-times');

    isMenuOpen($primary);

    TweenLite.to($primary[0], animTime, {
      'paddingTop': buttonHeight + 'px'
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
      _.forEach(menuVM.buttons, function ($b, k) {
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
