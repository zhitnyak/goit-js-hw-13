import './sass/main.scss';
import getRefs from './js/img-refs';
import ApiImgService from './js/img-lib';
// import './js/lightbox';
import imgCardTpl from './templates/img-card.hbs';
import Notiflix from 'notiflix';

const refs = getRefs();
const apiImgService = new ApiImgService();

refs.form.addEventListener('submit', onImgSearch);
refs.loadBtn.addEventListener('click', onImgLoad);

async function onImgSearch(evt) {
  evt.preventDefault();
  apiImgService.resetPage();
  clearImgBox();
  //loadBtn.hide()
  refs.loadBtn.classList.add('hidden');

  apiImgService.searchQuery = evt.currentTarget.elements.searchQuery.value.trim();

  if (apiImgService.searchQuery === '') {
    return;
  }
  /*
loadBtn.show();
    apiImgService.defaultPage();
    fetchImages();
    refs.imgBox.innerHTML = '';
}
*/
  try {
    const result = await apiImgService.fetchImages();

    ImgMarkup(result.hits);

    if (result.hits.length === 0) {
      refs.loadBtn.classList.add('hidden');
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
      return;
    }
    Notiflix.Notify.success(`Hooray! We found ${result.totalHits} images.`);

    refs.loadBtn.classList.remove('hidden');
  } catch (error) {
    console.log(error);
  }
}

async function onImgLoad() {
  try {
    const result = await apiImgService.fetchImages();

    if (refs.imgBox.querySelectorAll('.photo-card').length === result.totalHits) {
      getTotalImgCount();
    } else {
      ImgMarkup(result.hits);
    }
  } catch (error) {
    console.log(error);
  }
}

function ImgMarkup(data) {
  refs.imgBox.insertAdjacentHTML('beforeend', imgCardTpl(data));
}

function clearImgBox() {
  refs.imgBox.innerHTML = '';
}

function getTotalImgCount() {
  refs.loadBtn.style.display = 'none';

  Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
}
