import { refs } from '../references/refs';
import { PAGE_TYPE, readState } from '../base/state';
import images from '../../images/plug/notfound.jpg';
import { isInteger } from 'lodash';

function renderGallery(data) {
  if (data === null || data.length === 0) {
    const plugMarkup = `
      <img src="${images}" alt="Nothing was found" width="240px" class="plug_image">
      <h2 class="plug_title">Opps! There is nothing to show you</h2>`;
    refs.gallery.innerHTML = '';
    refs.plug.innerHTML = plugMarkup;
    return;
  }
  const markup = data
    .map(({ id, poster_path, title, genres, vote_average, release_date = '' }) => {
      if (genres.length > 2) {
        genres = genres.slice(0, 2);
      }
      if (isInteger(vote_average)) {
        vote_average = vote_average + '.0';
      }
      const posterPath = !poster_path ? images : `https://image.tmdb.org/t/p/w500${poster_path}`;
      const genreStr = genres.map(genre => genre.name).join(', ');
      if (readState().pageType === PAGE_TYPE.TRENDS) {
        return `
        <li class="gallery__item" data-id="${id}">
        <a href="#">
          <div class="wrapper">
            <img class="gallery__image" src="${posterPath}" alt="${title}" />
          </div>
          <div class="description">
            <h2 class="gallery__title">${title}</h2>
            <p class="gallery__genre">${genreStr} | ${release_date.substr(0, 4)}<span class="gallery__raiting">${round(vote_average, 1)}</span></p>
          </div>
        </a>
      </li>`;
      }

      return `
      <li class="gallery__item" data-id="${id}">
  <a href="">
    <div class="wrapper">
      <img class="gallery__image" src="${posterPath}" alt="${title}" />
    </div>
    <div class="description">
      <h2 class="gallery__title">${title}</h2>
      <p class="gallery__genre">${genreStr} | ${release_date.substr(
        0,
        4,
      )}<span class="gallery__raiting">${round(vote_average, 1)}</span>
      </p>
    </div>
  </a>
</li>`;
    })
    .join('');
  refs.plug.innerHTML = '';
  refs.gallery.innerHTML = markup;
}

function round(value, precision) {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

export { renderGallery };
