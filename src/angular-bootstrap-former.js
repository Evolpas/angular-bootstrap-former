angular.module('AngularFormer', ['ui.bootstrap'])
        /*
         * bafe stand for bootstrap angularjs form element
         * handle showing errors for each input element of form
         */
        .directive('bafe', function () {
            return {
                restrict: 'A',
                link: function ($scope, element, attrs) {
                    //watching for form errors of scope
                    $scope.$watch('errors', function () {
                        var fieldName = attrs.bafe;
                        if ($scope.errors) {
                            if (fieldName in $scope.errors) {
                                if (element.siblings('span.help-block').length) {
                                    element.siblings('span.help-block').html($scope.errors[fieldName]);
                                } else {
                                    element.parent().append('<span class="help-block">' + $scope.errors[fieldName] + '</span>');
                                }
                                element.parents('.form-group').addClass('has-error');
                            } else {
                                element.siblings('span.help-block').remove();
                                element.parents('.form-group').removeClass('has-error');
                            }
                        }
                    });
                }
            };
        })
        /*
         * baf stand for bootstrap angularjs form
         * Handler the form submition, send form data to server by ussing $http, handle error of server validaton
         * excute formCallback, when server respon status {success:true}
         */
        .directive('baf', ['$http', function ($http) {
                return {
                    restrict: 'A',
                    link: function ($scope, element, attrs) {
                        $scope.formHandle = {
                            loading: false
                        };
                        element.on('submit', function () {
                            $scope.formHandle.errorMessage = false;
                            var url = attrs.action;
                            var method = attrs.method;
                            $scope.formHandle.loading = true;
                            $http({
                                url: url,
                                method: method,
                                data: $scope.fdata
                            }).success(function (response) {
                                $scope.formHandle.loading = false;
                                //check if response has validation errors
                                if (response.errors !== null) {
                                    $scope.errors = response.errors;
                                } else {//clear the validation errors on form
                                    $scope.errors = {};
                                }
                                //form success
                                if (response.success === true) {
                                    //check if response has successMessage
                                    if (response.message) {
                                        $scope.formHandle.successMessage = response.message;
                                    }
                                    //if (($scope.formSuccess)) {
                                    $scope.formCallback(response);
                                    //}
                                } else {//in case form has valiation errors or error message
                                    if (response.message) {
                                        $scope.formHandle.errorMessage = response.message;
                                    }
                                }
                            });
                            return false;
                        });
                    }
                };
            }]);
