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

async function generateMarkup() {
    try {
        const result = await API.searchImg();
        const images = result.data.hits;
        generateImagesMarkup(images);

    } catch (error) {
        Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
    };

};

function generateImagesMarkup(images) {
    refs.gallery.insertAdjacentHTML('beforeend', cardTpl(images));

    let lightbox = new SimpleLightbox('.gallery a', {
        captions: true,
        captionsData: 'alt',
        captionDelay: 250,
    });
    lightbox.refresh();
};


function onSubmitSearchForm(e) {
    API.fetchImgParams.page = 1;
    API.fetchImgParams.q = e.target.value;
};

function totalHits(hits) {
    if(hits) {
        Notiflix.Notify.success(`Hooray! We found ${hits} images.`);
    }
};

function onFormSubmit(e) {
    refs.gallery.innerHTML = "";
    e.preventDefault();
    generateMarkup();
    API.searchImg().then(({ data }) => totalHits(data.hits));
};

function onObserver(entries) {
    entries.forEach(entry => {
        if (entry.IntersectionRatio && API.fetchImgParams.q !== ""){
            loadMore();
            refs.loadMoreBtn.classList.remove('is-hidden');
        }
    })
};

function loadMore() {
    API.fetchImgParams.page += 1;
    generateMarkup();
}

const options = {
    rootMargin: '0px',
    threshold: 1.0
};

const observer = new IntersectionObserver(onObserver, options);
observer.observe(refs.observe);

refs.searchForm.addEventListener('submit', onFormSubmit);

refs.searchInput.addEventListener('input', onSubmitSearchForm)

