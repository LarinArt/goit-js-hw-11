import './sass/main.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import throttle from 'lodash.throttle';
import { fetchImgParams, searchImg } from './js/fetch-img';
import cardTpl from './templates/templates.hbs';
import { refs } from './js/constants';
import Notiflix from 'notiflix';

function renderCardImage(arr) {
    refs.gallery.insertAdjacentHTML('beforeend', cardTpl(arr));
}

async function generateMarkup() {
    try {
        const result = await searchImg();
        const images = result.data.hits;
        generateImagesMarkup(images);
    } catch (error) {
        Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
    }
}

function generateImagesMarkup(images) {
    renderCardImage(images);

    let lightbox = new SimpleLightbox('.gallery a', {
        captions: true,
        captionsData: 'alt',
        captionDelay: 250,
    });
    lightbox.refresh();
}

function totalHits(total) {
    if (total) {
        Notiflix.Notify.success(`Hooray! We found ${total} images.`);
    }
}

function onFormInput(e) {
    fetchImgParams.page = 1;
    fetchImgParams.q = e.target.value;
}

function onFormSubmit(e) {
    refs.gallery.innerHTML = '';
    e.preventDefault();
    generateMarkup();
    searchImg().then(({ data }) => totalHits(data.total));
}

function loadMore() {
    fetchImgParams.page += 1;
    generateMarkup();
}

function onObserver(entries) {
    entries.forEach(entry => {
        if (entry.intersectionRatio && fetchImgParams.q !== '') {
            loadMore();
        }
    });
};

const options = {
    rootMargin: '0px',
    threshold: 1.0,
};

const observer = new IntersectionObserver(onObserver, options);
observer.observe(refs.observe);

refs.searchInput.addEventListener('input', onFormInput);

refs.searchForm.addEventListener('submit', onFormSubmit);