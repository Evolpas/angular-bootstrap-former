Angular Bootstrap Former
=========

An Angular module will handle form validation from server side and display errors in combination with Bootstrap.

Angularjs form validation is perfect, but you also need to validate the form data in server. This module will help you submit the form, display the errors message, and execute the callback when the form submit successfully.

#Required 
* Jquery 
* Angularjs
* Bootstrap3

#Demo
[evolpas.com/demo-angular-former/](evolpas.com/demo-angular-former/)

#Quick start
####Include the `AngularFormer` in your Angular App
```
var app = angular.module('DemoFormer', ['AngularFormer']);
```
####Add the `baf` attribute to the `form` tag
"baf" stands for Bootstap Angular Form.
```
<form action="your_action" method="POST" ng-controller="YourController" class="form-horizontal" accept-charset="utf-8" baf>
```
####Add the `bafe` attribute for each form element
"bafe" stands for Bootstrap Angular Form Element. And the `ng-model` of each element should look like `ng-model="fdata.element_name"`.Example: 
```
<div class="form-group">
	<label class="control-label col-lg-3 col-sm-4" for="email">Email</label>
	<div class="col-lg-9 col-sm-8">
		<input type="text" name="email" id="email" bafe="email" ng-model="fdata.email" class="form-control">
	</div>
</div>
```
####Response from server.

The respone must be a json object with: 
* key `success` : `true` or `false`. The status of validation.
* key `errors` : `array` . In case `success` = `false`, the response will have the message content for each field. The struct of errors will be
```
{
"success":false,
"errors":{
        "email":[
            "The email field is required"
        ],
        "phone":[
            "The phone must be at least 6 characters",
            "The phone must be a number"
        ]
    }
}
```
If you want to clear the error messages on the form for previous submittion, you cant set `"errors" : null`.

Sometime the validation is passed but you still want to show another message, login form is an example, usename and password are ok, but status of login is fail. You have to show the message of logging on the form. The response in this case is: 
```
{
"success":false,
"errors":null,
"message":"Invalid username or password"
}
```
Add this code to the scope of controller
```
<div class="alert alert-danger" ng-show="formHandle.errorMessage">
        {{formHandle.errorMessage}}
    </div>
```

####Setup the callback in controller
What do you want to do when the form success. You need to make a callback like this.
```
app.controller('LoginCtrl', ['$scope', function ($scope) {
        $scope.formCallback = function (response) {
           //what do you want to do
            alert(response.message);
        };
    }]);
```
####Form loading
Maybe you want to show the progress while the form is submiting, it's easy by using `ng-show` directive.
```
<div class="form-loading" ng-show="formHandle.loading">
    <img src="/img/form-loading.gif"/>
</div>
```
# With Laravel 
It's more easy when using Laravel validation and [Laravel Former](https://github.com/Anahkiasen/former)
```
public function postRegister() {
        $v = Validator::make($input = Input::all(), User::$registerRules);
        $response = array();
        if ($v->passes()) {
            $response['success'] = true;
            User::create($input);
            $response['message'] = 'Your account has been created, now you can login';
        } else {
            $response['success'] = false;
            $response['errors'] = $v->messages()->toArray();
        }
        return Response::json($response);
    }
```
In you view
```
<?php
    echo Former::horizontal_open(URL::to('login'))
            ->method('post')
            ->baf();
    ?>
    <div class="alert alert-danger" ng-show="formHandle.errorMessage">
        {{formHandle.errorMessage}}
    </div>
    <?php
    echo Former::text('email')
            ->ng_model('fdata.email')
            ->bafe('email');
    echo Former::password('password')
            ->ng_model('fdata.password')
            ->bafe('password');
    ?>
    <div class="form-loading" ng-show="formHandle.loading">
        <img src="<?php echo asset('assets/img/form-loading.gif'); ?>"/>
    </div>
    <div class="form-group" ng-show="!formHandle.loading">
        <button type="submit" class="btn btn-default btn-lg btn-primary col-lg-offset-9">Login</button>
    </div>
    <?php
    echo Former::close();
    ?>
```
