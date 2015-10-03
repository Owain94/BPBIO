/**
 * Created by Owain on 27/09/15.
 */

var app = angular.module('app', [
    'ngMaterial',
    'ngAria'
]);

app.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if(event.which === 13) {
                scope.$apply(function(){
                    scope.$eval(attrs.ngEnter, {'event': event});
                });

                event.preventDefault();
            }
        });
    };
});

app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('pink')
        .accentPalette('light-blue');
});

app.directive('quiz', function(quizFactory) {
    return {
        restrict: 'AE',
        scope: {},
        templateUrl: 'quiz.html',
        link: function(scope, elem, attrs) {
            scope.start = function() {
                scope.id = 0;

                scope.quizOver = false;
                scope.inProgress = true;

                scope.name = "";

                /*
                    1 = te lage voor opleiding EN te jong
                    2 = te lage vooropleiding maar wel 21 jaar of ouder
                    4 = geen vooropleiding maar wel 21 jaar of ouder

                */
                scope.reason = -1;

                scope.getQuestion();
            };

            scope.reset = function() {
                scope.inProgress = false;
                scope.score = 0;

                scope.name = "";
            };

            scope.getQuestion = function() {
                var q = quizFactory.getQuestion(scope.id);
                if (q) {
                    scope.question = q.question;
                    scope.options = q.options;
                    scope.answer = q.answer;

                    if (scope.id == 6 || scope.id == 7 || scope.id == 8 || scope.id == 9 || scope.id == 10 || scope.id == 11) {
                        scope.value = 1;
                    } else {
                        scope.value = 0
                    }


                } else {
                    scope.quizOver = true;

                    var str = "beste ";
                    str += scope.name+ ", ";

                    if (scope.reason == 1) {
                        // 1 = te lage voor opleiding EN te jong

                        str += "helaas kan je deze opleiding niet volgen omdat je vooropleiding niet voldoet aan de toelatings eisen. Over ";
                        str += 21 - scope.age;
                        str += " jaar als je 21 bent zou je een toelatings toets kunnen doen waardoor je alsnog aangenomen zou kunnen worden."
                    } else if (scope.reason == 3) {
                        // 3 = geen vooropleiding EN te jong

                        str += "helaas kan je deze opleiding niet volgen zonder een vooropleiding gedaan te hebben. Over ";
                        str += 21 - scope.age;
                        str += " jaar als je 21 bent zou je een toelatings toets kunnen doen waardoor je alsnog aangenomen zou kunnen worden."
                    }

                    /*
                     * Minimaal 6 punten
                     * Maximaal 30 punten
                     *
                     * 6  - 10
                     * 11 - 17
                     * 18 - 23
                     * 24 - 30
                     */

                    if (scope.score <= 10) {

                    } else if (scope.score >= 11 && scope.score <= 17) {

                    } else if (scope.score >= 18 && scope.score <= 23) {

                    } else if (scope.score >= 24 && scope.score <= 29) {

                    } else if (scope.score == 30) {

                    }


                    scope.result = str;
                }
            };

            scope.checkAnswer = function() {
                var name = $('#name').val();
                var age = $('#age').val();

                switch(scope.id) {
                    case 0:
                        if (name.length > 0) {
                            scope.name = name;
                            scope.nextQuestion();
                        }
                        break;

                    case 1:
                        if (age.length > 0) {
                            age = Number(age);
                            if (!isNaN(age)) {
                                scope.age = age;
                                scope.nextQuestion();
                            } else {

                            }
                        }
                        break;

                    case 2:
                        switch(scope.value) {
                            case 0:
                                break;

                            case 1: // VMBO
                                if (scope.age < 21) {
                                    scope.reason = 1;
                                    scope.nextQuestion(99);
                                } else {
                                    scope.reason = 2;
                                    scope.nextQuestion();
                                }
                                break;

                            case 2: // HAVO
                                scope.nextQuestion();
                                break;

                            case 3: // VWO
                                scope.nextQuestion(6);
                                break;

                            case 4: // MBO
                                scope.nextQuestion(5);
                                break;

                            case 5: // Geen van de bovenstaande
                                if (Number(scope.age) < 21) {
                                    scope.reason = 3;
                                    scope.nextQuestion(99);
                                } else {
                                    scope.reason = 1;
                                    scope.nextQuestion();
                                }
                                break;
                        }
                        break;

                    case 3:
                        if (scope.value == 2) {
                            if (scope.age < 21) {
                                scope.reason = 1;
                                scope.nextQuestion(99);
                            } else {
                                scope.reason = 2;
                                scope.nextQuestion(6);
                            }
                        } else if (scope.value == 0) {
                            break;
                        } else {
                            scope.nextQuestion(6);
                        }
                        break;

                    case 4:
                        if (scope.value == 2) {
                            if (scope.age < 21) {
                                scope.reason = 1;
                                scope.nextQuestion(99);
                            } else if (scope.value == 0) {
                                break;
                            } else {
                                scope.reason = 2;
                                scope.nextQuestion(6);
                            }
                        } else {
                            scope.nextQuestion(6);
                        }
                        break;

                    case 5:
                        if (scope.value == 4) {
                            scope.nextQuestion();
                        } else if (scope.value == 0) {
                            break;
                        } else {
                            if (scope.age < 21) {
                                scope.reason = 1;
                                scope.nextQuestion(99);
                            } else {
                                scope.reason = 2;
                                scope.nextQuestion();
                            }
                        }
                        break;

                    default:

                        if (scope.value != 0) {
                            scope.score += scope.value;
                            scope.nextQuestion();
                        }
                }
            };

            scope.nextQuestion = function(id) {
                if (typeof id === 'undefined') {
                    scope.id++;
                } else {
                    scope.id = id;
                }
                scope.getQuestion();
            };

            scope.reset();
        }
    }
});

