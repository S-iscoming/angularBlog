define(["app"], function (app) {
    return app
        .constant('AUTH_EVENTS', {
            loginSuccess: 'auth-login-success',
            loginFailed: 'auth-login-failed',
            logoutSuccess: 'auth-logout-success',
            sessionTimeout: 'auth-session-timeout',
            notAuthenticated: 'auth-not-authenticated',//登路
            notAuthorized: 'auth-not-authorized'//授权
        })
        .constant('USER_ROLES', {
            all: '*',
            admin: 'admin',
            editor: 'editor',
            guest: 'guest'
        })
        .factory("AuthService", function ($http) {
            var authService = {};
            authService.currentUser = {};
            authService.login = function (user) {
                return $http
                    .post("/api/login", user)
                    .then(function (res) {
                        authService.currentUser = res.data;
                        return res.data
                    })
            }

            authService.isAuthenticated = function () {
                //是否登路
               return $http.get("/api/checklogin")
                       .then(function (res) {
                           if (res.data) {
                               authService.currentUser  = res.data;
                               return res.data
                               // resolve(res.data)
                           }else{
                               // resolve(null);
                               // reject("没数据")
                           }
                       })
            }
            authService.isAuthorized = function (authorizedRoles) {
                if (!angular.isArray(authorizedRoles)) {
                    authorizedRoles = [authorizedRoles]
                }
                var user;
                return (user = authService.currentUser) && (user.name) && (authorizedRoles.indexOf(user.role) !== -1)
            }
            return authService;
        })
        .factory("AuthInterceptor", function ($rootScope, $q, AUTH_EVENTS) {
            //拦截器
            return {
                'request': function (config) {
                    return config; //    $q.when(config);
                },
                'response': function (response) { //
                    return response; //    $q.when(config);
                },
                'requestError': function (rejection) {
                    return rejection;
                    // return $q.reject(rejection);
                },
                'responseError': function (response) {
                    $rootScope.$broadcast({
                        401: AUTH_EVENTS.notAuthenticated,
                        403: AUTH_EVENTS.notAuthorized,
                        419: AUTH_EVENTS.sessionTimeout,
                        440: AUTH_EVENTS.sessionTimeout
                    }[response.status], response);
                    return $q.reject(response);
                }
            }
        })
})