/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


document.addEventListener('DOMContentLoaded', start);

function start() {
  emmitEvent();
}

function autocompleteRequest(event) {
  event.preventDefault();
  var value = event.target.value;
  if (value.length > 2) {
    getSuggestions(value);
  }
}

function emmitEvent() {
  var input = document.querySelector('.js-input');
  var counts = [].slice.call(document.querySelectorAll('.js-forecast-count'));
  input.addEventListener('input', autocompleteRequest);

  counts.forEach(function (count) {
    count.addEventListener('change', function () {
      if (input.value.length > 2) {
        getForeCast(input.value);
      }
    });
  });
}

function httpRequest(url, callback) {
  var httpRequest = false;

  if (window.XMLHttpRequest) {
    // Mozilla, Safari, ...
    httpRequest = new XMLHttpRequest();
    if (httpRequest.overrideMimeType) {
      httpRequest.overrideMimeType('text/xml');
    }
  } else if (window.ActiveXObject) {
    // IE
    try {
      httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
      try {
        httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {}
    }
  }

  if (!httpRequest) {
    console.log('Не вышло :( Невозможно создать экземпляр класса XMLHTTP ');
    return false;
  }

  httpRequest.open('GET', url, true);
  httpRequest.send(null);

  httpRequest.onreadystatechange = function () {
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {
        var response = JSON.parse(httpRequest.responseText);
        callback(response);
      } else {
        console.log('An error occurred during your request: ' + httpRequest.status + ' ' + httpRequest.statusText);
      }
    }
  };
}

function getSuggestions(value) {
  var url = 'http://gd.geobytes.com/AutoCompleteCity?q=' + value;

  httpRequest(url, renderSuggestions);
}

function getSuggestionItem(event) {
  var target = event.target;

  if (target.nodeName === 'LI') {
    setSuggestionValue(target.innerText);
  }
}

function renderSuggestions(cities) {
  var suggestions = document.querySelector('.js-suggestions');
  var ul = document.createElement('ul');
  ul.className = 'suggestions';
  if (cities.length <= 0 || cities[0] === '') {
    suggestions.innerHTML = '<li>No cities found</li>';

    return;
  }

  cities.forEach(function (el) {
    var li = document.createElement('li');
    li.className = 'js-suggestions-item suggestions__item';
    li.innerText = el;
    ul.appendChild(li);
  });

  suggestions.innerHTML = '';
  suggestions.appendChild(ul);
  suggestions.removeEventListener('click', getSuggestionItem);
  suggestions.addEventListener('click', getSuggestionItem);
}

function setSuggestionValue(city) {
  var suggestions = document.querySelector('.js-suggestions');
  var input = suggestions.parentNode.querySelector('input');

  suggestions.innerHTML = '';
  input.value = city;

  getForeCast(city);
}

function getForeCast(city) {
  var suggestions = document.querySelector('.js-suggestions');
  var key = 'b84d6e69b39e4433a5ec8239e157c1d5';
  var form = suggestions.parentNode;
  var cnt = form.elements.count.value;
  var url = '//api.openweathermap.org/data/2.5/forecast/daily?appid=' + key + '&q=' + city + '&units=metric&cnt=' + cnt;

  httpRequest(url, renderForecast);
}

function renderForecast(forecast) {
  var ul = document.createElement('ul');
  ul.className = 'cubes';
  var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var weatherForecast = document.querySelector('.forecast__result');

  var forecastList = forecast.list;
  forecastList.forEach(function (el) {
    var li = document.createElement('li');
    li.className = 'js-forecast-item cube';
    var day = weekdays[new Date(el.dt * 1000).getDay()];
    var temp = el.temp.day.toFixed();
    var icon = el.weather[0].icon;
    var template = '<div class="cube__content">\n        <svg class="svg-icon is-' + icon + '">\n          <use xlink:href="#' + icon + '" />\n        </svg>\n        <span class="day">' + day + ' / ' + temp + '&deg;</p>\n      </div>';

    li.innerHTML = template;
    ul.appendChild(li);
  });

  weatherForecast.innerHTML = '';
  weatherForecast.appendChild(ul);
}

/***/ })
/******/ ]);