define([
  'app'
],function(app){
app.service('Calendar',[
  function(){
    
    /**
     * 日期
     * @param {Date} date 初始化日期
     *
     * 默认星期一为一周的第一天
     */
    function Calendar(date){
      this.date=new Date(date);
      this.date.setHours(0);
      this.date.setMinutes(0);
      this.date.setSeconds(0);
      this.date.getMilliseconds(0);
      this.firstDayInWeek=1;
    };

    /**
     * 获取日期是为星期几，
     * @return {Number} 
     */
    Calendar.prototype.getDayInWeek=function(){
      var dayInWeek=this.date.getDay();

      dayInWeek-=this.firstDayInWeek;

      if(dayInWeek<0)dayInWeek=6;

      return dayInWeek;
    };

    /**
     * 获取当前星期的周一的日期 
     * @return {Date} 
     */
    Calendar.prototype.getFirstDayInWeek=function(){
      var day=this.getDayInWeek();

      var d=new Date(this.date);

      d.setDate(d.getDate()-day);

      return d;
    };

    /**
     * 获取一段时间每天的日期
     * @param  {Date}   firstDay 第一天
     * @param  {Number} offset   从第一天向后数多少天
     * @return {Array}           返回的数组包含了每天的日期
     */
    Calendar.prototype.getRange=function(firstDay,offset){
      var range=[];
      for(var i=0;i<offset;i++){
        var d=new Date(firstDay);
        d.setDate(d.getDate()+i);
        range.push(d);
      }
      return range;
    };

    return Calendar;
  }]
)
.service('ScheduleStore',[
  'Storage','$filter',
  function(Storage,$filter){

    function ScheduleStore(){
      this.name="Schedule";
      this.schedules={};
      this.storage=new Storage(this.name);
      this.storage.get();
    };

    /**
     * 添加日程
     * @param {Date}     time     日程事件
     * @param {String}   describe 日程描述
     * @param {Function} callback 
     */
    ScheduleStore.prototype.add=function(time,describe,callback){
      var daySche=this._get(time);

      daySche.push({
        time:time,
        describe:describe
      });

      var self=this;

      this.storage.update(this.schedules,function(err){
        callback&&callback(err,self._get(time));
      });

    };

    /**
     * 删除日程
     * @param  {Date}     time     日程日期
     * @param  {Number}   index    日程排位
     * @param  {Function} callback 

     */
    ScheduleStore.prototype.remove=function(date,index,callback){
      var daySche=this._get(date);
      daySche.splice(index,1);

      var self=this;
      this.storage.update(this.schedules,function(err){
        callback&&callback(err,self._get(date));
      })
    };

    /**
     * 获取某天的日程
     * @param  {Date}     date     日程日期
     * @param  {Function} callback 格式：function(err,schedules){}
     */
    ScheduleStore.prototype.get=function(date,callback){
      var self=this;
      self.storage.get(function(err,schedules){
        if(err)return callback&&callback(err);

        schedules=schedules||self.schedules;
        self.schedules=schedules;

        callback&&callback(null,self._get(date));
      })
    };

    /**
     * 从schedules中获取某天的日程
     * @param  {Date}     date      日程日期
     * @return {Array} 
     */
    ScheduleStore.prototype._get=function(date){
      var key=$filter('date')(date,'yyyy-MM-dd');
      
      var daySche=this.schedules[key];
      if(!daySche){
        daySche=this.schedules[key]=[];
      }

      daySche.sort(function(a,b){
        return a.time>b.time;
      })
      return daySche;
    };

    return new ScheduleStore();
  }
  ])
})