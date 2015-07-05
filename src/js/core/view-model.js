define(
[
  'jquery',
  'knockout'
],
function ($, ko) {
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

  return ViewModel;
});
