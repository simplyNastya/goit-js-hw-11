const API_KEY = '33057333-6c82ba77f09b588ec1ac95420';


export default class ImagesApiService {
    constructor() {
        this.inputValue = '';
        this.page = 1;
    }

    makeFetch() {
        return fetch(`https://pixabay.com/api/?key=${API_KEY}&q=${this.inputValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText)
            } else {
                return response.json()
            }
        })
            .then(({ hits }) => {
                this.incrementPage()
                return hits
            })
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