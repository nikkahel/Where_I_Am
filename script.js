'use strict';

const btn = document.querySelector('.btn-country');
const textWindow = document.querySelector('.country');
const countriesContainer = document.querySelector('.countries');
const render = function (data, className = '') {
  const html = `
      <article class="country ${className}">
        <img class="country__img" src="${data.flag}" />
        <div class="country__data">
        <h3 class="country__name">${data.name}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${(
          +data.population / 1000000
        ).toFixed(1)} millon people</p>
        <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
        <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
        <p class="country__row"><span>🗺️</span>${data.area} km</p>
        </div>
            </article>
      `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

const errMsg = function (msg) {
  countriesContainer.insertAdjacentText('afterbegin', msg);
  countriesContainer.style.opacity = 1;
};

const getJSON = function (url, errorMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);

    return response.json();
  });
};

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

//

const whereIam = async function () {
  try {
    const geo = await getPosition();
    const { latitude, longitude } = geo.coords;
    const geoPos = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    if (!geoPos) throw new Error(`Can't take geo`);
    const geoPosJson = await geoPos.json();
    const res = await fetch(
      `https://restcountries.com/v2/name/${geoPosJson.countryName}`
    );
    const [data] = await res.json();
    render(data);
    return `You are in ${geoPosJson.city}, ${geoPosJson.countryName}`;
  } catch (err) {
    alert(err.message);
    // throw to get value
    throw err;
  }
};
btn.addEventListener('click', whereIam);
