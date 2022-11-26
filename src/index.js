import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const searchInput = document.querySelector('#search-box');
const countriesListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

function onInputChanged(e) {
  const searchText = e.target.value.trim();

  if (searchText.length === 0) {
    clearCountriesInfo();
    return;
  }

  fetchCountries(searchText)
    .then(countries => {
      if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }

      showInfo(countries);
    })
    .catch(() => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function clearCountriesInfo() {
  countriesListEl.innerHTML = '';
  countryInfoEl.innerHTML = '';
}

function showInfo(countries) {
  clearCountriesInfo();

  if (countries.length === 1) {
    const country = countries[0];

    const countryInfo = `
        <div class="country-detailed-info">
            <div>
                <img class="country-detailed-info__flag" src="${
                  country.flags.svg
                }">
                <span class="country-detailed-info__name">${
                  country.name.official
                }</span>  
            </div>
            <ul>
                <li>
                    <span class="country-detailed-info__prop">Capital:</span> ${country.capital.join(
                      ','
                    )}
                </li>
                <li>
                    <span class="country-detailed-info__prop">Population:</span> ${
                      country.population
                    }
                </li>
                <li>
                    <span class="country-detailed-info__prop">Languages:</span> ${Object.values(
                      country.languages
                    ).join(',')}
                </li>
            </div> 
        </div>
    `;

    countryInfoEl.insertAdjacentHTML('beforeend', countryInfo);
    return;
  }

  const countriesStrings = countries.map(
    country => `
        <li class="country-list-item">
            <img class="country-list-item__flag" src="${country.flags.svg}">
            <span class="country-list-item__name">${country.name.official}</span>  
        </li>
    `
  );

  countriesListEl.insertAdjacentHTML('beforeend', countriesStrings.join(''));
}

const onInputChangedDebounce = debounce(onInputChanged, DEBOUNCE_DELAY);

searchInput.addEventListener('input', onInputChangedDebounce);
