define([
  'app'
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
    function (){

      function Storage(name,data){
        this.name = name;
        this._stroage = localStorage;
      }

      /**
       * 从数据库获取数据
       * @param  {Function} callback 回调函数，格式：
       *                             function(err,data){}
       */
      Storage.prototype.get = function (callback){

        try{
          var data=this._stroage.getItem(this.name);
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
          var data=this._stroage.setItem(this.name,data);
        }catch(e){
          return callback&&callback(e);
        }
        
        callback&&callback();
      }

      return Storage;
    }]);
});