import * as model from './model.js';
import { MODEL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js';
import 'regenerator-runtime';
import bookmarksView from './views/bookmarksView.js';

// if (module.hot) {
//   module.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    // 0) update results view to mark selected
    resultsView.update(model.getSearchResultsPage());

    // 1) updating the bookmarks
    bookmarksView.update(model.state.bookmarks);

    // 2) loading recipe
    await model.loadRecipe(id);

    // 3) rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    //error handling
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // getting search query
    const query = searchView.getQuery();
    // console.log(query === '');

    if (query === '') throw new Error();
    if (!query) return;

    // loading search results
    await model.loadSearchResults(query);

    // rendering results
    // resultsView.render(model.state.search.result);
    resultsView.render(model.getSearchResultsPage());

    // render pagination
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError();
    paginationView._clear();
  }
};

const controlPagination = function (goToPage) {
  // render results for respective page
  resultsView.render(model.getSearchResultsPage(goToPage));

  // render pagination for curpage
  model.state.search.page = goToPage;
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // update the recipe servings (in state)
  model.updateServings(newServings);

  // update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // Add/Remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // update recipeview
  recipeView.update(model.state.recipe);

  // render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // render spinner
    addRecipeView.renderSpinner();

    // upload the new Recipe
    await model.uploadData(newRecipe);

    // render the recipe
    recipeView.render(model.state.recipe);

    // render bookmarks
    bookmarksView.render(model.state.bookmarks);

    // display the message
    addRecipeView.renderMessage();

    // change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(function () {
      addRecipeView.closeWindow();
    }, MODEL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmarks(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();

const clearBookmarks = function () {
  localStorage.clear();
};
