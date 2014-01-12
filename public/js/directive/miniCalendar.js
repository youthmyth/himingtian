define([
  'app',
  'service/calendarService'
],function(app){
app
.directive('minicalendar',
  [
  function(){
    return {
      templateUrl:'/views/miniCalendar.html',
      restrict:'E',
      $scope:{
      },
      controller:[
        '$scope','Calendar','ScheduleStore',
        function($scope,Calendar,ScheduleStore){
          var calendar=new Calendar(new Date());
          var monday=calendar.getFirstDayInWeek();
          $scope.days=calendar.getRange(monday,28);

          $scope.showSchedules=function(date){
            ScheduleStore.get(date,function(err,schedules){
              $scope.schedules=schedules;
            })
          };
          
          $scope.time=new Date();
          $scope.addSchedule=function(day,time,describe){
            if(!describe)return;
            var t=new Date(day);
            t.setHours(time.getHours());
            t.setMinutes(time.getMinutes());

            ScheduleStore.add(t,describe,function(err,schedules){
              
              if(err)return;

              $scope.schedules=schedules;
            })
          };

          $scope.getListElementClass=function(day){
            var klass='';
            klass+=compareDate($scope.dashboardDate,day)?'active':'';
            klass+=' ';
            klass+=compareDate(new Date(),day)?'today':'';
            return klass;
          };

          $scope.closeDashboard=function(){
            $scope.dashboardDate=null;
          };

          $scope.deleteSche=function(date,index){
            ScheduleStore.remove(date,index,function(err,schedules){
              if(err)return;

              $scope.schedules=schedules;
            })
          };

          var compareDate=$scope.compareDate=function(a,b){
            if(!(a instanceof Date)||!(b instanceof Date)){

              return false;
            }
            return a.toDateString()==b.toDateString();
          };

          $scope.showSchedules=function(date){
            if(compareDate($scope.dashboardDate,date)){
              $scope.dashboardDate=null;
              return;
            }else{
              $scope.dashboardDate=date;

              ScheduleStore.get(date,function(err,schedules){
                $scope.schedules=schedules;
              })
            }
          };

        }
      ]
    }
  }
  ]
)
});
