import './sass/main.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import throttle from 'lodash.throttle';
import fetchImages from './js/fetch-img';
import cardTpl from './templates/templates.hbs';
import { refs } from './js/constants';


function renderCardImage(arr) {
    const markup = arr.map(item => cardTpl(item)).join('');
    refs.gallery.insertAdjacentHTML('beforeend', markup);
}

let lightbox = new SimpleLightbox('.photo-card a', {
    captions: true,
    captionsData: 'alt',
    captionDelay: 250,
});

let currentPage = 1;
let currentHits = 0;
let searchQuery = '';

async function onSubmitSearchForm(e) {
    e.preventDefault();
    searchQuery = e.currentTarget.searchQuery.value;
    currentPage = 1;

    if (searchQuery === '') {
        return;
    }

    const response = await fetchImages(searchQuery, currentPage);
    currentHits = response.hits.length;

    if (response.totalHits > 40) {
        refs.loadMoreBtn.classList.remove('is-hidden');
    } else {
        refs.loadMoreBtn.classList.add('is-hidden');
    }

    try {
        if (response.totalHits > 0) {
            Notify.success(`Hooray! We found ${response.totalHits} images.`);
            refs.gallery.innerHTML = '';
            renderCardImage(response.hits);
            lightbox.refresh();
            refs.endCollectionText.classList.add('is-hidden');

            const { height: cardHeight } = document
                .querySelector('.gallery')
                .firstElementChild.getBoundingClientRect();

            window.scrollBy({
                top: cardHeight * -100,
                behavior: 'smooth',
            });
        }

        if (response.totalHits === 0) {
            refs.gallery.innerHTML = '';
            Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            refs.loadMoreBtn.classList.add('is-hidden');
            refs.endCollectionText.classList.add('is-hidden');
        }
    } catch (error) {
        console.log(error);
    }
};

refs.searchForm.addEventListener('submit', onSubmitSearchForm);

async function onClickLoadMoreBtn() {
    currentPage += 1;
    const response = await fetchImages(searchQuery, currentPage);
    renderCardImage(response.hits);
    lightbox.refresh();
    currentHits += response.hits.length;

    if (currentHits === response.totalHits) {
        refs.loadMoreBtn.classList.add('is-hidden');
        refs.endCollectionText.classList.remove('is-hidden');
    }
};

refs.loadMoreBtn.addEventListener('click', onClickLoadMoreBtn);
