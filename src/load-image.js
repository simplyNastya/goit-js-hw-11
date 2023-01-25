import axios from "axios";

const API_KEY = '33057333-6c82ba77f09b588ec1ac95420';

export default class ImagesApiService {
    constructor() {
        this.inputValue = '';
        this.page = 1;
    }

    async makeFetch() {
        const response = await axios.get(`https://pixabay.com/api/?key=${API_KEY}&q=${this.inputValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`);

        const data = await response.data
        if (data.hits.length === 0) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.') 
        }
        this.incrementPage()
        
        return data
    }

    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.inputValue;
    }

    set query(newInputValue) {
        this.inputValue = newInputValue;
    }
}