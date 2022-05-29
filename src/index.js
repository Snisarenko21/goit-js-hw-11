import './sass/main.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { axiosPixabay } from './axiosPixabay';
import ImageApiService from './axiosPixabay';

const refs = {
  form: document.querySelector('#search-form'),
  submitBtn: document.querySelector('#search-form button'),
  galleryEl: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};
// === оформление элементов ====
refs.form.style =
  'background-color: #4056b4; display: flex; justify-content: center; padding: 8px; margin-bottom: 8px; position: fixed; top: 0; z-index: 99; width: 100%';
refs.submitBtn.style = 'margin-left: 32px';
refs.loadMoreBtn.style.display = 'none';

// ==== повесили слушатель события  на форму для ввода на событие сабмит ===
refs.form.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreClick);

//==== создаем экземпляр класса ===
const imageApiService = new ImageApiService();

//==== функция, которая рисует галлерею ====
function createImageEl(hits) {
  console.log(hits);
  const markup = hits
    .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      return `
          <a href="${largeImageURL}" class="photo-card">
           <img src="${webformatURL}" alt="${tags}" loading = "lazy"  class="photo-image" />
           <div class="info" style= "display: flex">
              <p class="info-item">
                 <b>Likes:</b>${likes}
              </p>
              <p class="info-item">
                <b>Views: </b>${views}
              </p>
              <p class="info-item">
                <b>Comments: </b>${comments}
              </p>
              <p class="info-item">
                <b>Downloads: </b>${downloads}
              </p>
            </div>
             </a> `;
    })
    .join('');

  refs.galleryEl.insertAdjacentHTML('beforeend', markup);

  // ==== вызываем библиотеку лайтбокс и скрол====
  simpleLightbox();
  scroll();
  // ==== показываем кнопку "загрузить еще" ====
  refs.loadMoreBtn.style =
    ' display: flex;  margin-left: auto;  margin-right: auto; margin-bottom:32px; margin-top:32px; padding:16px; border: 1px solid green; border-radius:8px; background-color: yellow';
}
// === асинхронная функция которая отправляет запрос при сабмите формы =====
async function onSubmit(e) {
  // ===== запрет браузеру на перезагрузку страницы ====
  e.preventDefault();
  imageApiService.searchQuery = e.currentTarget.elements.searchQuery.value;
  console.log(imageApiService.searchQuery);
  refs.loadMoreBtn.style.display = 'none';
  // ==== очищаем страницу перед новым запросом ====
  imageApiService.resetPage();
  try {
    if (imageApiService.searchQuery === '') {
      clearImagesContainer();
      Notify.warning('Enter your search query');
    } else {
      const response = await imageApiService.fetchPhotos();
      const {
        data: { hits, total, totalHits },
      } = response;
      clearImagesContainer();
      if (hits.length === 0) {
        Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      } else {
        Notify.success(`Hooray! We found ${totalHits} images.`);
        createImageEl(hits);
        refs.loadMoreBtn.style.display = 'block';
      }
    }
  } catch (error) {
    // === метод для обработки ошибки ====
    Notify.failure("We're sorry, but you've reached the end of search results.");
    console.log(error.message);
  }
}
// ==== ассинхронная функция, которая при клике по кнопке "загрузить еще " добавляет новые фото в галлерею ===
async function onLoadMoreClick(e) {
  // ===== запрет браузеру на перезагрузку страницы ====
  e.preventDefault();

  const response = await imageApiService.fetchPhotos();
  const {
    data: { hits },
  } = response;
  if (hits.length < 40) {
    createImageEl(hits);
    refs.loadMoreBtn.style.display = 'none';
    Notify.failure("We're sorry, but you've reached the end of search results.");
  } else createImageEl(hits);
}
// === функция очищающая галлерею ====
function clearImagesContainer() {
  refs.galleryEl.innerHTML = '';
   refs.loadMoreBtn.style.display = 'none';
}
// ===функция, для плавного скрола, чтоб проскролить до конца страницы ===
function scroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function simpleLightbox() {
  let lightbox = new SimpleLightbox('.gallery a', {
    showCounter: false,
    enableKeyboard: true,
  });
  lightbox.refresh();
}