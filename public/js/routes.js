define(["app", "controllers/index", "controllers/login", "controllers/logout", "controllers/signup", "controllers/feedback"],
    function (app, index, login, logout, signup, feedback) {
        return app
            .config(["$stateProvider", "$urlRouterProvider", "USER_ROLES", function ($stateProvider, $urlRouterProvider, USER_ROLES) {//用constant注册的服务
                $urlRouterProvider.otherwise('/');
                $stateProvider
                    .state("/", {
                        url: "/",
                        templateUrl: 'partials/index.html',
                        controller: index,
                        data: {
                            login: false
                        }
                    })
                    .state("/login", {
                        url: "/login",
                        templateUrl: "partials/login.html",
                        controller: login,
                        data: {
                            login: false
                        }
                    })
                    .state("/logout", {
                        url: "/logout",
                        // templateUrl: "partials/logout.html",
                        controller: logout,
                        data: {
                            login: true
                        }
                    })
                    .state("/signup", {
                        url: "/signup",
                        templateUrl: "partials/signup.html",
                        controller: signup,
                        data: {
                            login: false
                        }
                    })
                    .state("/feedback", {
                        url: "/feedback",
                        templateUrl: "partials/feedback.html",
                        controller: feedback,
                        data: {
                            authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor],
                            login: true
                        }
                    })
            }])
            .run(function ($rootScope, $location, AUTH_EVENTS, AuthService) {
                $rootScope.$on("$stateChangeStart", function (evt, next, current) {
                    if(next.data && next.data.login){
                        if(AuthService.isAuthenticated() != next.data.login){//登录状态与设置不符
                            evt.preventDefault();
                        }else if(next.data.authorizedRoles) {
                            var authorizedRoles = next.data.authorizedRoles||"";

                            if(!AuthService.isAuthorized(authorizedRoles)){//此用户未被授权
                                evt.preventDefault();
                            }
                        }
                    }
                    /*if(next.data && next.data.authorizedRoles){
                        var authorizedRoles = next.data.authorizedRoles||"";
                        if (!AuthService.isAuthorized(authorizedRoles)) {
                            evt.preventDefault();
                            if (AuthService.isAuthenticated()) {
                                // user is not allowed
                                $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                            } else {
                                // user is not logged in
                                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                            }
                        }
                    }*/

                    /*if(!AuthService.userLoggedIn()){
                     if(next.templateUrl === "login.html"){

                     } else {
                     $location.path("/login");
                     }
                     }*/
                })
            })
    })