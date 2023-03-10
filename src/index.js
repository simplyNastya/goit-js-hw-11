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
        .then(data => {
            if (imagesApiService.query.trim().length === 0) {
                clearMarkup()
                loadMoreBtnEl.classList.add('is-hidden')
                return Notiflix.Notify.warning('Please enter any fetch')
            }
            else {
                clearMarkup()
                appendMarkup(data.hits)
                lightbox.refresh()
                if (data.hits.length < 40) {
                    Notiflix.Notify.info('We are sorry, but you have reached the end of search results.')
                    loadMoreBtnEl.classList.add('is-hidden')
                } else 
                    {loadMoreBtnEl.classList.remove('is-hidden')}
            }  
        })
        .catch(() => {
            loadMoreBtnEl.classList.add('is-hidden')
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
        })
}

function handleOnLoadMore() {
    imagesApiService.makeFetch()
        .then(data => {
            if (data.hits.length < 40) {                 
                Notiflix.Notify.info('We are sorry, but you have reached the end of search results.')
                loadMoreBtnEl.classList.add('is-hidden')
            }
            appendMarkup(data.hits)
            lightbox.refresh()
        })
        .catch(() => {
            loadMoreBtnEl.classList.add('is-hidden')
        })
}

formEl.addEventListener('submit', handleImageLoad)
loadMoreBtnEl.addEventListener('click', handleOnLoadMore)