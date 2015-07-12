define(
[
  'jquery',
  'lodash',
  'core/utils'
],
function ($, _, utils) {
  'use strict';

  function ScoreMenuPrimaryItem (menuType) {
    this.menuType = menuType;

    this.$btn = $(this.selectorPrefix + menuType);

    if (!this.$btn.length) {
      throw new Error('Cannot find the button for menuType ' + menuType);
    }

    this.$item = this.$btn.parents('.menu-item');

    this.$labelWrap = this.$btn.find('.label-wrapper');

    this.$arrow = this.$btn.find('.arrow');

    this.$secondary = this.$item.find('.secondary');

    this.$menuWrap = this.$secondary.find('.menu-wrap');
  }

  ScoreMenuPrimaryItem.prototype = {
    'constructor': ScoreMenuPrimaryItem,

    $arrow: null,

    $btn: null,

    $item: null,

    $labelWrap: null,

    $menuWrap: null,

    $secondary: null,

    arrowTween: null,

    btnTween: null,

    itemTween: null,

    labelWrapTween: null,

    menuWrapTween: null,

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
        'height': '44px',
        'marginLeft': '0px',
        'paddingLeft': '0px'
      });

      this.labelWrapTween = TweenLite.to(this.$labelWrap[0], time, {
        'marginLeft': '0px',
        'scaleX': 1,
        'scaleY': 1
      });

      this.arrowTween = TweenLite.to(this.$arrow[0], time, {
        'fontSize': '1em',
        'rotation': 0
      });

      this.$arrow.removeClass('fa-times')
        .addClass('fa-angle-right');

      var w = this.$secondary.outerWidth() - this.$menuWrap.cssNumber('paddingLeft') -
        this.$menuWrap.cssNumber('paddingRight') - 2;

      this.$menuWrap.width(w);

      this.menuWrapTween = TweenLite.to(this.$menuWrap[0], time, {
        'marginLeft': '-41px',
        'marginRight': '-41px'
      });

      this.secondaryTargetHeight = 0;

      this.secondaryTween = TweenLite.to(this.$secondary[0], time, {
        'height': this.secondaryTargetHeight + 'px',
        'marginLeft': '0px',
        'marginRight': '0px'
      });

      TweenLite.delayedCall(time, function () {
        self.$item.removeClass('animating');
        self.$secondary.css('height', 'auto');
        self.$menuWrap.css('width', 'auto');
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
      this.labelWrapTween.kill();
      this.arrowTween.kill();
      this.secondaryTween.kill();
      this.menuWrapTween.kill();

      this.$item.removeClass('animating');
      this.$secondary.css('height', 'auto');
      this.$menuWrap.css('width', 'auto');
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
        'height': '88px',
        'marginLeft': '-41px',
        'paddingLeft': '80px'
      });

      this.labelWrapTween = TweenLite.to(this.$labelWrap[0], time, {
        'marginLeft': '-65px',
        'scaleX': 1.2,
        'scaleY': 1.2
      });

      this.arrowTween = TweenLite.to(this.$arrow[0], time, {
        'fontSize': '1.15em',
        'rotation': 90
      });

      this.$arrow.removeClass('fa-angle-right')
        .addClass('fa-times');

      this.$secondary.css({
        'marginLeft': '-41px',
        'marginRight': '-41px'
      });
      var w = this.$secondary.outerWidth() - this.$menuWrap.cssNumber('paddingLeft') -
        this.$menuWrap.cssNumber('paddingRight') - 2;

      this.$secondary.css({
        'marginLeft': '0px',
        'marginRight': '0px'
      });
      this.$menuWrap.width(w);

      this.menuWrapTween = TweenLite.to(this.$menuWrap[0], time, {
        'marginLeft': '0px',
        'marginRight': '0px'
      });

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
        self.$menuWrap.css('width', 'auto');
      });
    }
  };

  return ScoreMenuPrimaryItem;
});
