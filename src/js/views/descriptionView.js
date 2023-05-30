import View from "./view";

class DescriptionView extends View {
  _parentElement = document.querySelector(".text-container");
  _data;
  _errorMessage = "We could not find that picture you are looking for!";

  render(data) {
    this._data = data;

    const html = `
            <h1>${this._data.query}</h1>
            <p>${this._data.textContent}</p>
                `;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", html);
  }
}
export default new DescriptionView();
