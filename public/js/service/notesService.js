

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

  /**
   * 便签数据服务，用Storage做后端，提供储存和读取便签的功能
   */
  app.factory('NotesService',[
             'Storage',
    function(Storage){
      var notesStorage=new Storage('notes'),
          /**
           * 储存便签的变量
           * @type {Array}
           */
          notes=[];

      /**
       * 刷新/获取便签数据
       * @param  {Function} callback 回调函数，格式:
       *                             function(err,notes){}
       */
      function getStorage (callback){
        notesStorage.get(function (err,result){
          if(err)return callback(err);

          try{
            var data=JSON.parse(result);

            data.forEach(function(v,i){
              if(notes.indexOf(v)<0){
                notes.push(v);
              }
            })
          }catch(e){
            return callback&&callback(e);
          }
          
          callback&&callback(null,notes);
        });
      }
      /**
       * 更新便签数据
       * @param  {[type]}   notes    需要保存的便签
       * @param  {Function} callback 回调函数，格式：
       *                             function(err){}
       */
      function updateStorage(notes,callback){
        try{
          var str=JSON.stringify(notes);
        }catch(e){
          return callback&&callback(e);
        }

        notesStorage.update(str,callback);
      }

      //新建一个NotesService时，需要刷新数据
      getStorage();

      return {

        /**
         * 添加便签
         * @param  {String}   note     便签
         * @param  {Function} callback 回调函数，格式：
         *                             function(err){}
         */
        push: function (note,callback){
          var done;

          notes.forEach(function(n) {
            if (n==note) {
              done=true;
              callback(new Error('梦想已经记录下了'))
            }
          });

          if (done) return;
          notes.push(note);
          updateStorage(notes,callback);
        },

        /**
         * 删除便签
         * @param  {Number}   index    便签的位置
         * @param  {Function} callback 回调函数，格式：
         *                             function(err){}
         */
        delete: function (index,callback){
          notes.splice(index,1);
          updateStorage(notes,callback);
        },

        /**
         * 储存便签的变量
         * @type {Array}
         */
        data:notes
      }
    }
    ])
})
