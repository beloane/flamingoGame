import View from "./view";

class PictureView extends View {
  _parentElement = document.querySelector(".picture-container");
  _data;
  _errorMessage = "We could not find a right description!";

  render(data) {
    this._data = data;

    const picElement = document.createElement("img");
    picElement.src = this._data.pic.src;

    this._clear();
    this._parentElement.prepend(picElement);
  }
}

export default new PictureView();
