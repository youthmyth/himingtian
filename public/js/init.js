require.config({
  baseUrl:'/js',
  paths:{
    'angular':'../lib/angular',
    'angular-bootstrap':'../lib/ui-bootstrap-tpls',
    'angular-animate':'../lib/angular-animate'
  },
  shim:{
    angular:{
      exports:'angular'
    },
    'angular-bootstrap':{
      deps:['angular'] 
    },
    'angular-animate':{
      deps:['angular'] 
    },
  }
})
define([
  'angular',
  'app',
  'controller/notes',
  'directive/errors'
],function(angular){
  angular.bootstrap(document, ['himingtian']);
  document.body.setAttribute('ng-app', 'himingtian');
})
