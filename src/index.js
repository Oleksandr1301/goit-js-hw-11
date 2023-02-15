import Notiflix from 'notiflix';

import SimpleLightbox from "simplelightbox";

import "simplelightbox/dist/simple-lightbox.min.css";

let gallery = new SimpleLightbox('.gallery', {
    captionDelay: 250,
    captionsData: "alt"
});