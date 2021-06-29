
angular
    .module('PowerFlowApp', ['ui.powerflow'])
    .controller('powerFlowCtrlOH', myControlOH);

myControlOH.$inject = ['$scope','OHService'];
function myControlOH($scope,OHService) {
	console.log("OH items "+JSON.stringify(Object.keys(OHService),null,4));
	console.log("$scope is "+JSON.stringify(Object.keys($scope),null,4));

	var hasConfig=(typeof $scope.config != 'undefined' );

	if( !hasConfig ) return;

	//
	// $scope.config.house
	// $scope.config.bat
	// $scope.config.p1 p2 p3 p4

	//
	// Update items functions...
	//
	var updateHouse=function() {
		var item = OHService.getItem($scope.config.house);
		if (item) { $scope.house = parseFloat(item.state); }
	};
	var updateBat=function() {
		var item = OHService.getItem($scope.config.bat);
		if (item) { $scope.bat = parseFloat(item.state); }
	};
	var updateP1=function() {
		var item = OHService.getItem($scope.config.p1);
		if (item) { $scope.p1 = parseFloat(item.state); }
	};
	var updateP2=function() {
		var item = OHService.getItem($scope.config.p2);
		if (item) { $scope.p2 = parseFloat(item.state); }
	};
	var updateP3=function() {
		var item = OHService.getItem($scope.config.p3);
		if (item) { $scope.p3 = parseFloat(item.state); }
	};
	var updateP4=function() {
		var item = OHService.getItem($scope.config.p4);
		if (item) { $scope.p4 = parseFloat(item.state); }
	};

	//
	// Initial starting values... dont wait for update.
	//
	updateHouse();
	updateBat();
	updateP1();
	updateP2();
	updateP3();
	updateP4();
	//
	// item tracking... here we track current/setpoint/heating
	//
	OHService.onUpdate($scope, $scope.config.house, updateHouse);
	OHService.onUpdate($scope, $scope.config.bat, updateBat);
	OHService.onUpdate($scope, $scope.config.p1, updateP1);
	OHService.onUpdate($scope, $scope.config.p2, updateP2);
	OHService.onUpdate($scope, $scope.config.p3, updateP3);
	OHService.onUpdate($scope, $scope.config.p4, updateP4);
}



