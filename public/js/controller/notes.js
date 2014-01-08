define([
  'app',
  'service/notesService',
],function (app) {
  app.controller('NotesController',[
            '$scope','NotesService','ErrorHandler',
    function($scope,  NotesService, ErrorHandler) {
      /*
        添加便签
       */
      $scope.addNote = function (){
        NotesService.push($scope.note,function(err,notes){
          $scope.note='';
          //TODO: handle error
          if(err){
            ErrorHandler.push(err);
          }
        });
      };

      /*
        删除便签
       */
      $scope.deleteNote = function (index){
        NotesService.del(index,function(err) {
          if(err){
            ErrorHandler.push(err);
          }
        })
      }

      /*
        绑定便签数据
       */
      $scope.notes=NotesService.data;
    }
    ])
})
