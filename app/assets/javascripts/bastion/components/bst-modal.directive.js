/**
 * Copyright 2014 Red Hat, Inc.
 *
 * This software is licensed to you under the GNU General Public
 * License as published by the Free Software Foundation; either version
 * 2 of the License (GPLv2) or (at your option) any later version.
 * There is NO WARRANTY for this software, express or implied,
 * including the implied warranties of MERCHANTABILITY,
 * NON-INFRINGEMENT, or FITNESS FOR A PARTICULAR PURPOSE. You should
 * have received a copy of GPLv2 along with this software; if not, see
 * http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt.
 */

/**
 * @ngdoc directive
 * @name Bastion.components.directive:bstModal
 * @restrict A
 *
 * @requires $templateCache
 * @requires $modal
 *
 * @description
 *   Provides a wrapper around angular-ui's modal dialog service.
 */
angular.module('Bastion.components').directive('bstModal',
    ['$templateCache', '$modal', function ($templateCache, $modal) {
    return {
        // To be expanded when we add additional type of modals
        templateUrl: 'components/views/bst-modal.html',
        replace: true,
        scope: {
            action: '&bstModal',
            modelName: '@model',
            model: '=',
            modalHeader: '@',
            modalBody: '@',
            modalConfirm: '@'
        },
        compile: function (element) {
            return function (scope) {
                var modalInstance, modalController, modalId;

                modalId = 'bstModal%d.html'.replace('%d', Math.random().toString());

                modalController = ['$scope', '$modalInstance', 'model', function ($scope, $modalInstance, model) {
                    $scope[scope.modelName] = model;
                    $scope.modalHeader = scope.modalHeader;
                    $scope.modalBody = scope.modalBody;
                    $scope.modalConfirm = scope.modalConfirm;

                    $scope.ok = function () {
                        $modalInstance.close();
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }];

                scope.openModal = function () {
                    modalInstance = $modal.open({
                        templateUrl: modalId,
                        controller: modalController,
                        resolve: {
                            model: function () {
                                return scope[scope.modelName];
                            }
                        }
                    });

                    modalInstance.result.then(function () {
                        scope.action();
                    });
                };

                scope.$parent.openModal = scope.openModal;

                $templateCache.put(modalId, element.html());
            };
        }
    };
}]);
