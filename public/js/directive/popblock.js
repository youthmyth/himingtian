define([
  'app'
],function(app){
app
.directive('popblock',
  function(){
    return {
      restrict:'E',
      template:'<div  ng-transclude></div>',
      transclude:true,
      link:function($scope,element,attrs){

        var options=$scope.$eval(attrs.options);
        /**
         * 获取元素的位置
         * @param  {Element} e html元素
         * @return {Object}   
         */
        function getPosition(e){
          var x=0,y=0;
          while(e){
            if(e.offsetLeft) x+=e.offsetLeft;
            
            if(e.offsetTop) y+=e.offsetTop;

            e=e.parentElement;
          }
          return {
            x:x,
            y:y
          }
        }

        /**
         * 获取元素的宽高
         * @param  {Element} element html元素
         * @return {Object}         
         */
        function getSize(element){
          return{
            h:element.offsetHeight,
            w:element.offsetWidth
          }
        }

        /**
         * 获取屏幕的尺寸
         * @return {Object} 
         */
        function getScreemSize(){
          return {
            h:window.innerHeight,
            w:window.innerWidth
          }
        }

        var left=0,top=0;

        /**
         * 隐藏popblock
         * @return {[type]} [description]
         */
        $scope.hidePopblock=function(){
          left=-2000;
          element.css({left:left+'px'});
        }

        /**
         * 将popblock移动到指定元素上方
         * @param  {Element} target 
         */
        $scope.movePopblock=function(target){
          var targetPosition=getPosition(target);
          var blockPosition=getPosition(element[0]);

          var blockSize=getSize(element[0]);
          var screenSize=getScreemSize();
          var css={};

          if(options.x){
            if((targetPosition.x+blockSize.w)>screenSize.w){
              left=screenSize.w-(blockPosition.x-left+blockSize.w);
            }else{
              left=targetPosition.x-(blockPosition.x-left);
            }
            
            css.left=left+'px';
          }
          if(options.y){
            
            if((targetPosition.y+blockSize.h)>screenSize.h){
              top=screenSize.h-(blockPosition.y-top+blockSize.h);
            }else{
              top=targetPosition.y-(blockPosition.y-top+blockSize.h);
            }

            css.top=top+'px';
          }

          element.css(css);
        }

        $scope.hidePopblock();
      }
    }
  }
)
});
