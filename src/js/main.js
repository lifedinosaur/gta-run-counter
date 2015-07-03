require.config(
{
    baseUrl: 'assets/js/',
    paths:
    {
      bootstrap: 'lib/bootstrap/',
      jquery: 'lib/jquery',
      knockout: 'lib/knockout',
      lodash: 'lib/lodash'
    }
});

define(
[
  'jquery',
  'lodash',
  'knockout'
],
function ($, _, ko) {
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
    var $btn = $('#menu-btn-' + menuType).parents('.menu-item');

    if (!$btn.length) {
      throw new Error('openMenu cannot find the menu-item for menuType ' + menuType);
    }

    $btn.toggleClass('open');

    var open = $btn.hasClass('open');

    if (open) {
      $btn.find('.arrow')
        .removeClass('fa-angle-right')
        .addClass('fa-times');
    }
    else {
      $btn.find('.arrow')
        .removeClass('fa-times')
        .addClass('fa-angle-right');
    }

    menuVM[menuType + 'IsOpen'](open);
  }

  menuVM.generateViewModel();
});
