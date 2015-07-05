define(
[
  'jquery',
  'lodash',
  'knockout',
  'greensock/gsap',
  'view-model'
],
function ($, _, ko, TweenLite, ViewModel) {
  'use strict';

  var MENU_TYPES = {
    KILLS: 'kills',
    STARS: 'stars',
    WEAPONS: 'weapons',
    VEHICLES: 'vehicles',
    LOCATIONS: 'locations'
  };

  var BUTTON_HEIGHT = 56;

  var ANIM_TIME = 0.35;


  function ScoreMenu (targetNodeId) {
    ViewModel.call(this, targetNodeId);

    this.open = {};

    this.buttons = {};

    var self = this;
    _.forEach(MENU_TYPES, function (type) {
      // create an '{btn-type}Open' callback for the menu button click event:
      self[type + 'Open'] = function () {
        self.toggleMenu(type);
      };

      // add these by key to the 'open' object:
      self.open[type] = false;

      // store the jQuery button object by key on 'buttons':
      self.buttons[type] = $('#menu-btn-' + type);
    });

    this.generateViewModel();
  }

  ScoreMenu.prototype = _.create(ViewModel.prototype, {
    'constructor': ScoreMenu,


    closeMenu: function (menuType) {
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

      this.setMenuForAnim($primary, $btn);

      $item.removeClass('open');

      this.open[menuType] = false;

      var t = $item.position().top - BUTTON_HEIGHT;

      $item.addClass('animating');

      TweenLite.to($item[0], ANIM_TIME, {
        'top': t,
        onComplete: function () {
          $item.removeClass('animating');
        }
      });

      TweenLite.to($btn[0], ANIM_TIME, {
        'borderRadius': '4px',
        'marginLeft': '0px',
        'paddingLeft': '0px'
      });

      TweenLite.to($label[0], ANIM_TIME, {
        'marginLeft': '0px'
      });

      TweenLite.to($arrow[0], ANIM_TIME, {
        'fontSize': '1.2em',
        'rotation': 0,
        'width': '2em'
      });

      $btn.find('.arrow')
        .removeClass('fa-times')
        .addClass('fa-angle-right');

      var open = this.isMenuOpen($primary);

      if (!open) {
        TweenLite.to($primary[0], ANIM_TIME, {
          'paddingTop': '0px'
        });
      }
      else {
        console.log('TODO: find any menu items above the item and push them up BUTTON_HEIGHT');
      }
    },

    isMenuOpen: function (p) {
      var open = false;

      _.forEach(this.open, function (v, k) {
        if (open) {
          return;
        }

        open = v;
      });

      if (open) {
        p.addClass('open');
      }
      else {
        p.removeClass('open');
      }

      return open;
    },

    openMenu: function (menuType) {
      console.log('open menu', menuType);

      var $btn = $('#menu-btn-' + menuType);

      if (!$btn.length) {
        throw new Error('toggleMenu cannot find the button for menuType ' + menuType);
      }

      var $item = $btn.parents('.menu-item');

      var $primary = $item.parents('.primary');

      var $label = $btn.find('.label-wrapper');

      var $arrow = $btn.find('.arrow');

      this.setMenuForAnim($primary, $btn);

      $item.css('top', $item.position().top);

      $item.addClass('open animating');

      this.open[menuType] = true;

      TweenLite.to($item[0], ANIM_TIME, {
        'top': 0,
        onComplete: function () {
          $item.removeClass('animating');
        }
      });

      TweenLite.to($btn[0], ANIM_TIME, {
        'borderRadius': '0px',
        'marginLeft': '-40px',
        'paddingLeft': '80px'
      });

      TweenLite.to($label[0], ANIM_TIME, {
        'marginLeft': '-120px'
      });

      TweenLite.to($arrow[0], ANIM_TIME, {
        'fontSize': '0.9em',
        'rotation': 90,
        'width': '5em'
      });

      $btn.find('.arrow')
        .removeClass('fa-angle-right')
        .addClass('fa-times');

      this.isMenuOpen($primary);

      TweenLite.to($primary[0], ANIM_TIME, {
        'paddingTop': BUTTON_HEIGHT + 'px'
      });
    },

    setMenuForAnim: function ($primary, $btn) {
      $primary.css('height', $primary.outerHeight());

      TweenLite.to($primary[0], ANIM_TIME, {
        onComplete: function () {
          $primary.css('height', 'auto');
        }
      });

      var after = false;
      var set = [];
      _.forEach(this.buttons, function ($b, k) {
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

        TweenLite.to($i[0], ANIM_TIME, {
          onComplete: function () {
            $i.removeClass('animating');
          }
        });
      });
    },

    toggleMenu: function (menuType) {
      var $btn = $('#menu-btn-' + menuType);

      if (!$btn.length) {
        throw new Error('toggleMenu cannot find the button for menuType ' + menuType);
      }

      var $item = $btn.parents('.menu-item');

      var open = $item.hasClass('open');

      if (!open) {
        // close all others:
        _.forEach(this.buttons, function ($b, k) {
          if (k == menuType) {
            return;
          }

          this.closeMenu(k);
        }, this);

        this.openMenu(menuType);
      }
      else {
        this.closeMenu(menuType);
      }
    }
  });

  return ScoreMenu;
});
