import Notiflix from 'notiflix';

import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';

import fetchImg from './fetchPhotos';

const searchForm = document.getElementById('search-form');
const searchInput = document.querySelector('input[type="text"]');
const submitEl = document.querySelector('button[type="submit"]');
const galleryEl = document.querySelector('.gallery');
const loadMoreEl = document.querySelector('.load-more');

let lightbox = new SimpleLightbox('.img a');
let pageNumber = 1;

searchForm.addEventListener('submit', onSubmitSearchForm);

async function onSubmitSearchForm(e) {
  e.preventDefault();
  cleanGallery();
  let inputValue = searchInput.value.trim();
  if (inputValue !== '') {
    fetchImg(inputValue, pageNumber).then(foundDate => {
      if (foundDate.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        loadMoreEl.classList.add('visually-hidden');
        return;
      } else if (foundDate.hits.length >= 40) {
        renderImadesList(foundDate.hits);

        Notiflix.Notify.success(
          `Hooray! We found ${foundDate.totalHits} images.`
        );
        lightbox.refresh();
        loadMoreEl.classList.remove('visually-hidden');
      } else if (foundDate.hits.length < 40) {
        renderImadesList(foundDate.hits);
        Notiflix.Notify.info(
          `We're sorry, but you've reached the end of search ${foundDate.totalHits} images.`
        );
        loadMoreEl.classList.add('visually-hidden');
        lightbox.refresh();
        return;
      }
    });
    // console.log(fetchImg());
  }
}

loadMoreEl.addEventListener('click', onClickLoadMoreBtn);

function onClickLoadMoreBtn() {
  pageNumber += 1;
  let inputValue = searchInput.value.trim();
  fetchImg(inputValue, pageNumber).then(foundDate => {
    renderImadesList(foundDate.hits);
    //  Notiflix.Notify.success(
    //           `Hooray! We found ${foundDate.totalHits} images.`
    //         );

    lightbox.refresh();

    if (foundDate.hits.length < 40) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      loadMoreEl.classList.add('visually-hidden');
      lightbox.refresh();
    }

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  });
}

function cleanGallery() {
  galleryEl.innerHTML = '';
  pageNumber = 1;
}

function renderImadesList(images) {
  const markup = images
    .map(img => {
      return ` <div class="img">
  <a href="${img.largeImageURL}" class='gallery__item'>
  <img class="gallery__image" src="${img.webformatURL}" alt="${img.tags}" title="${img.tags}" loading="lazy" /></a> 
  <div class="info">
           <p class="info-item">
    <b>Likes</b> <span class="info-item-api"> ${img.likes} </span>
</p>
            <p class="info-item">
                <b>Views</b> <span class="info-item-api">${img.views}</span>  
            </p>
            <p class="info-item">
                <b>Comments</b> <span class="info-item-api">${img.comments}</span>  
            </p>
            <p class="info-item">
                <b>Downloads</b> <span class="info-item-api">${img.downloads}</span> 
            </p>
        </div></div>`;
    })
    .join('');
  galleryEl.insertAdjacentHTML('beforeend', markup);
}
