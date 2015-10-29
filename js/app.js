/**
 * Created by Owain on 27/09/15.
 */

var app = angular.module('app', [
    'ngMaterial',
    'ngAria',
    'ngMap',
    'ngMessages'
]);

app.directive('bpbioEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if(event.which === 13) {
                scope.$apply(function() {
                    scope.$eval(attrs.bpbioEnter, {'event': event});
                });

                event.preventDefault();
            }
        });
    };
});

app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('pink')
        .accentPalette('blue');
});

app.directive('bpbioQuiz', function(quizFactory) {
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

                scope.score = 0;
                scope.reason = -1;

                scope.getQuestion();
            };

            scope.reset = function() {
                scope.inProgress = false;
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

                    var str = "Beste ";
                    str += scope.name + ", ";

                    if (scope.reason == 1 || scope.reason == 3) {
                        scope.extra_info = false;

                        if (scope.reason == 1) {
                            // 1 = te lage voor opleiding EN te jong
                            str += "helaas kan je deze opleiding niet volgen omdat je vooropleiding niet voldoet aan de toelatings eisen. ";
                        } else if (scope.reason == 3) {
                            // 3 = geen vooropleiding EN te jong
                            str += "helaas kan je deze opleiding niet volgen zonder een vooropleiding gedaan te hebben. ";
                        }

                        str += "Over ";
                        str += 21 - scope.age;
                        str += " jaar als je 21 bent zou je een toelatings toets kunnen doen waardoor je alsnog aangenomen zou kunnen worden. "
                    } else {
                        scope.extra_info = true;

                        if (scope.id == 2 || scope.id == 4) {
                            if (scope.id == 2) {
                                str += "Aangezien je vooropleiding niet aan de eisen voldoet zou je deze opleiding eigenlijk niet kunnen volgen. "
                            } else if (scope.id = 4) {
                                str += "Aangezien je geen opleiding hiervoor hebt gedaan zou je deze opleiding eigenlijk niet kunnen volgen. "
                            }

                            str += "Maar aangezien je " + scope.age + " jaar oud bent kan je een toelatings toets doen waardoor je alsnog anagenomen zou kunnen worden. "
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
                            // Ga een andere opleiding volgen en ga weg hier
                            str += "Aan de hand van jouw antwoorden lijkt deze opleiding totaal niet geschikt voor jou. Je zou langs kunnen komen op de één van de open dagen en je in kunnen schrijven voor het proefstuderen maar een andere opleiding zou waarschijnlijk beter bij je passen."
                        } else if (scope.score >= 11 && scope.score <= 17) {
                            // Niet echt jou ding
                            str += "Aan de hand van jouw antwoorden lijkt deze opleiding niet echt voor jou weggelegd te zijn. Je zou langs kunnen komen op één van de open dagen en je in kunnen schrijven voor het proefstuderen maar een andere opleiding zou waarschijnlijk beter bij je passen."
                        } else if (scope.score >= 18 && scope.score <= 23) {
                            // Misschien iets voor jou misschien even naar de opendag gaan en inschrijven voor proefstuderen
                            str += "Aan de hand van jouw antwoorden kan deze opleiding misschien wat voor jou zijn of misschien niet. Je zou een keer langs kunnen komen op één van de open dagen dan kan je beter zien wat de opleiding bio-infomatica inhoudt."
                        } else if (scope.score >= 24 && scope.score <= 29) {
                            // Ik zou sowieso even naar de open dag gaan en je zeker voor proefstuderen inschrijven want wij denken dat dit echt iets voor jou kan zijn
                            str += "Aan de hand van jou antwoorden lijkt deze opleiding best wel geschikt voor jou. Kom een keer langs op één van de open dagen en je zou je in kunnen schrijven voor proefstuderen dan kan je een dagje mee lopen met bio-infomatice studenten. Zo kan je beter inschatten of deze opleiding wat voor jou zou kunnen zijn."
                        } else if (scope.score == 30) {
                            // Echt jou ding
                            str += "Aan de hand van jouw antwoorden lijkt deze opleiding helemaal voor jou weggelegd te zijn! Kom eens een keer lang op één van de open dagen en schrijf je in voor het proefstuderen dan kan je een dagje meelopen met bio-informatica studenten."
                        }
                    }

                    scope.result = str;
                }
            };

            scope.checkAnswer = function() {
                switch(scope.id) {
                    case 0:
                        if (scope.name.length > 0) {
                            scope.nextQuestion();
                        }
                        break;

                    case 1:
                        if (scope.age.length > 0 && scope.age.length < 3 && !isNaN(scope.age)) {
                            scope.nextQuestion();
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
                        if (scope.value == 3) {
                            scope.nextQuestion(4)
                        } else if (scope.value == 0) {
                            break;
                        } else {
                            scope.nextQuestion(6);
                        }
                        break;

                    case 4:
                        if (scope.value == 3) {
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

app.controller('aboutCtrl', function($scope) {
    $scope.people = [{
        name: "Owain van Brakel",
        image: "/img/about/Owain.jpg",
        info: "Vanaf de middelbare school heb ik vakken zoals biologie en scheikunde altijd leuk gevonden. Ik had alleen besloten dat ik liever met m’n handen wilde werken waardoor ik uiteindelijk heb gekozen voor de richting elektrotechniek wat ik ook heel erg leuk vond. Na de middelbare school ben ik doorgestroomd naar mediatechnologie mbo-niveau 4 op het Grafisch Lyceum te Rotterdam, dit viel zacht gezegd heel erg tegen. Alhoewel ik websites en applicaties ontwikkelen wel heel erg leuk vond. Uiteindelijk hebben we op school alleen de basis dingen geleerd en kwam het erop neer dat we zelf alles maar moesten uitzoeken als we meer wilde leren. Met tegenzin heb ik alsnog de opleiding afgemaakt omdat ik het zonde vond om af te haken. Vervolgens ben ik op zoek gegaan naar een hbo-opleiding in de informatica richting. Toen kwam ik erachter dat alle opleidingen van de reguliere informatica mij eigenlijk niet echt interesseerde of dat ik er eigenlijk weinig zou gaan leren door de vooropleiding die ik heb  gevolgd heb. Uiteindelijk kwam ik er op de site van de hogeschool Leiden achter dat er ook een opleiding bio-informatica bestond. Hier heb ik vervolgens meer informatie over opgezocht en vanaf dat moment was de knoop eigenlijk snel doorgehakt aangezien alles wat de opleiding biedt mij wel interesseert."
    }, {
        name: "Jeroen Roos",
        image: "/img/about/Jeroen.jpg",
        info: "Biologie en scheikunde vind ik allebei erg interessant. Het waren mijn beste vak op de middelbare school. Toen ik een opleiding moest gaan kiezen had ik werkelijk geen idee wat ik wilde. Ik zat er aan te denken om nog mijn VWO diploma te halen om de studie te gaan doen die ik altijd al zou willen doen. Dat werd mij afgeraden en toen ben ik maar gewoon door gaan zoeken. Toen hoorde ik van bio-informatica en ging ik kijken wat het inhield. Biologie en scheikunde waren geen probleem voor mij, en een beetje prutsen met computers doe ik wel vaker (niet geheel zonder allemaal dingen te slopen of te laten crashen). Dus het leek me vrij snel al geschikt voor mij. Ik heb me ingeschreven en heb daar tot nu toe zeker nog geen spijt van!"
    }, {
        name: "Shameer Khan",
        image: "http://lorempixel.com/1000/1000/cats?cache=2",
        info: "Lorum ipsum"
    }, {
        name: "Martijn Bakker",
        image: "/img/about/Martijn.jpg",
        info: "Wat ik tot nu toe van de opleiding vind? Ik vind de opleiding erg meevallen. Misschien een beetje een groot woord maar tot nu toe heb ik pas drie vakken gehad. Scheikunde, Biologie en programmeren. Daarnaast heb ik wel ook een project lopen. Tot nu toe pik ik alles redelijk goed op. Al merk ik wel dat biologie wat lastiger word. Programmeren is voor mij helemaal nieuw maar ik krijg genoeg begeleiding waardoor ik dit ook begin te begrijpen. Programmeren is wel een vak dat je bij moet houden, oefenen, oefenen en nog eens oefenen. Maar tot nu toe vind ik de opleiding erg leuk en is het allemaal goed te doen."
    }, {
        name: "Leon Landwaart",
        image: "http://lorempixel.com/1000/1000/cats?cache=4",
        info: "Lorum ipsum"
    }];
});

app.controller('contactCtrl', function($scope, $mdToast) {
    $scope.contact = {
        name: "",
        email: "",
        message: ""
    };

    $scope.sendMessage = function() {
        var error = false;
        var string = "";

        if ($scope.contact.name == "") {
            error = true;
            string += "naam";
        }
        if ($scope.contact.email == "") {
            error = true;
            if (string.length > 0) {
                string += ", ";
            }
            string += "email";
        }
        if ($scope.contact.message == "") {
            error = true;
            if (string.length > 0) {
                string += ", ";
            }
            string += "bericht";
        }

        if (error) {
            $mdToast.show($mdToast.simple().content("U heeft geen of geen geldige " + string + " ingevuld!").position('top right'));
        } else {
            $mdToast.show($mdToast.simple().content('Uw bericht is verzonden!').position('top right'));

            $scope.contact = {
                name: "",
                email: "",
                message: ""
            };
        }
    };
});
