define([
  'app',
  'service/errorHandler'
],function (app) {
  /**
   * 数据存储器
   *
   * 储存与读取时，返回的值皆为字符串。
   * 
   * TODO: 1. 支持indexedDB
   *       2. 支持与服务器交互
   *
   */
  app.factory('Storage',[
             'ErrorHandler',
    function (ErrorHandler){

      function Storage(name){
        this.name = name;
        try{
          this._stroage = localStorage;
        }catch(e){
          ErrorHandler.push(new Error('您的浏览器不支持离线储存 '));
          return null;
        }
      }

      /**
       * 从数据库获取数据
       * @param  {Function} callback 回调函数，格式：
       *                             function(err,data){}
       */
      Storage.prototype.get = function (callback){
        if(this.data)return callback(null,this.data);

        try{
          var data=this._stroage.getItem(this.name);
          data=JSON.parse(data);
        }catch(e){
          return callback&&callback(e);
        }
        callback&&callback(null,data);
      }

      /**
       * 更新数据库
       * @param  {String}   data     数据
       * @param  {Function} callback 回调函数，格式：
       *                             function(err){}
       */
      Storage.prototype.update = function (data,callback){
        try{
          this._stroage.setItem(this.name,JSON.stringify(data));
          this.data=data;
        }catch(e){
          return callback&&callback(e);
        }
        callback&&callback();
      }

      return Storage;
    }]);
});