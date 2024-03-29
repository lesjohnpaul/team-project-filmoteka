import { checkIdInLocalStorage, LS_KEY_TYPE } from '../utils/localStorage';
import { refs } from '../references/refs';
import { readState } from '../base/state';
import { onModalBtnWatchedClick, onModalBtnQueueClick } from '../base/handlers';
import {
  switchToNextFilmInGallery,
  switchToPrevFilmInGallery,
} from '../utils/modalFilmSwitcher';
import { setModalSwitchBtnAvailability } from '../utils/modalFilmSwitcher';
import poster from '../../images/plug/notfound.jpg';
import * as basicLightbox from 'basiclightbox';
import { onfetchTrailers } from '../api/api-service';

function renderFilmModal(data) {
  const {
    original_title,
    genres,
    poster_path,
    overview,
    popularity,
    vote_average,
    vote_count,
  } = data.data;
  const genreStr = genres.map(genre => genre.name).join(', ');
  const posterPath = !poster_path
    ? poster
    : `https://image.tmdb.org/t/p/w500${poster_path}`;
  const markup = `
  <div class="modal_film_card">

        <div class="modal__wrapper">
       
          <div class="modal__image-wrapper">
              <img class="modal__image" src="${posterPath}" alt="${original_title}" height="531" />
              <button type="button" class="button open-trailer">
                <span class="open-trailer__icon"> </span>
              </button>     
          </div>
          <div class="modal__info-wrapper">
            <h2 class="modal__film-titel">${original_title}</h2>
            <table>
              <tr class="modal__param">
                <td class="modal__param-titel">Vote / Votes</td>
                <td class="modal__param-value">
                  <div class="modal__film-votes">
                    <span class="param__value-vote">${Number(
                      vote_average.toFixed(1)
                    )}</span> /
                    <span class="param__value-votes">${vote_count}</span>
                  </div>
                </td>
              </tr>
              <tr class="modal__param">
                <td class="modal__param-titel">Popularity</td>
                <td class="modal__param-value">${Math.round(popularity)}</td>
              </tr>
              <tr class="modal__param">
                <td class="modal__param-titel">Original Title</td>
                <td class="modal__param-value">${original_title}</td>
              </tr>
              <tr class="modal__param">
                <td class="modal__param-titel">Genre</td>
                <td class="modal__param-value">${genreStr}</td>
              </tr>
            </table>
            <span class="modal__film-owervier">ABOUT</span>
            <div class="film__owervier">
              <p class="modal__film-owervier-text">
                ${overview}
              </p>
            </div>
            <div class="modal__buttons">
              <button name="modalBtnWatched" type="submit" class="modal__button watched checked">
                <span name="modalBtnWatchedTextField" class="add-button-watched-text">ADD TO WATCHED</span>
              </button>
              <button name="modalBtnQueue" type="submit" class="modal__button queue checked">
                <span name="modalBtnQueueTextField" class="add-button-queue-text">ADD TO QUEUE</span>
              </button>
            </div>
            <div class="modal__arrow">
               <button name="modalBtnPrev" class="modal__arrow-btn" type="button"><span class="modal__arrow-image-left"></span></button>
               <button name="modalBtnNext" class="modal__arrow-btn" type="button"><span class="modal__arrow-image-right"></span></button>
            </div>
          </div>
        </div>
      </div>
    `;
  refs.modalContent.innerHTML = markup;
  checkStorageStatusOfFilm();
  setModalSwitchBtnAvailability();

  const trailerBtn = document
    .querySelector('.open-trailer')
    .addEventListener('click', async () => {
      try {
        console.log('modal clicked');
        const trailerData = await onfetchTrailers(Number(data.data.id));
        const videoKey = trailerData.results[0].key;
        const videoUrl = `https://www.youtube.com/embed/${videoKey}?autoplay=1`;

        // Create and open a basicLightbox with the YouTube video iframe
        const videoModal = basicLightbox.create(`
            <div class="modal-trailer__backdrop">
                <div class"modal-trailer__wrapper>
                  <button class="close-btn">
                  </button>
                  <iframe class="iframe" width="640" height="480" frameborder="0" allowfullscreen allow='autoplay' src="${videoUrl}"></iframe>
                </div>
            </div>`);

        videoModal.show();

        const closeModalButt = document.querySelector('.close_modal_butt');
        closeModalButt.addEventListener('click', () => {
          console.log('modal clicked');
          videoModal.close();
        });

        // Close modal when close button is clicked
        const closeBtn = videoModal.element().querySelector('.close-btn');
        closeBtn.addEventListener('click', () => {
          videoModal.close();
        });

        // Close modal when Escape key is pressed
        const closeOnEscape = event => {
          if (event.key === 'Escape') {
            videoModal.close();
          }
        };
        window.addEventListener('keydown', closeOnEscape);

        // Remove event listeners when modal is closed
        videoModal.on('closed', () => {
          window.removeEventListener('keydown', closeOnEscape);
        });
      } catch (error) {
        console.error('Error fetching trailers:', error.message);
      }
    });
}

function checkStorageStatusOfFilm() {
  const filmId = readState().modalFilmId;
  let isInWatched = checkIdInLocalStorage(filmId, LS_KEY_TYPE.WATCHED);
  let isInQueue = checkIdInLocalStorage(filmId, LS_KEY_TYPE.QUEUE);
  const watchedBtnText = isInWatched ? 'REMOVE FROM WATCHED' : 'ADD TO WATCHED';
  const queueBtnText = isInQueue ? 'REMOVE FROM QUEUE' : 'ADD TO QUEUE';
  refs.modalBtnWatchedTextField[0].textContent = watchedBtnText;
  refs.modalBtnQueueTextField[0].textContent = queueBtnText;
  isInWatched
    ? refs.modalBtnWatched[0].classList.remove('checked')
    : refs.modalBtnWatched[0].classList.add('checked');
  isInQueue
    ? refs.modalBtnQueue[0].classList.remove('checked')
    : refs.modalBtnQueue[0].classList.add('checked');
}

function addModalBtnListeners() {
  refs.modalBtnWatched[0].addEventListener('click', onModalBtnWatchedClick);
  refs.modalBtnQueue[0].addEventListener('click', onModalBtnQueueClick);
  refs.modalBtnNext[0].addEventListener('click', switchToNextFilmInGallery);
  refs.modalBtnPrev[0].addEventListener('click', switchToPrevFilmInGallery);
}

function removeModalBtnListeners() {
  refs.modalBtnWatched[0].removeEventListener('click', onModalBtnWatchedClick);
  refs.modalBtnQueue[0].removeEventListener('click', onModalBtnQueueClick);
  refs.modalBtnNext[0].removeEventListener('click', switchToNextFilmInGallery);
  refs.modalBtnPrev[0].removeEventListener('click', switchToPrevFilmInGallery);
}

export {
  renderFilmModal,
  checkStorageStatusOfFilm,
  removeModalBtnListeners,
  addModalBtnListeners,
};
