define([
  'app',
  'service/storage'
],function (app) {

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
        if(!notesStorage)return callback&&callbacl(null,notes);
        notesStorage.get(function (err,data){
          if(err)return callback(err);
          try{
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
        if(!notesStorage)return callback&&callbacl(null);

        notesStorage.update(notes,callback);
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
        del: function (index,callback){
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
