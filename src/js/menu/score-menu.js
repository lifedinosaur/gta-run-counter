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
    GROUPS: [{
      TITLE: 'Civilians',
      ICON: 'icon-el-adult',
      ID: 'civ'
    }, {
      TITLE: 'Cops',
      ICON: 'icon-police',
      ID: 'cop'
    }, {
      TITLE: 'Animals',
      ICON: 'fi-guide-dog',
      ID: 'civ'
    }],
    BUTTONS: [{
      TITLE: 'Melee',
      ICON: 'icon-baseball',
      ID: 'melee'
    }, {
      TITLE: 'Firearm',
      ICON: 'fi-target-two',
      ID: 'firearm'
    }, {
      TITLE: 'Explosion',
      ICON: 'icon-fire-station',
      ID: 'explosion'
    }, {
      TITLE: 'Vehicle',
      ICON: 'fa fa-truck',
      ID: 'vehicle'
    }]
  };

  var WEAPONS_MENU = {
    GROUP_PREFIX: 'weapons-menu-group',
    BUTTON_PREFIX: 'weapons-btn',
    BUTTONS: [{
      TITLE: 'Melee',
      ICON: 'icon-baseball',
      ICON_TYPE: 'single',
      ID: 'melee'
    }, {
      TITLE: 'Firearm (S)',
      ICON: ['fi-target-two', 'S'],
      ICON_TYPE: 'double',
      ID: 'firearm-s'
    }, {
      TITLE: 'Firearm (M)',
      ICON: ['fi-target-two', 'M'],
      ICON_TYPE: 'double',
      ID: 'firearm-m'
    }, {
      TITLE: 'Firearm (L)',
      ICON: ['fi-target-two', 'L'],
      ICON_TYPE: 'double',
      ID: 'firearm-l'
    }, {
      TITLE: 'Firearm (XL)',
      ICON: ['fi-target-two', 'XL'],
      ICON_TYPE: 'double',
      ID: 'firearm-xl'
    }, {
      TITLE: 'Explosion',
      ICON: 'icon-fire-station',
      ICON_TYPE: 'single',
      ID: 'explosion'
    }]
  };

  var VEHICLES_MENU = {
    GROUP_PREFIX: 'vehicles-menu-group',
    BUTTON_PREFIX: 'vehicles-btn',
    BUTTONS: [{
      TITLE: 'Car',
      ICON: 'fa fa-car',
      ID: 'car'
    }, {
      TITLE: 'Truck',
      ICON: 'fa fa-truck',
      ID: 'truck'
    }, {
      TITLE: 'Bike',
      ICON: 'fa fa-motorcycle',
      ID: 'bike'
    }, {
      TITLE: 'Sea',
      ICON: 'fa fa-ship',
      ID: 'sea'
    }, {
      TITLE: 'Air',
      ICON: 'fa fa-plane',
      ID: 'air'
    }, {
      TITLE: 'Emergency',
      ICON: 'fa fa-ambulance',
      ID: 'emergency'
    }]
  };

  var LOCATIONS_MENU = {
    GROUP_PREFIX: 'locations-menu-group',
    BUTTON_PREFIX: 'locations-btn',
    BUTTONS: [{
      TITLE: 'Hood',
      ICON: 'fa fa-home',
      ID: 'hood'
    }, {
      TITLE: 'City',
      ICON: 'fa fa-building',
      ID: 'city'
    }, {
      TITLE: 'Beach',
      ICON: 'glyphicon glyphicon-sunglasses',
      ID: 'beach'
    }, {
      TITLE: 'Mountains',
      ICON: 'fi-mountains',
      ID: 'mountains'
    }, {
      TITLE: 'Forest',
      ICON: 'fa fa-tree',
      ID: 'forest'
    }, {
      TITLE: 'Desert',
      ICON: 'fa fa-sun-o',
      ID: 'desert'
    }]
  };

  var BUTTON_HEIGHT = 56;
  var BUTTON_OPEN_HEIGHT = 100;

  var ANIM_TIME = 0.35;

  var MENU_OFFSET = 14;


  function ScoreMenu(targetNodeId) {
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


      // stars menu:
      this.starsMenu = {};


      // weapons menu:
      this.weaponsMenu = {
        buttons: _.map(WEAPONS_MENU.BUTTONS, function (b) {
          return {
            title: b.TITLE,
            icon: b.ICON,
            iconType: b.ICON_TYPE,
            id: b.ID,
            idPrefix: WEAPONS_MENU.BUTTON_PREFIX + '-'
          };
        }),

        favoriteData: {
          favorite: ko.observable('Melee')
        }
      };


      // vehicles menu:
      this.vehiclesMenu = {
        buttons: _.map(VEHICLES_MENU.BUTTONS, function (b) {
          return {
            title: b.TITLE,
            icon: b.ICON,
            id: b.ID,
            idPrefix: VEHICLES_MENU.BUTTON_PREFIX + '-'
          };
        }),

        favoriteData: {
          favorite: ko.observable('Car')
        }
      };

      // locations menu:
      this.locationsMenu = {
        buttons: _.map(LOCATIONS_MENU.BUTTONS, function (b) {
          return {
            title: b.TITLE,
            icon: b.ICON,
            id: b.ID,
            idPrefix: LOCATIONS_MENU.BUTTON_PREFIX + '-'
          };
        }),

        favoriteData: {
          favorite: ko.observable('Desert')
        }
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
