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
 * @name Bastion.components.directive:bstEdit
 * @restrict A
 *
 * @description
 *   Provides a set of inline editable elements for various form elements. The
 *   bst-edit directive is the base for all input types to take advantage of
 *   and should never be used directly. The current list of supported types are:
 *
 *   - input (bst-edit-text)
 *   - textarea (bst-edit-textarea)
 *
 * @example
 */
angular.module('Bastion.components')
    .directive('bstEdit', function () {
        return {
            replace: true,
            controller: 'BstEditController',
            templateUrl: 'components/views/bst-edit.html'
        };
    })
    .controller('BstEditController', ['$scope', '$filter', function ($scope, $filter) {
        var previousValue;

        function handleAction(action) {
            $scope.editMode = false;
            $scope.workingMode = true;

            if (angular.isDefined(action) && action.hasOwnProperty('then')) {
                action.then(
                    function () {
                        $scope.updateDisplay($scope.model);
                        $scope.workingMode = false;
                    },
                    function () {
                        $scope.workingMode = false;
                        $scope.editMode = true;
                    }
                );

            } else {
                $scope.workingMode = false;
            }
        }

        $scope.edit = function () {
            var options;

            if ($scope.readonly !== true) {
                $scope.editMode = true;
                previousValue = $scope.model;

                if (angular.isDefined($scope.handleOptions)) {
                    options = $scope.handleOptions();
                }

                if (angular.isDefined(options)) {
                    if (options.hasOwnProperty('then')) {
                        $scope.workingMode = true;
                        $scope.editMode = false;
                        options.then(function (data) {
                            $scope.options = data;
                            $scope.workingMode = false;
                            $scope.editMode = true;

                            if ($scope.options.length === 0) {
                                $scope.disableSave = true;
                            }
                        });
                    } else {
                        $scope.options = options;

                        if ($scope.options.length === 0) {
                            $scope.disableSave = true;
                        }
                    }

                }
            }
        };

        $scope.save = function () {
            var action = $scope.handleSave({ value: $scope.model });

            if ($scope.editTrigger) {
                $scope.editTrigger = false;
            }

            handleAction(action);
        };

        $scope.add = function () {
            var action = $scope.handleAdd({ value: $scope.model });
            handleAction(action);
        };

        $scope.remove = function () {
            var action = $scope.handleRemove({ value: $scope.model });
            handleAction(action);
        };

        $scope.cancel = function () {
            $scope.editMode = false;
            $scope.disableSave = false;
            $scope.model = previousValue;
            $scope.handleCancel({ value: $scope.model });
        };

        $scope.delete = function ($event) {
            var handleDelete;

            // Need to prevent click $event from propagating to edit handler
            $event.stopPropagation();

            $scope.editMode = false;
            $scope.workingMode = true;

            handleDelete = $scope.handleDelete({ value: $scope.model });

            if (angular.isDefined(handleDelete) && handleDelete.hasOwnProperty('then')) {

                handleDelete.then(
                    function () {
                        $scope.updateDisplay($scope.model);
                        $scope.workingMode = false;
                    },
                    function () {
                        $scope.workingMode = false;
                        $scope.editMode = true;
                    }
                );
            } else {
                $scope.workingMode = false;
            }
        };

        $scope.$watch('editTrigger', function (edit) {
            if (edit) {
                $scope.edit();
            }
        });

        $scope.updateDisplay = function (newValue) {
            if ($scope.formatter) {
                $scope.displayValue = $filter($scope.formatter)(newValue, $scope.formatterOptions);
            } else {
                $scope.displayValue = $scope.model;
            }
            if ($scope.displayValue && $scope.displayValueDefault) {
                $scope.displayValue = $scope.displayValueDefault;
            }
        };

        // Watch the model and displayed values for changes
        // and update the displayed value accordingly.
        $scope.$watch('model + displayValue', function (newValue) {
            if (angular.isDefined(newValue)) {
                $scope.updateDisplay($scope.model);
            }
        });

        // Watch forcedWorkingMode and update the working mode
        // accordingly.  This allows a user to set working mode.
        $scope.$watch('forcedWorkingMode', function (newValue) {
            $scope.workingMode = newValue;
        });
    }])
    .directive('bstEditText', function () {
        return {
            replace: true,
            scope: {
                model: '=bstEditText',
                readonly: '=',
                handleSave: '&onSave',
                handleCancel: '&onCancel',
                deletable: '@deletable',
                handleDelete: '&onDelete'
            },
            templateUrl: 'components/views/bst-edit-text.html'
        };
    })
    .directive('bstEditTextarea', function () {
        return {
            replace: true,
            scope: {
                model: '=bstEditTextarea',
                readonly: '=',
                handleSave: '&onSave',
                handleCancel: '&onCancel'
            },
            templateUrl: 'components/views/bst-edit-textarea.html'
        };
    })
    .directive('bstEditCheckbox', function () {
        return {
            replace: true,
            scope: {
                model: '=bstEditCheckbox',
                readonly: '=',
                handleSave: '&onSave',
                handleCancel: '&onCancel',
                formatter: '@formatter',
                formatterOptions: '=formatterOptions'
            },
            templateUrl: 'components/views/bst-edit-checkbox.html'
        };
    })
    .directive('bstEditCustom', function () {
        return {
            replace: true,
            transclude: true,
            templateUrl: 'components/views/bst-edit-custom.html',
            scope: {
                model: '=bstEditCustom',
                readonly: '=',
                handleSave: '&onSave',
                handleCancel: '&onCancel',
                deletable: '@deletable',
                handleDelete: '&onDelete',
                formatter: '@formatter',
                formatterOptions: '=formatterOptions'
            }
        };
    })
    .directive('bstEditSelect', function () {
        return {
            replace: true,
            scope: {
                model: '=bstEditSelect',
                displayValueDefault: '=displayValueDefault',
                formatter: '@formatter',
                readonly: '=',
                selector: '=',
                handleOptions: '&options',
                handleSave: '&onSave',
                handleCancel: '&onCancel',
                deletable: '=deletable',
                handleDelete: '&onDelete',
                editTrigger: '='
            },
            templateUrl: 'components/views/bst-edit-select.html',
            compile: function (element, attrs) {
                var optionsFormat = attrs.optionsFormat;
                if (optionsFormat) {
                    element.find('select').attr('ng-options', optionsFormat);
                }
            }
        };
    })
    .directive('bstEditMultiselect', function () {
        return {
            replace: true,
            templateUrl: 'components/views/bst-edit-multiselect.html',
            scope: {
                model: '=bstEditMultiselect',
                formatter: '@formatter',
                formatterOptions: '@formatterOptions',
                handleOptions: '&options',
                handleSave: '&onSave',
                handleAdd: '&onAdd',
                handleRemove: '&onRemove',
                handleCancel: '&onCancel',
                buttonConfig: '@buttonConfig',
                forcedWorkingMode: '=',
                displayValueDefault: '@displayValueDefault'
            },
            controller: 'BstEditMultiselectController'
        };
    })
    .controller('BstEditMultiselectController', ['$scope', function ($scope) {
        var unbindWatcher, checkPrevious, getIds;

        getIds = function (models) {
            models = models || [];
            return _.pluck(models, "id");
        };

        checkPrevious = function () {
            _.each($scope.options, function (tag) {
                var appliedIds = getIds($scope.model);
                if (_.contains(appliedIds, tag.id, 0)) {
                    tag.selected = true;
                } else {
                    tag.selected = false;
                }
            });
        };

        $scope.toggleOption = function (option) {
            var appliedIds = getIds($scope.model),
                position = _.indexOf(appliedIds, option.id, 0);

            if (position >= 0) {
                option.selected = false;
                $scope.model.splice(position, 1);
            } else {
                option.selected = true;
                $scope.model.push(option);
            }
        };

        // Set the checkboxes for already selected items and then unbind.
        unbindWatcher = $scope.$watch("model + options", function () {
            if (!$scope.model || !$scope.options) {
                return;
            }
            checkPrevious();
            unbindWatcher();
        });
    }])
    .directive('bstEditAddItem', function () {
        return {
            templateUrl: 'components/views/bst-edit-add-item.html',
            scope: {
                model: '=bstEditAddItem',
                handleAdd: '&onAdd'
            },
            controller: 'BstEditAddItemController'
        };
    })
    .controller('BstEditAddItemController', ['$scope', function ($scope) {
        $scope.add = function (value) {
            var handleAdd;

            $scope.workingMode = true;

            handleAdd = $scope.handleAdd(value);

            if (angular.isDefined(handleAdd) && handleAdd.hasOwnProperty('then')) {

                handleAdd.then(
                    function () {
                        $scope.workingMode = false;
                        $scope.newKey = null;
                        $scope.newValue = null;
                    },
                    function () {
                        $scope.workingMode = false;
                    }
                );
            } else {
                $scope.workingMode = false;
                $scope.newKey = null;
                $scope.newValue = null;
            }
        };
    }]);
