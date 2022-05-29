import './sass/main.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import throttle from 'lodash.throttle';
import { params, searchImg } from './js/fetch-img';
import cardTpl from './templates/templates.hbs';
import { refs } from './js/refs';
import Notiflix from 'notiflix';

function renderCardImage(arr) {
    refs.gallery.insertAdjacentHTML('beforeend', cardTpl(arr));
}

function simpleLightbox() {
    let lightbox = new SimpleLightbox('.gallery a', {
        captionDelay: 250,
    });
    
    lightbox.refresh();
};


async function generateImagesMarkup() {
    const result = await searchImg();
    console.log(result);
    const images = result?.data?.hits;
    renderCardImage(images);
    if (images <= 40 && result?.data?.totalHits !== 0) {
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")
    };

    simpleLightbox();
}

function totalHits(total) {
    if (total) {
        Notiflix.Notify.success(`Hooray! We found ${total} images.`);
    }
}


async function onFormSubmit(e) {
    params.page = 1;
    params.q = e.currentTarget.elements.searchQuery.value;
    refs.gallery.innerHTML = '';
    e.preventDefault();
    generateImagesMarkup();
    searchImg().then(({ data } = {}) => {
        if (data?.total === 0) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            return;
        }
        totalHits(data?.total)
    })
}


function loadMore() {
    params.page += 1;
    generateImagesMarkup();
}

function onObserver(entries) {
    entries.forEach(entry => {
        if (entry.intersectionRatio && params.q !== '') {
            loadMore();
        }
    });
};

const options = {
    rootMargin: '400px',
    threshold: 1.0,
};

const observer = new IntersectionObserver(onObserver, options);
observer.observe(refs.observe);

refs.searchForm.addEventListener('submit', onFormSubmit);


