app.directive('navbar', function (CartService, $rootScope, AuthService, AUTH_EVENTS, $state, Session) {

    return {
        restrict: 'E',
        scope: {
        },
        templateUrl: 'js/common/directives/navbar/navbar.html',
        link: function (scope) {
            scope.showItem = function(item){
              if(!item.auth)
                return true;
              if(!item.admin)
                return scope.isLoggedIn();
              else
                return Session.user && Session.user.isAdmin;
            };
            scope.getItemCount = function(){
              var count = CartService.itemCount();
              return count;
            };

            scope.items = [
                { label: 'The Foo Store', state: 'home' },
                { label: 'Products', state: 'products' },
                { label: 'Orders', state: 'orders', auth: true },
                { label: 'Users', state: 'users', auth: true, admin: true }
            ];

            scope.user = null;

            scope.isLoggedIn = function () {
                return AuthService.isAuthenticated();
            };

            scope.logout = function () {
                AuthService.logout().then(function () {
                   $state.go('home');
                });
            };

            var setUser = function () {
                AuthService.getLoggedInUser().then(function (user) {
                    scope.user = user;
                });
            };

            var removeUser = function () {
                scope.user = null;
            };

            setUser();

            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

        }

    };

});
