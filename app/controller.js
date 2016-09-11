'use strict'

class MainCtrl {
  constructor ($scope, dataService) {
    dataService.get().success((data) => {
      $scope.data = data
    })

    $scope.submit = function (node) {
      dataService.put(node).success((data) => {
        $scope.data = data
        $scope.$broadcast('putD3', data);
      })
    }
  }
}

export { MainCtrl }
