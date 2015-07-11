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

    arrowTween: null,

    btnTween: null,

    itemTween: null,

    labelTween: null,

    secondaryTween: null,

    menuType: undefined,

    selectorPrefix: '#menu-btn-',

    secondaryTargetHeight: 0,

    targetNodeId: undefined,

    closeItem: function (time, btnHeight) {
      if (this.isAnimating()) {
        return;
      }

      var self = this;

      this.$item.removeClass('open');

      var t = this.$item.position().top - btnHeight;

      this.$item.addClass('animating');

      this.itemTween = TweenLite.to(this.$item[0], time, {
        'top': t
      });

      this.btnTween = TweenLite.to(this.$btn[0], time, {
        'borderRadius': '4px',
        'marginLeft': '0px',
        'paddingLeft': '0px'
      });

      this.labelTween = TweenLite.to(this.$label[0], time, {
        'marginLeft': '0px'
      });

      this.arrowTween = TweenLite.to(this.$arrow[0], time, {
        'fontSize': '1.2em',
        'rotation': 0,
        'width': '2em'
      });

      this.$arrow.removeClass('fa-times')
        .addClass('fa-angle-right');

      this.secondaryTargetHeight = 0;

      this.secondaryTween = TweenLite.to(this.$secondary[0], time, {
        'height': this.secondaryTargetHeight + 'px',
        'marginLeft': '0px',
        'marginRight': '0px'
      });

      TweenLite.delayedCall(time, function () {
        self.$item.removeClass('animating');
        self.$secondary.css('height', 'auto');
      });
    },

    fixPosition: function (time) {
      var self = this;
      var it = this.$item.position().top;

      this.$item.css('top', it + 'px');
      this.$item.addClass('fixing');

      TweenLite.delayedCall(time, function () {
        self.$item.removeClass('fixing');
      });
    },

    killAnims: function () {
      if (!this.isAnimating()) {
        return;
      }

      this.itemTween.kill();
      this.btnTween.kill();
      this.labelTween.kill();
      this.arrowTween.kill();
      this.secondaryTween.kill();

      this.$item.removeClass('animating');
      this.$secondary.css('height', 'auto');
    },

    isAnimating: function () {
      return this.$item.hasClass('animating');
    },

    isOpen: function () {
      return this.$item.hasClass('open');
    },

    openItem: function (time) {
      if (this.isAnimating()) {
        return;
      }

      var self = this;

      this.$item.css('top', this.$item.position().top);

      this.$item.addClass('open animating');

      this.itemTween = TweenLite.to(this.$item[0], time, {
        'top': 0
      });

      this.btnTween = TweenLite.to(this.$btn[0], time, {
        'borderRadius': '0px',
        'marginLeft': '-41px',
        'paddingLeft': '80px'
      });

      this.labelTween = TweenLite.to(this.$label[0], time, {
        'marginLeft': '-70px'
      });

      this.arrowTween = TweenLite.to(this.$arrow[0], time, {
        'fontSize': '0.9em',
        'rotation': 90,
        'width': '4em'
      });

      this.$arrow.removeClass('fa-angle-right')
        .addClass('fa-times');

      this.$secondary.css('height', 'auto');
      this.secondaryTargetHeight = this.$secondary.outerHeight();
      this.$secondary.css('height', '0px');

      this.secondaryTween = TweenLite.to(this.$secondary[0], time, {
        'height': this.secondaryTargetHeight + 'px',
        'marginLeft': '-41px',
        'marginRight': '-41px'
      });

      TweenLite.delayedCall(time, function () {
        self.$item.removeClass('animating');
        self.$secondary.css('height', 'auto');
      });
    }
  };

  return ScoreMenuPrimaryItem;
});
