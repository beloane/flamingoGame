import * as model from "./model.js";
import pictureView from "./views/pictureView.js";
import descriptionView from "./views/descriptionView.js";

import searchView from "./views/searchView.js";

const controlApp = async function () {
  try {
    // const query = "flamingo";
    const query = searchView.getQuery();

    pictureView.renderSpinner();
    descriptionView.renderSpinner();

    // 1. Load pic
    await model.loadPic(query);

    //2. Render picture
    pictureView.render(model.state);

    //3. Load description
    await model.loadDescription(query);

    //4. Render Descriptione
    descriptionView.render(model.state);
  } catch (err) {
    console.error(err);
    pictureView.renderError(err.message);
    descriptionView.renderError(err.message);
  }
};

const init = function () {
  searchView.addHandlerRender(controlApp);
};

init();
