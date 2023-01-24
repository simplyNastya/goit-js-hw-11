const axios = require('axios');
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import ImagesApiService from './load-image';

const formEl = document.querySelector('.search-form');
const markupContainerEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

const imagesApiService = new ImagesApiService();
let lightbox;

function createMarkup(array) {

    return array.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => { 
        return `<a class="gallery-item" href='${largeImageURL}'>
        <div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" width=370px height=294px/>
        <div class="info">
            <p class="info-item">
            <b>Likes ${likes}</b>
            </p>
            <p class="info-item">
            <b>Views ${views}</b>
            </p>
            <p class="info-item">
            <b>Comments ${comments}</b>
            </p>
            <p class="info-item">
            <b>Downloads ${downloads}</b>
            </p>
        </div>
        </div>
        </a>`
    }).join('')
}

function appendMarkup(array) {
    const markup = createMarkup(array)
    
    markupContainerEl.insertAdjacentHTML('beforeend', markup)

    lightbox = new SimpleLightbox('.gallery a', { captionsData: 'alt', 
captionDelay: 250, })

}

function clearMarkup() {
    markupContainerEl.innerHTML = ''
}

function handleImageLoad(event) {
    event.preventDefault();

    imagesApiService.query = event.currentTarget.elements.searchQuery.value

    imagesApiService.resetPage()

    imagesApiService.makeFetch()
        .then(hits => {
            if (imagesApiService.query === '') {
                clearMarkup()
                loadMoreBtnEl.classList.add('is-hidden')
                return Notiflix.Notify.warning('Please enter any fetch')
            } else {
                clearMarkup()
                appendMarkup(hits)
                lightbox.refresh()
            }  
        })
        .catch(() => {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
        })
    
    loadMoreBtnEl.classList.remove('is-hidden')
}

function handleOnLoadMore() {
    imagesApiService.makeFetch()
        .then(hits => {
            appendMarkup(hits)
            lightbox.refresh()
        })
        .catch(() => {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
        })
}

formEl.addEventListener('submit', handleImageLoad)
loadMoreBtnEl.addEventListener('click', handleOnLoadMore)