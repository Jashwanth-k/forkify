import View from './view.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _errMessage = '';

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.result.length / this._data.resultsPerPage
    );

    // page 1, and other pages left
    if (curPage === 1 && numPages > 1) {
      return this._generateMarkupBtnNext();
    }
    // last page
    if (curPage === numPages && numPages > 1) {
      return this._generateMarkupBtnPrev();
    }
    // other page
    if (curPage < numPages) {
      return this._generateMarkupBtnPrev() + this._generateMarkupBtnNext();
    }
    // page 1, and No other pages
    else {
      return '';
    }
  }

  _generateMarkupBtnPrev() {
    return `
        <button data-goto="${
          this._data.page - 1
        }" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${this._data.page - 1}</span>
        </button>
      `;
  }

  _generateMarkupBtnNext() {
    return `
      <button data-goto="${
        this._data.page + 1
      }" class="btn--inline pagination__btn--next">
        <span>Page ${this._data.page + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>`;
  }
}

export default new PaginationView();
