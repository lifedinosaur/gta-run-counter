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

  var KILLS_MENU = {
    GROUP_PREFIX: 'kills-menu-group',
    BUTTON_PREFIX: 'kills-btn',
    GROUPS: [
      {
        TITLE: 'Civilians',
        ICON: 'icon-el-adult',
        ID: 'civ'
      },
      {
        TITLE: 'Cops',
        ICON: 'icon-police',
        ID: 'cop'
      },
      {
        TITLE: 'Animals',
        ICON: 'fi-guide-dog',
        ID: 'civ'
      }
    ],
    BUTTONS: [
      {
        TITLE: 'Melee',
        ICON: 'icon-baseball',
        ID: 'melee'
      },
      {
        TITLE: 'Firearm',
        ICON: 'icon-el-target',
        ID: 'firearm'
      },
      {
        TITLE: 'Explosion',
        ICON: 'icon-fire-station',
        ID: 'explosion'
      },
      {
        TITLE: 'Vehicle',
        ICON: 'icon-bus',
        ID: 'vehicle'
      }
    ]
  };

  var BUTTON_HEIGHT = 56;
  var BUTTON_OPEN_HEIGHT = 100;

  var ANIM_TIME = 0.35;

  var MENU_OFFSET = 14;


  function ScoreMenu (targetNodeId) {
    ViewModel.call(this, targetNodeId);

    this.$element = $(targetNodeId);

    this.$primary = this.$element.find('.primary');

    this.populateViewModel();

    this.generateViewModel();

    var self = this;
    $(document).on('resize.counter', function () {
      self.fixMenuHeight();
    });
  }

  ScoreMenu.prototype = _.create(ViewModel.prototype, {
    'constructor': ScoreMenu,

    $element: null,

    $primary: null,

    buttons: {},

    open: {},

    openType: undefined,

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

      var ch = this.$primary.outerHeight();
      this.$primary.css('height', 'auto');
      var h = this.$primary.outerHeight();
      this.$primary.css('height', ch);

      var self = this;
      var item = this.buttons[menuType];

      if (!item.isOpen()) {
        return;
      }

      this.$primary.addClass('animating');

      this.setMenuForAnim(item);

      item.closeItem(ANIM_TIME, BUTTON_HEIGHT);

      this.open[menuType] = false;
      this.openType = undefined;

      this.setMenuOpen();

      var th = item.secondaryTargetHeight + BUTTON_HEIGHT;
      h = (h < th) ? th : h;

      this.primaryTween = TweenLite.to(this.$primary[0], ANIM_TIME, {
        'height': h,
        'paddingTop': MENU_OFFSET + 'px',
        onComplete: function () {
          self.$primary.removeClass('animating');
          self.$primary.css('height', 'auto');
        }
      });
    },

    fixMenuHeight: function () {
      if (!this.isOpen()) {
        return;
      }

      var item = this.buttons[this.openType];

      var h = this.$primary.outerHeight();

      var th = item.$secondary.height() + BUTTON_OPEN_HEIGHT;
      h = (h < th) ? th : h;

      this.$primary.css('height', h);
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

      var ch = this.$primary.outerHeight();
      this.$primary.css('height', 'auto');
      var h = this.$primary.outerHeight();
      this.$primary.css('height', ch);

      var self = this;
      var item = this.buttons[menuType];

      this.$primary.addClass('animating');

      this.setMenuForAnim(item);

      this.open[menuType] = true;
      this.openType = menuType;

      item.openItem(ANIM_TIME);

      this.setMenuOpen();

      var th = item.secondaryTargetHeight + BUTTON_OPEN_HEIGHT;
      h = (h < th) ? th : h;

      this.primaryTween = TweenLite.to(this.$primary[0], ANIM_TIME, {
        'height': h,
        'paddingTop': (BUTTON_HEIGHT + MENU_OFFSET) + 'px',
        onComplete: function () {
          self.$primary.removeClass('animating');
        }
      });
    },

    populateViewModel: function () {
      var self = this;

      // menu buttons:
      _.forEach(MENU_TYPES, function (type) {
        // add flags by key to the 'open' object:
        self.open[type] = false;

        // store the menu item object by key on 'buttons':
        self.buttons[type] = new ScoreMenuPrimaryItem(type);
      });


      // kills menu:
      this.killsMenu = {
        groups: _.map(KILLS_MENU.GROUPS, function (g) {
          return {
            title: g.TITLE,
            icon: g.ICON,
            id: g.ID,
            groupId: KILLS_MENU.GROUP_PREFIX + '-' + g.ID
          };
        }),

        buttons: _.map(KILLS_MENU.BUTTONS, function (b) {
          return {
            title: b.TITLE,
            icon: b.ICON,
            id: '-' + b.ID,
            idPrefix: KILLS_MENU.BUTTON_PREFIX + '-'
          };
        })
      };
    },

    setMenuForAnim: function (item) {
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
