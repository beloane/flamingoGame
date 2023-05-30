import View from "./view";

class SearchView extends View {
  _parentElement = document.querySelector(".bottom-container");
  _data;

  addHandlerRender(handler) {
    ["click", "keydown"].forEach((event) => {
      this._parentElement.addEventListener(event, function (e) {
        // e.preventDefault();
        if (e.key === "Enter") handler();

        if (event === "click") {
          const clicked = e.target.closest(".cute-button");
          if (!clicked) return;
          handler();
        }
      });
    });
  }

  getQuery() {
    const query = this._parentElement.querySelector(".round-input").value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentElement.querySelector(".round-input").value = "";
  }
}
export default new SearchView();
