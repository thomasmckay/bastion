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
 **/

describe('Controller: SystemSystemGroupsController', function() {
    var $scope,
        $controller,
        translate,
        System,
        CurrentOrganization;

    beforeEach(module(
        'Bastion.systems',
        'Bastion.system-groups',
        'Bastion.test-mocks',
        'systems/details/views/system-groups.html',
        'systems/views/systems.html',
        'systems/views/systems-table-full.html'
    ));

    beforeEach(inject(function($injector) {
        var $controller = $injector.get('$controller'),
            $q = $injector.get('$q');

        System = $injector.get('MockResource').$new();
        $scope = $injector.get('$rootScope').$new();

        System.saveSystemGroups = function() {};

        CurrentOrganization = 'foo';

        translate = function(message) {
            return message;
        };

        $controller('SystemSystemGroupsController', {
            $scope: $scope,
            $q: $q,
            translate: translate,
            System: System,
            CurrentOrganization: CurrentOrganization
        });

        $scope.system = new System({
            uuid: 2,
            systemGroups: [{id: 1, name: "lalala"}, {id: 2, name: "hello!"}],
            system_group_ids: [1, 2]
        });
    }));

    it('attaches the nutupane table to the scope', function() {
        expect($scope.systemGroupsTable).toBeDefined();
    });

    it("allows removing system groups from the system", function() {
        spyOn($scope.system, '$update');

        $scope.systemGroupsTable.getSelected = function() {
            return [{id: 1, name: "lalala"}];
        };

        $scope.removeSystemGroups($scope.system);
        expect($scope.system.$update).toHaveBeenCalledWith({id: 2}, jasmine.any(Function), jasmine.any(Function));
    });
});
