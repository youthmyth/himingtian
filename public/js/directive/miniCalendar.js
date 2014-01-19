define([
  'app',
  'directive/popblock',
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

          /**
           * 刷新Schedule，用于更新日期下面的状态点
           */
          $scope.refreshSchedule=function(){
            $scope.days.forEach(function(day){
              ScheduleStore.get(day,function(err,schedules){
                day.schedules=schedules;
              })
            })
          }
          $scope.refreshSchedule();
          $scope.time=new Date();

          /**
           * 新建一个Schedule
           * @param {Date} day        日期
           * @param {Date} time       时间
           * @param {String} describe 描述
           */
          $scope.addSchedule=function(day,time,describe){
            if(!describe)return;
            var t=new Date(day);
            t.setHours(time.getHours());
            t.setMinutes(time.getMinutes());

            ScheduleStore.add(t,describe,function(err,schedules){
              if(err)return;
              $scope.refreshSchedule();
              $scope.schedules=schedules;
            })
          };

          /**
           * 获取列表元素的Class
           * 
           * active   指定日期与日历操作框里的日期一致
           * weekend  指定日期为周末
           * today    指定日期为今天
           * 
           * @param  {Date} day 指定日期
           */
          $scope.getListElementClass=function(day){
            var klass='';
            klass+=compareDate($scope.dashboardDate,day)?'active':'';
            klass+=' ';
            klass+=(day.getDay()==0)?'weekend':'';
            klass+=' ';
            klass+=compareDate(new Date(),day)?'today':'';
            return klass;
          };

          /**
           * 删除计划
           * @param  {Date} date  日期
           * @param  {Number} index 序号
           */
          $scope.deleteSche=function(date,index){
            ScheduleStore.remove(date,index,function(err,schedules){
              if(err)return;
              $scope.refreshSchedule();
              $scope.schedules=schedules;
            })
          };

          /**
           * 根据年月日比较两个日期是否相同
           * @param  {Date} a 
           * @param  {Date} b 
           * @return {Boolean}   相同则为真
           */
          var compareDate=$scope.compareDate=function(a,b){
            if(!(a instanceof Date)||!(b instanceof Date)){

              return false;
            }
            return a.toDateString()==b.toDateString();
          };

          /**
           * 显示日历操作框，并将其定位至指定元素上方
           * @param  {Date} date    要显示的日期
           * @param  {Event} $event 鼠标点击事件，用于提取其中的元素
           */
          $scope.showDashboard=function(date,$event ){
            if(compareDate($scope.dashboardDate,date)){
              $scope.dashboardDate=null;
              $scope.hidePopblock();
              return;
            }else{
              $scope.dashboardDate=date;
              ScheduleStore.get(date,function(err,schedules){
                $scope.schedules=schedules;
                $scope.movePopblock($event.target);
              })
            }
          };

          /**
           * 关闭日历操作框
           */
          $scope.closeDashboard=function(){
            $scope.dashboardDate=null;
            $scope.hidePopblock();
          }
          
          $scope.popblockOptions={
            x:true,
            y:false
          }
        }
      ]
    }
  }
  ]
)
});
