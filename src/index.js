import './sass/main.scss';
import getRefs from './js/img-refs';
import ImageApiService from './js/img-lib';
import './js/lightbox';
import imgCardTpl from './templates/img-card.hbs';
import Notiflix from 'notiflix';

const refs = getRefs();
const apiImgService = new ApiImgService();

refs.form.addEventListener('submit', onImgSearch);
refs.loadBtn.addEventListener('submit', onImgLoad);

async function onImgSearch(evt) {
  evt.preventDefault();
  apiImgService.resetPage();
  refs.imgBox.innerHTML = '';
  //loadBtn.hide()
  refs.loadBtn.classList.add('hidden');

  apiImgService.searchQuery = evt.currentTarget.elements.searchQuery.value.trim();

  if (apiImgService.searchQuery === '') {
    return;
  }
  /*
loadBtn.show();
    apiImgService.defaultPage();
    fetchImgCards();
    refs.ingBox.innerHTML = '';
}
*/
  try {
    const result = await apiImgService.fetchImages();

    refs.imgBox.insertAdjacentHTML('beforeend', imgCardTpl(data));

    Notiflix.Notify.success(`Hooray! We found ${result.totalHits} images.`);

    if (result.hits.length === 0) {
      refs.loadBtn.classList.add('hidden');
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
      return;
    }

    refs.loadBtn.classList.remove('hidden');
  } catch (error) {
    console.log(error);
  }
}

async function onImgLoad() {
  try {
    const result = await apiImgService.fetchImages();

    if (refs.imageContainer.querySelectorAll('.photo-card').length === result.totalHits) {
      refs.loadBtn.style.display = 'none';

      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    } else {
      refs.imgBox.insertAdjacentHTML('beforeend', imgCardTpl(data));
    }
  } catch (error) {
    console.log(error);
  }
}
