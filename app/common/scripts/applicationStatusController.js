angular.module('common').controller('ApplicationStatusController', function($scope, supersonic, BankRequestService, FormService) {
    $scope.approvals = {
        feldcoFinance: {
            waiting: true,
            text: 'Declined',
            amount: 0,
            showFeldco: false
        },
        wellsFargo: {
            waiting: true,
            text: 'Declined',
            amount: 0,
            showWellsFargo: false
        },
        greenSky: {
            waiting: true,
            text: 'Declined',
            amount: 0,
            showGreenSky: false
        }
    };

    $scope.noApprovals = false;
    //$scope.creditScore = 800*FormService.forms.creditForm.income/100000;
    $scope.waitingForApprovals = true;
    setTimeout(function() {
        $scope.approvals.feldcoFinance.waiting = false;
        $scope.approvals.feldcoFinance.text = 'Approved';
        $scope.approvals.feldcoFinance.amount = '$60,000';
        $scope.approvals.feldcoFinance.showFeldco = true;
        if($scope.approvals.feldcoFinance.showFeldco){
            $scope.waitingForApprovals = false;
        }
        supersonic.logger.log(1);
        setTimeout(function() {
            $scope.approvals.wellsFargo.waiting = false;
            $scope.approvals.wellsFargo.text = 'Approved';
            $scope.approvals.wellsFargo.amount = '$36,000';
            $scope.approvals.wellsFargo.showWellsFargo = false;
            if($scope.approvals.wellsFargo.showWellsFargo){
                $scope.waitingForApprovals = false;
            }
            supersonic.logger.log(2);
            setTimeout(function() {
                $scope.approvals.greenSky.waiting = false;
                $scope.approvals.greenSky.text = 'Approved';
                $scope.approvals.greenSky.amount = '$12,000';
                $scope.approvals.greenSky.showGreenSky = false;
                if($scope.approvals.greenSky.showGreenSky){
                    $scope.waitingForApprovals = false;
                }
                supersonic.logger.log(3);
            }, 2000)
        }, 2000)
    }, 3000);

    $scope.init = function() {
        requestObject = {bank: 'internal', creditScore: $scope.creditScore};
        BankRequestService.submitRequest(requestObject).then(function(result) {
            var approved = result.approved;
            if (approved) {
                $scope.approvals.feldcoFinance.text = 'Approved';
                $scope.approvals.feldcoFinance.amount = FormService.forms.creditForm.loanAmount;
                        $scope.approvals.feldcoFinance.showFeldco = true;
            } else {
                $scope.approvals.feldcoFinance.text = 'Declined';
                requestObject = {bank: 'wellsFargo', creditScore: $scope.creditScore};
                BankRequestService.submitRequest(requestObject).then(function(result) {
                    var approved = result.approved;
                    if (approved) {
                        $scope.approvals.wellsFargo.text = 'Approved';
                        $scope.approvals.wellsFargo.amount = FormService.forms.creditForm.loanAmount;
                        $scope.approvals.wellsFargo.showWellsFargo = true;
                    } else {
                        $scope.approvals.wellsFargo.text = 'Declined';
                        requestObject = {bank: 'greenSky', creditScore: $scope.creditScore};
                        BankRequestService.submitRequest(requestObject).then(function(result) {
                            var approved = result.approved;
                            if (approved) {
                                $scope.approvals.greenSky.text = 'Approved';
                                $scope.approvals.greenSky.amount = FormService.forms.creditForm.loanAmount;
                                $scope.approvals.greenSky.showGreenSky = true;
                            } else {
                                $scope.approvals.greenSky.text = 'Declined';
                                $scope.noApprovals = true;
                            }
                        }, function(reason) {
                            supersonic.logger.log('Request Error: '+reason);
                        });
                    }
                }, function(reason) {
                    supersonic.logger.log('Request Error: '+reason);
                });
            }
        }, function(reason) {
            supersonic.logger.log('Request Error: '+reason);
        });
    }
});
