document.addEventListener('DOMContentLoaded', start);

function start() {
  emmitEvent();
};

function autocompleteRequest(event) {
  event.preventDefault();
  const value = event.target.value;
  if (value.length > 2) {
    getSuggestions (value);
  }
};

function emmitEvent() {
  const input = document.querySelector('.js-input');
  const counts = [].slice.call(document.querySelectorAll('.js-forecast-count'));
  input.addEventListener('input', autocompleteRequest);

  counts.forEach(count => {
    count.addEventListener('change', () => {
      if (input.value.length > 2) {
        getForeCast(input.value);
      }
    });
  });
};

function httpRequest(url, callback) {
  let httpRequest = false;

  if (window.XMLHttpRequest) { // Mozilla, Safari, ...
    httpRequest = new XMLHttpRequest();
    if (httpRequest.overrideMimeType) {
      httpRequest.overrideMimeType('text/xml');
    }
  }
  else if (window.ActiveXObject) { // IE
    try {
      httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
    }
    catch (e) {
      try {
        httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
      }
      catch (e) {}
    }
  }

  if (!httpRequest) {
    console.log('Не вышло :( Невозможно создать экземпляр класса XMLHTTP ');
    return false;
  }

  httpRequest.open('GET', url, true);
  httpRequest.send(null);

  httpRequest.onreadystatechange = function() {
    if(httpRequest.readyState === 4) {
      if(httpRequest.status === 200) {
        const response = JSON.parse(httpRequest.responseText);
        callback(response);
        console.log('hello');
      }
      else {
        console.log('An error occurred during your request: ' +  httpRequest.status + ' ' + httpRequest.statusText);
      }
    }
  }
};


function getSuggestions(value) {
  const url = `http://gd.geobytes.com/AutoCompleteCity?q=${value}`;

  httpRequest(url, renderSuggestions);
};

function getSuggestionItem(event) {
  const target = event.target;

  if (target.nodeName === 'LI') {
    setSuggestionValue(target.innerText);
  }
};

function renderSuggestions (cities) {
  const suggestions = document.querySelector('.js-suggestions');
  const ul = document.createElement('ul');
  ul.className = 'suggestions';
  if (cities.length <= 0 || cities[0] === '') {
    suggestions.innerHTML = '<li class="error">No cities found</li>';

    return;
  }

  cities.forEach((el) => {
    const li = document.createElement('li');
    li.className = 'js-suggestions-item suggestions__item';
    li.innerText = el;
    ul.appendChild(li);
  });

  suggestions.innerHTML = ''
  suggestions.appendChild(ul);
  suggestions.removeEventListener('click', getSuggestionItem);
  suggestions.addEventListener('click', getSuggestionItem);
};

function setSuggestionValue(city) {
  const suggestions = document.querySelector('.js-suggestions');
  const input = suggestions.parentNode.querySelector('input');

  suggestions.innerHTML = '';
  input.value = city;

  getForeCast(city);
};

function getForeCast(city) {
  const suggestions = document.querySelector('.js-suggestions');
  const key = 'b84d6e69b39e4433a5ec8239e157c1d5';
  const form = suggestions.parentNode;
  const cnt = form.elements.count.value;
  const url = `//api.openweathermap.org/data/2.5/forecast/daily?appid=${key}&q=${city}&units=metric&cnt=${cnt}`;

  httpRequest(url, renderForecast)
  
  const interval = setInterval(function(){
    return httpRequest(url, renderForecast)
  }, 600000);
};

function renderForecast(forecast) {
  const ul = document.createElement('ul');
  ul.className = 'cubes';
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weatherForecast = document.querySelector('.forecast__result');

  const forecastList = forecast.list;
  forecastList.forEach((el) => {
    const li = document.createElement('li');
    li.className = 'js-forecast-item cube';
    const day = weekdays[new Date(el.dt*1000).getDay()];
    const dd = (new Date(el.dt*1000).getDate() < 10) ? '0' + new Date(el.dt*1000).getDate() : new Date(el.dt*1000).getDate();
    const mm = (new Date(el.dt*1000).getMonth() < 10) ? '0' + new Date(el.dt*1000).getMonth() : new Date(el.dt*1000).getMonth();
    const date = dd + '.' + mm;
    const description = el.weather[0].main;
    const temp = el.temp.day.toFixed();
    const icon = el.weather[0].icon;
    const template = `<div class="cube__content">
        <span class="day">${date} / ${day}</span>
        <svg class="svg-icon is-${icon}">
          <use xlink:href="#${icon}" />
        </svg>
        <span class="day">${temp}&deg;C / ${description}</span>
      </div>`;

    li.innerHTML = template;
    ul.appendChild(li);
  });

  weatherForecast.innerHTML = '';
  weatherForecast.appendChild(ul);
};
