//对比密码与第二次输入的密码是否一样
define(["app"], function(app){
    app.directive('compare', function(){
        return {
            require: "ngModel",
            link: function(scope, elm, attrs, ngmodel){
                // console.log(ngmodel);
                ngmodel.$parsers.unshift(function(viewValue){
                    if(viewValue == "" || attrs.compare == "" || viewValue == attrs.compare){
                        ngmodel.$setValidity('compare', true)
                    } else {
                        ngmodel.$setValidity('compare', false)
                    }
                    return viewValue;
                })
            }
        }
    })
})