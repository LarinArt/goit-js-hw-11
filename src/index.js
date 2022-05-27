import './sass/main.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import throttle from 'lodash.throttle';
import { params, searchImg } from './js/fetch-img';
import cardTpl from './templates/templates.hbs';
import { refs } from './js/refs';
import Notiflix from 'notiflix';


async function generateImagesMarkup() {
    const result = await searchImg();
    console.log(result);
    const images = result?.data?.hits;
    renderCardImage(images);

    let lightbox = new SimpleLightbox('.gallery a', {
        captionDelay: 250,
    });
    lightbox.refresh();
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
    searchImg().then(({ data }) => totalHits(data.total));
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
function renderCardImage(arr) {
    refs.gallery.insertAdjacentHTML('beforeend', cardTpl(arr));
}