app.factory('quizFactory', function() {
    var questions = [
        {
            // Vraag 0
            question: "Wat is je naam?"
        }, {
            // Vraag 1
            question: "Wat is je leeftijd?"
        }, {
            // Vraag 2
            question: "Wat voor diploma heb je?",
            options: [{
                answer: 'VMBO',
                value: 1
            }, {
                answer: 'HAVO',
                value: 2
            }, {
                answer: 'VWO',
                value: 3
            }, {
                answer: 'MBO',
                value: 4
            }, {
                answer: 'Geen van de bovenstaande',
                value: 5
            }]
        }, {

            // Vraag 3
            question: "Welk profiel had je?",
            options: [{
                answer: 'Natuur & Gezondheid (Profiel N&G) ',
                value: 1
            }, {
                answer: 'Natuur & Techniek (Profiel N&T)',
                value: 2
            }, {
                answer: 'Cultuur & Maatschappij (Profiel C&M)',
                value: 3
            }, {
                answer: 'Economie & Maatschappij (Profiel E&M)',
                value: 4
            }]
        }, {

            // Vraag 4
            question: "Heb je wiskunde A of wiskunde B gevolgd?",
            options: [{
                answer: 'Ja',
                value: 1
            }, {
                answer: 'Nee',
                value: 2
            }]
        }, {

            // Vraag 5
            question: "Welk niveau heb je afgerond??",
            options: [{
                answer: 'MBO niveau 1',
                value: 1
            },{
                answer: 'MBO niveau 2',
                value: 2
            }, {
                answer: 'MBO niveau 3',
                value: 3
            }, {
                answer: 'MBO niveau 4',
                value: 4
            }]
        }, {
            // vraag 6
            question: "Hoe leuk vind jij biologie? (1-5)"
        }, {
            // vraag 7
            question: "Hoe leuk vind jij scheikunde? (1-5)"
        }, {
            // vraag 8
            question: "Hoe leuk vind jij het om samen te werken met andere? (1-5)"
        }, {
            // vraag 9
            question: "Hoe leuk lijkt het jou om zelf applicaties te ontwikkelen die bijvoorbeeld data verwerken? (1-5)"
        }, {
            // vraag 10
            question: "Hoe leuk vind jij het om moeilijke puzzels te ontrafelen? (1-5)"
        }, {
            // vraag 11
            question: "Hoe creatief vind jij jezelf in bijvoorbeeld het oplossen van problemen? (1-5)"
        }
    ];

    return {
        getQuestion: function(id) {
            if (id < questions.length) {
                return questions[id];
            } else {
                return false;
            }
        }
    };
});

app.controller('aboutCtrl', ['$scope', function($scope) {
    $scope.people = [{
        name: "Owain van Brakel",
        image: "http://lorempixel.com/300/300/cats",
        story: "Lorum ipsum"
    }, {
        name: "Jeroen Roos",
        image: "http://lorempixel.com/300/300/cats",
        story: "Lorum ipsum"
    }, {
        name: "Shameer Khan",
        image: "http://lorempixel.com/300/300/cats",
        story: "Lorum ipsum"
    }, {
        name: "Martijn Bakker",
        image: "http://lorempixel.com/300/300/cats",
        story: "Lorum ipsum"
    }, {
        name: "Leon Landwaart",
        image: "http://lorempixel.com/300/300/cats",
        story: "Lorum ipsum"
    }];
}]);