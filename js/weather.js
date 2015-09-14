// APP
var app = angular.module('weatherApp', ['ngRoute']);

// CONTROLLERS
app.controller('weatherCtrl', ['$scope', '$http', '$location', 'cityService', function($scope, $http, $location, cityService){
    $scope.city = cityService.city;
    $scope.getForecast = function(){$location.path('/forecast');};

    $scope.$watch('city', function(new_val, old_val){
        cityService.city = $scope.city;
        // console.log(shared.city);
    });
}]);


app.controller('forecastCtrl', ['$scope', '$http', '$routeParams', 'cityService', function($scope, $http, $routeParams, cityService){
    $scope.city = cityService.city;
    $scope.weatherResult = null;
    $scope.days = $routeParams.days || 3;
    $scope.filters = {
        toCelcius: function(t){return (Math.round(t - 273.15)*10)/10 + '°C';},
        toReadableDate: function(timestamp){return new Date(timestamp * 1000);}
    };

    console.log($routeParams);

    $http.jsonp('http://api.openweathermap.org/data/2.5/forecast/daily?callback=JSON_CALLBACK&mode=json&cnt='+ $scope.days +'&q=' + $scope.city).
    then(function(response){
        $scope.weatherResult = response.data;
        console.table($scope.weatherResult.list);
    }, function(response){
        console.log('something went wrong', response);
    });
}]);

// SERVICES
app.service('cityService', function(){
    this.city = "Bangalore";
});

// DIRECTIVES
app.directive('weatherReport', function(){
    return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'templates/forecast-elt.html',
        scope: {
            'report': '=',
            'toStdTemperature': '&'
        }
    };
});

// CONFIGURATIONS
app.config(function($routeProvider, $locationProvider){
    $routeProvider
        .when('/', {controller: 'weatherCtrl', templateUrl: 'templates/weather.html'})
        .when('/forecast', {controller: 'forecastCtrl', templateUrl: 'templates/weather-forecast.html'})
        .when('/forecast/:days', {controller: 'forecastCtrl', templateUrl: 'templates/weather-forecast.html'});

    // $locationProvider.html5Mode(true);
});
