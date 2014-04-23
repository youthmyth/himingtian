define([
  'app',
  'service/storage'
],function (app) {

  /**
   * 便签数据服务，用Storage做后端，提供储存和读取便签的功能
   */
  app.factory('NotesService',[
             '$http', 'Storage',
    function($http, Storage){
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
        if(!notesStorage)return callback&&callback(null,notes);

        if (navigator.onLine){
          $http.post('/storage/note/get')
            .success(function(res, status, header, config){
              try{
                res.data.forEach(function(v, i){
                  notes.push({id: v.id, data: v.data});
                });
              }
              catch(e){
                return callback&&callback(e);
              }

            })
            .error(function(res, status, header, config){
              callback(new Error('无法获取'));
            });
        }
        else
        {
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
            if (n == note) {
              done = true;
              callback(new Error('梦想已经记录下了'))
            }
          });

          if (done) return;
          if (navigator.onLine){  // 在线
            var str = '创建便笺失败';
            $http.post('/storage/note/add', {note: note})
              .success(function(res, status, header, config){
                if (res.id){
                  notes.push({id: res.id, data: note});
                  updateStorage(notes,callback);
                }
                else{
                  callback(new Error(str));
                }
              })
              .error(function(res, status, header, config){
                callback(new Error(str));
              });
          }
          else{
            notes.push({id: -1, note: note});
            updateStorage(notes,callback);
          }
        },

        /**
         * 删除便签
         * @param  {Number}   index    便签的位置
         * @param  {Function} callback 回调函数，格式：
         *                             function(err){}
         */
        del: function (index,callback){

          // 若在线
          if (navigator.onLine){
            var note_id;
            var str = '删除便笺失败';
            if (notes.length > index){
              note_id = notes[index].id;
              $http.post('/storage/note/del', {id: note_id})
                .success(function(res, status, header, config){
                  if (res.ret){
                    notes.splice(index, 1);
                    updateStorage(notes, callback);
                  }
                  else{
                    callback(new Error(str));
                  }
                })
                .error(function(res, status, header, config){
                  callback(new Error(str));
                });
            }
            else{
              callback(new Error(str));
            }
          }
          else  //  若离线，使用localstorage储存
          {
            notes.splice(index,1);
            updateStorage(notes,callback);
          }
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
