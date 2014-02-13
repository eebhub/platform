angular.module('modal', ['ui.bootstrap']);
var ModalWorkflow = function ($scope, $modal, $log) {

  $scope.open = function () {

    var modalInstance = $modal.open({
      templateUrl: 'ModalWorkflow.html',
      controller: ModalInstanceCtrl,
    });
  };
};

var ModalIntegration = function ($scope, $modal, $log) {

  $scope.open = function () {

    var modalInstance = $modal.open({
      templateUrl: 'ModalIntegration.html',
      controller: ModalInstanceCtrl,
    });
  };
};

var ModalInstanceCtrl = function ($scope, $modalInstance) {

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};