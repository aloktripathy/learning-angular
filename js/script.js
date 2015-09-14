var app = angular.module('myApp', ['ngRoute']);

var controller = app.controller('twitterCtrl', ["$scope", function($scope){
    $scope.handle = "";
    $scope.twitter_handle = null;

    //watch the model 'handle'
    $scope.$watch('handle', function(new_val, old_val){
        $scope.handle_disabled = !new_val.trim().length;
        $scope.twitter_handle = new_val.toUpperCase().replace(/[^\w]+/g, ' ').trim().replace(/[\s]+/g, '-');
    });

    setInterval(function(){
        var handles = ['donald', 'trump', 'emrata', 'aloktr', 'realdonaldtrump', 'andrew'];
        // use $apply to execute an expression from outside Angular Framework
        $scope.$apply(function(){
            $scope.handle = handles[ Math.round( Math.random() * 1000 ) % handles.length ];
        });
    }, 2000);
}]);

// REPEATING/ WATCHING
var ctrl2 = app.controller('usernameValidatorCtrl', ['$scope', '$http', function($scope, $http){
    $scope.username = '';
    $scope.rules = [
        {
            text: 'Should be atleast 5 character long',
            rule: /.{5,}/,
            passing: false
        },
        {
            text: 'Should be at most 12 characters long',
            rule: /^.{1,12}$/,
            passing: false
        },
        {
            text: 'Should contain atleast atleast one number',
            rule: /\d+/,
            passing: false
        },
        {
            text: 'Should start with a character',
            rule: /^\w/,
            passing: false
        },
        {
            text: 'Should contain atleast one special character [! @ # % ^ & * < > { }]',
            rule: /[!@#%\^&*<>{}$\|]+/,
            passing: false
        },
        {
            text: 'Should contain atleast one uppercase character',
            rule: /[A-Z]/,
            passing: false
        }
    ]

    //check rules through $watch as username gets updated
    $scope.$watch('username', function(new_val, old_val){
        $scope.rules.forEach(function(v, k, a){
            a[k].passing = $scope.username.search(v.rule) + 1 > 0;    // search returns index on positive match or -1 in case not found
        });
        console.log($scope.rules);
    });
}]);


// ROUTING / TEMPLATING
app.config(function($routeProvider, $locationProvider){
    $routeProvider
    .when('/fruits', {
        templateUrl: '/templates/1.html',
        controller: 'routingCtrl'
    });

    // USE THE AWESOMENESS OF HTML5 HISTORY API
    $locationProvider.html5Mode(true);
});


// WRITTING CUSTOM SERVICES (Singleton)
app.service('alok', function(){
    this.name = 'Alok Tripathy';
    var self = this;
    this.jumbled_up = function(){
        return self.name.split('');
    }();
    this.counter = 0;
    setInterval(function(){self.counter++;}, 1000);
});

var ctrl3 = app.controller('routingCtrl', ['$scope', '$location', '$http', 'alok', function($scope, $location, $http, alok){
    $scope.fruits = ['apple', 'banana', 'coconut', 'date', 'endive', 'grapes', 'jojoba', 'kokum', 'leechi', 'mango', 'orange', 'pineapple', 'strawberry'];
    console.log(alok.name);
    console.log(alok.jumbled_up);
    console.log(alok.counter);
}]);

// REDDIT STORIES
var ctrl4 = app.controller('redditCtrl', ["$scope", "$http", "$location", function($scope, $http, $location){
    $scope.topics = ["startups", "technology", "gadgets", "sports", "pics", "worldnews", "videos", "Music", "funny", "news", "movies", "books", "history", "food", "philosophy", "television", "Jokes", "Art", "space", "Documentaries", "Fitness"];
    $scope.current_topic = $scope.topics[0];

    $scope.fetchStories = function(topic){
        $http.get(getTopicUrl(topic)).
        then(function(response){ // success
            var data = response['data']['data']['children'];
            // console.log(data);
            data.sort(function(a, b){
                if(a.data.score > b.data.score)
                    return -1;
                else if(a.data.score < b.data.score)
                    return 1;
                else
                    return 0;
            });
            $scope.stories = data;

        }, function(response){  // failure
            console.error("Something went wrong");
        });
    }
    var getTopicUrl = function(topic){console.warn(topic);return 'https://www.reddit.com/r/' + topic + '/.json';}

    $scope.$watch('current_topic', function(new_val, old_val){
        $scope.fetchStories(new_val);
    });
}]);


// WRITTING CUSTOM DIRECTIVE
var dir1 = app.directive('searchResult', function(){
    return {
        restrict: 'AE',
        templateUrl: 'templates/search-result.html',
        replace: true,
        transclude: true,
        scope: {
            person: '=',                    // for two way bindings
            fAddress: '&'                   // for functions
        },
        /*
        compile: function(elt, attrs){
            console.log('Compiling...');
            //elt.removeAttr('class');        // elt is the element passed before compilation, i.e. making any changes to it changes the directives
            console.log('elt: ', elt);
            return {
                // pre: function(scope, elt, attrs){   // docs doesn't encourage using pre due to lack of consistency
                //     console.log('in pre...', elt);
                // },
                post: function(scope, elt, attrs){
                    console.log(scope);
                    if(scope.person.name == 'Alok Tripathy'){
                        elt[0].classList.add('red');
                    }
                },
            };
        },
        */
        link: function(scope, elt, attrs){      // this is a good shorthant to the above compile method in case you want to make calls only inside the post method keeping the rest of compile method clean
            console.log(scope);
            if(scope.person.name == 'Alok Tripathy'){
                elt[0].classList.add('red');
            }
        }
    };
});

// UDEMY
// THE ABOVE DIRECTIVE COMES UNDER THIS CONTROLLER
var ctrl5 = app.controller('searchCtrl', ['$scope', '$http', function($scope, $http){
    $scope.people = [];
    $scope.formattedAddress = function(person){
        return person.street + ', ' + person.city + '-' + person.zip + ', ' + person.state;
    };

    $http.get('data/people.json').
    then(function(response){
        $scope.people = response.data.slice(0, 3);
    }, function(){
        console.log('something wrong happened');
    });
}]);

var ctrl6 = app.controller('udemyCtrl', ['$scope', '$http', function($scope, $http){
    $scope.categories = ['Soft Skills', 'Management', 'Finance and Accounting', 'Marketing', 'Operations', 'Sales', 'Strategy', 'Design', 'Frontend Programming', 'Mobile Development', 'Backend Programming', 'Software and Systems', 'Data Science'];
    $scope.catalogue = [];
    $scope.normalize = function(str){return str.toLowerCase().replace(/\s/g, '-');};
    $scope.current_category = $scope.normalize($scope.categories[0]);
    $scope.format_number = function(n){return n > 1000 ? Math.round(n/100, 2)/10 + 'K' : n;};

    $scope.$watch('current_category', function(new_val, old_val){
        $http.get('data/udemy/' + new_val + '.json').
        then(function(response){
            debugger;
            $scope.catalogue = response.data.data.sort(function(a, b){
                var get_score = function(x){return x.avgRating * Math.log(x.numSubscribers) * Math.sqrt(x.numOfReviews);};
                var score1 = get_score(a);
                var score2 = get_score(b);
                if(score1 > score2) return -1;
                else if(score1 < score2) return 1;
                else return 0;
            });
            console.log($scope.catalogue);
        },
             function(response){
            console.log('Something went wrong', 'response');
        });
    });
}]);

// TIMER
var ctrl7 = app.controller('timerCtrl', ['$scope', function($scope){
    $scope.laps = [];
    $scope.isTimerRunning = false;
    $scope.clock = 0;
    $scope.currentLapClock = 0;

    var startTime = null;
    var previousLapClock = 0;
    var TIME_DELAY = 100;
    var interval = null;
    var offsetTime = 0;
    var timer = function(){
        $scope.$apply(function(){
            $scope.clock = new Date() - startTime + offsetTime;
            $scope.currentLapClock = $scope.clock - previousLapClock;
        });
    };
    $scope.$watch('laps', function(a, b){console.log(b, '->', a);});

    $scope.start = function(){
        $scope.isTimerRunning = true;
        startTime = new Date();
        interval = setInterval(timer, TIME_DELAY);
    };
    $scope.stop = function(){
        $scope.isTimerRunning = false;
        offsetTime = $scope.clock;
        clearInterval(interval);
    };
    $scope.reset = function(){
        $scope.laps.length = 0;
        $scope.clock = 0;
        $scope.currentLapClock = 0;
        startTime = null;
        offsetTime = 0;
        previousLapClock = 0;
    };
    $scope.nextLap = function(){
        $scope.laps.unshift($scope.currentLapClock);
        previousLapClock = $scope.clock;
        window.laps = $scope.laps;
    };

    $scope.toTime = function(time, showMs){
        var seconds = parseInt(time / 1000);
        var ms = parseInt( (time % 1000) / 100);
        var parts = [];
        var pad = function(t){t = '0' + t; return t.slice(-2);};
        if(seconds > 3600){
            parts.push( pad(parseInt(seconds/3600)) );
            seconds = seconds % 3600;
        }
        if(seconds > 60){
            parts.push( pad(parseInt(seconds/60)) );
            seconds = seconds % 60;
        }
        else{
            parts.push('00');
        }
        var s = showMs ? pad(seconds) + '.' + ms : pad(seconds);
        parts.push(s);
        return parts.join(':');
    };

    // KEYCODE TRACKING
    $(document).keyup(function(e){
        if(e.keyCode == 32 && $scope.isTimerRunning)
            $scope.nextLap();
    });
}]);

// UMONGO
