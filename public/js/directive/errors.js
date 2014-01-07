define([
  'app',
  'service/errorHandler'
],function(app){
app
.directive('errors',
	[
	function(){
		return {
			template:'<div class="errors "><alert ng-repeat="err in errors" close="closeAlert($index)">{{err.showupText()}}</alert></div>',
			restrict:'EA',
      replace:true,
      $scope:{
      },
      controller:[
        '$scope','ErrorHandler',
        function($scope,ErrorHandler){
          $scope.errors=ErrorHandler.errors;
          $scope.closeAlert=function(index){
            ErrorHandler.remove(index);
          }
        }
      ]
		}
	}
	]
)
});
