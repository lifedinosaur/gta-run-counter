define(
[
  'jquery',
  'lodash',
  'knockout',
  'greensock/gsap',
  'core/view-model',
  'menu/score-menu-primary-item'
],
function ($, _, ko, TweenLite, ViewModel, ScoreMenuPrimaryItem) {
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

  var MENU_OFFSET = 14;


  function ScoreMenu (targetNodeId) {
    ViewModel.call(this, targetNodeId);

    this.$element = $(targetNodeId);

    this.$primary = this.$element.find('.primary');

    this.open = {};

    this.buttons = {};

    var self = this;
    _.forEach(MENU_TYPES, function (type) {
      // add flags by key to the 'open' object:
      self.open[type] = false;

      // store the menu item object by key on 'buttons':
      self.buttons[type] = new ScoreMenuPrimaryItem(type);
    });

    this.generateViewModel();
  }

  ScoreMenu.prototype = _.create(ViewModel.prototype, {
    'constructor': ScoreMenu,

    $element: null,

    $primary: null,

    primaryTween: null,

    closeAllMenus: function (exceptType) {
      _.forEach(this.buttons, function ($btn, key) {
        if (key == exceptType) {
          return;
        }

        this.closeMenu(key);
      }, this);
    },

    closeMenu: function (menuType) {
      if (this.isAnimating()) {
        return;
      }

      var self = this;
      var item = this.buttons[menuType];

      if (!item.isOpen()) {
        return;
      }

      this.$primary.addClass('animating');

      this.setMenuForAnim(item);

      item.closeItem(ANIM_TIME, BUTTON_HEIGHT);

      this.open[menuType] = false;

      this.setMenuOpen();

      this.primaryTween = TweenLite.to(this.$primary[0], ANIM_TIME, {
        'paddingTop': MENU_OFFSET + 'px',
        onComplete: function () {
          self.$primary.removeClass('animating');
        }
      });
    },

    fixMenuHeight: function (time) {
      var self = this;

      this.$primary.css('height', this.$primary.outerHeight());

      TweenLite.to(this.$primary[0], time, {
        onComplete: function () {
          self.$primary.css('height', 'auto');
        }
      });
    },

    isAnimating: function () {
      return this.$primary.hasClass('animating');
    },

    isOpen: function () {
      return this.$primary.hasClass('open');
    },

    killAnims: function () {
      if (!this.isAnimating()) {
        return;
      }

      this.primaryTween.kill();

      this.$primary.removeClass('animating');
      this.$primary.css('height', 'auto');
    },

    openMenu: function (menuType) {
      if (this.isAnimating()) {
        return;
      }

      var self = this;
      var item = this.buttons[menuType];

      this.$primary.addClass('animating');

      this.setMenuForAnim(item);

      item.openItem(ANIM_TIME);

      this.open[menuType] = true;

      this.setMenuOpen();

      this.primaryTween = TweenLite.to(this.$primary[0], ANIM_TIME, {
        'paddingTop': (BUTTON_HEIGHT + MENU_OFFSET) + 'px',
        onComplete: function () {
          self.$primary.removeClass('animating');
        }
      });
    },

    setMenuForAnim: function (item) {
      this.fixMenuHeight(ANIM_TIME);

      var after = false;
      var set = [];

      _.forEach(this.buttons, function (btn, k) {
        if (btn.menuType == item.menuType) {
          after = true;
          return;
        }

        if (!after) {
          return;
        }

        set.unshift(btn);
      });

      _.forEach(set, function (btn, idx) {
        btn.fixPosition(ANIM_TIME);
      });
    },

    setMenuOpen: function () {
      var open = false;

      _.forEach(this.open, function (v, k) {
        if (open) {
          return;
        }

        open = v;
      });

      if (open) {
        this.$primary.addClass('open');
      }
      else {
        this.$primary.removeClass('open');
      }

      return open;
    },

    toggleMenu: function (menuType) {
      var open = this.buttons[menuType].isOpen();

      if (!open && !this.isOpen()) {
        this.closeAllMenus(menuType);

        this.openMenu(menuType);
      }
      else {
        this.closeMenu(menuType);
      }
    }
  });

  return ScoreMenu;
});
