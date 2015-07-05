define(
[
  'jquery',
  'lodash'
],
function ($, _) {
  'use strict';

  function ScoreMenuPrimaryItem (menuType) {
    this.menuType = menuType;

    this.$btn = $(this.selectorPrefix + menuType);

    if (!this.$btn.length) {
      throw new Error('Cannot find the button for menuType ' + menuType);
    }

    this.$item = this.$btn.parents('.menu-item');

    this.$label = this.$btn.find('.label-wrapper');

    this.$arrow = this.$btn.find('.arrow');

    this.$secondary = this.$item.find('.secondary');
  }

  ScoreMenuPrimaryItem.prototype = {
    'constructor': ScoreMenuPrimaryItem,

    $arrow: null,

    $btn: null,

    $item: null,

    $label: null,

    $secondary: null,

    menuType: undefined,

    selectorPrefix: '#menu-btn-',

    targetNodeId: undefined,

    closeItem: function (time, btnHeight) {
      var self = this;
      this.$item.removeClass('open');

      var t = this.$item.position().top - btnHeight;

      this.$item.addClass('animating');

      TweenLite.to(this.$item[0], time, {
        'top': t,
        onComplete: function () {
          self.$item.removeClass('animating');
        }
      });

      TweenLite.to(this.$btn[0], time, {
        'borderRadius': '4px',
        'marginLeft': '0px',
        'paddingLeft': '0px'
      });

      TweenLite.to(this.$label[0], time, {
        'marginLeft': '0px'
      });

      TweenLite.to(this.$arrow[0], time, {
        'fontSize': '1.2em',
        'rotation': 0,
        'width': '2em'
      });

      this.$arrow.removeClass('fa-times')
        .addClass('fa-angle-right');

      TweenLite.to(this.$secondary[0], time, {
        'height': '0px',
        'marginLeft': '0px',
        'marginRight': '0px'
      });
    },

    fixPosition: function (time) {
      var self = this;
      var it = this.$item.position().top;

      this.$item.css('top', it + 'px');
      this.$item.addClass('fixing');

      TweenLite.to(this.$item[0], time, {
        onComplete: function () {
          self.$item.removeClass('fixing');
        }
      });
    },

    isOpen: function () {
      return this.$item.hasClass('open');
    },

    openItem: function (time) {
      var self = this;

      this.$item.css('top', this.$item.position().top);

      this.$item.addClass('open animating');

      TweenLite.to(this.$item[0], time, {
        'top': 0,
        onComplete: function () {
          self.$item.removeClass('animating');
        }
      });

      TweenLite.to(this.$btn[0], time, {
        'borderRadius': '0px',
        'marginLeft': '-40px',
        'paddingLeft': '80px'
      });

      TweenLite.to(this.$label[0], time, {
        'marginLeft': '-120px'
      });

      TweenLite.to(this.$arrow[0], time, {
        'fontSize': '0.9em',
        'rotation': 90,
        'width': '5em'
      });

      this.$arrow.removeClass('fa-angle-right')
        .addClass('fa-times');

      this.$secondary.css('height', 'auto');
      var h = this.$secondary.outerHeight();
      this.$secondary.css('height', '0px');

      TweenLite.to(this.$secondary[0], time, {
        'height': h,
        'marginLeft': '-40px',
        'marginRight': '-40px',
        onComplete: function () {
          self.$secondary.css('height', 'auto');
        }
      });
    }
  };

  return ScoreMenuPrimaryItem;
});
