
import './css/styles.css';
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const BASE_URL = 'https://pixabay.com/api/';

const perPage = 40;
let currentPage = 1;

const searchBtn = document.querySelector('button');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load__more-btn');
loadMore.style.display = "none";
const form = document.querySelector('form');
const lightbox = new SimpleLightbox('.gallery a', {
    captionSelector: 'title',
    close: true,
    nav: true,
    escKey: true,
    captionSelector: 'img',
    captionsData: 'alt',
    captionDelay: 250
});

searchBtn.addEventListener('click', loadImages);
loadMore.addEventListener('click', loadImages);
form.addEventListener('submit', function(event) {
    event.preventDefault();
    currentPage = 1;
    gallery.innerHTML = "";
    loadImages();
})

async function loadImages() {
    const input = document.querySelector("input[name='searchQuery']");
    const searchTerm = input.value;
    const apiKey = '33093349-e102244caac5b98b45f0118bc';
    const url = `${BASE_URL}?key=${apiKey}&per_page=${perPage}&page=${currentPage}&safesearch=true$orientation=horizontal&q=${searchTerm}&image_type=photo`;
    try {
        let html = "";
        const response = await axios.get(url);
        const images = response.data.hits;
        

        if (images.length === 0) {
            loadMore.style.display = "none";
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            return;
          }
          if (images.length < images.per_page) {
            loadMore.style.display = "none";
            Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
          }

        images.forEach((image) => {
            html += `<div class="image__card">
            <div>
            <a href="${image.webformatURL}" class="image__photo">
            <img class="image__photo" src="${image.webformatURL}" alt="${image.tags}"/>
            </a>
            </div>
            </a>
            <div class="image__info">
            <p>Likes:</br><span class="image__info-elem">${image.likes}</span></p>
            <p>Views:</br><span class="image__info-elem">${image.views}</span></p>
            <p>Comments:</br><span class="image__info-elem">${image.comments}</span></p>
            <p>Downloads:</br><span class="image__info-elem">${image.downloads}</span></p>
            </div>
            </div>`
        });
        gallery.innerHTML += html;
        currentPage += 1;
        loadMore.style.display = "block";
        lightbox.refresh();
    } catch (error) {
        console.error(error);
    }
}
// asdasd