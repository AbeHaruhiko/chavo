var chavo;
(function (chavo) {
    'use strict';
    var SettingsFamilyApprovalController = (function () {
        function SettingsFamilyApprovalController($scope, $rootScope, $state, $stateParams, cfpLoadingBar, $q, $modal) {
            var _this = this;
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.cfpLoadingBar = cfpLoadingBar;
            this.$q = $q;
            this.$modal = $modal;
            this.familyApplicationList = [];
            cfpLoadingBar.start();
            Parse.Cloud.run('getFamilyAppToRequestUser')
                .then(function (results) {
                if (results.length <= 0) {
                    cfpLoadingBar.complete();
                    return;
                }
                results.forEach(function (parseFamilyApplication) {
                    cfpLoadingBar.complete();
                    _this.$scope.$apply(function () {
                        _this.familyApplicationList.push(new chavo.FamilyApplication(parseFamilyApplication.get(Const.FamilyApplication.COL_FROM_USER).get('username'), parseFamilyApplication.get(Const.FamilyApplication.COL_FROM_USER).id, parseFamilyApplication.get(Const.FamilyApplication.COL_FROM_USER).get('iconUrl'), parseFamilyApplication.get(Parse.User.current().get('usename')), parseFamilyApplication.get(Parse.User.current().id), parseFamilyApplication.get(Parse.User.current().get('iconUrl')), parseFamilyApplication.get(Const.FamilyApplication.COL_APPLY_DATE_TIME), parseFamilyApplication.id));
                    });
                });
            });
        }
        SettingsFamilyApprovalController.prototype.openConfirmModal = function (mode, familyApplication) {
            var _this = this;
            var modalInstance = this.$modal.open({
                animation: true,
                templateUrl: 'rejectOrApproveConfirmModal.html',
                controller: 'RejectOrApproveConfirmModalController',
                controllerAs: 'rejecrt_apprive_modal',
                size: 'sm',
                resolve: {
                    mode: function () {
                        return mode;
                    },
                    familyApplication: function () {
                        return familyApplication;
                    }
                }
            });
            modalInstance.result.then(function () {
                if (mode === 'reject') {
                    _this.destroyFamilyApproval(familyApplication);
                }
                else if (mode === 'approve') {
                    _this.doFamilyApproval(familyApplication);
                }
            }, function () {
                console.dir(familyApplication.objectId);
            });
        };
        SettingsFamilyApprovalController.prototype.destroyFamilyApproval = function (familyApplication) {
            var _this = this;
            var ParseFamilyApplication = Parse.Object.extend('FamilyApplication');
            var parseFamilyApplication = new ParseFamilyApplication();
            parseFamilyApplication.id = familyApplication.objectId;
            parseFamilyApplication.destroy()
                .then(function () {
                _this.$state.reload();
            });
            console.dir(familyApplication.objectId);
        };
        SettingsFamilyApprovalController.prototype.doFamilyApproval = function (familyApplication) {
            console.dir(familyApplication.objectId);
            Parse.Cloud.run('addFamily', { familyApplication: familyApplication });
        };
        return SettingsFamilyApprovalController;
    })();
    chavo.SettingsFamilyApprovalController = SettingsFamilyApprovalController;
    var RejectOrApproveConfirmModalController = (function () {
        function RejectOrApproveConfirmModalController($scope, $modalInstance, familyApplication, mode) {
            this.$scope = $scope;
            this.$modalInstance = $modalInstance;
            this.familyApplication = familyApplication;
            this.mode = mode;
            this.modeDispText = '';
            if (mode === 'reject') {
                this.modeDispText = '否認';
            }
            else if (mode === 'approve') {
                this.modeDispText = '承認';
            }
        }
        RejectOrApproveConfirmModalController.prototype.process = function () {
            this.$modalInstance.close();
        };
        RejectOrApproveConfirmModalController.prototype.cancel = function () {
            this.$modalInstance.dismiss('cancel');
        };
        return RejectOrApproveConfirmModalController;
    })();
    chavo.RejectOrApproveConfirmModalController = RejectOrApproveConfirmModalController;
})(chavo || (chavo = {}));
