import './sass/main.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import throttle from 'lodash.throttle';
import API from './js/fetch-img';
import cardTpl from './templates/templates.hbs';
import { refs } from './js/constants';
import Notiflix from 'notiflix';


function renderCardImage(arr) {
    refs.gallery.insertAdjacentHTML('beforeend', cardTpl[arr]);
};

function generateImagesMarkup(images) {
    refs.gallery.insertAdjacentHTML('beforeend', cardTpl[arr]);

    let lightbox = new SimpleLightbox('.gallery a', {
        captions: true,
        captionsData: 'alt',
        captionDelay: 250,
    });
};


function onSubmitSearchForm(e) {
    e.preventDefault();
    API.fetchImgParams.page = 1;
    API.fetchImgParams.q = e.target.value;
};

function totalHits(hits) {
    if(hits){
        Notiflix.Notify.failure(`Hooray! We found ${hits} images.`);
    }
};

function onFormSubmit(e) {
    refs.gallery.innerHTML = "";
    e.preventDefault();
    renderCardImage();
    API.searchImg().then(({ data }) => totalHits(data.hits));
};

function loadMore() {
    API.fetchImgParams.page += 1;
    renderCardImage();
}

function onObserver(entries) {
    entries.forEach(entry => {
        if (entry.IntersectionRatio && API.fetchImgParams.q !== ""){
            loadMore();
            refs.loadMoreBtn.classList.remove('is-hidden');
        }
    })
}

const options = {
    rootMargin: '0px',
    threshold: 1.0
};

const observer = new IntersectionObserver(onObserver, options);
observer.observe(refs.observe);

refs.searchForm.addEventListener('submit', onFormSubmit);

refs.searchInput.addEventListener('input', onSubmitSearchForm)

