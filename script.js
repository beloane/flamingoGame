import { createClient } from "pexels";

const picContainer = document.querySelector(".picture-container");
const textContainer = document.querySelector(".text-container");
const submitButton = document.querySelector(".bottom-container");

const getPics = async function (query) {
  try {
    // const client = createClient(process.env.API_KEY_PEXEL);
    const client = createClient(API_KEY_PEXEL);

    const res = await client.photos.search({ query, per_page: 1 });

    console.log(res);
    if (res.photos.length === 0)
      throw new Error(`Word does not exist! Try somthing else ;)`);

    const pic = {
      id: res.photos[0].id,
      alt: res.photos[0].alt,
      src: res.photos[0].src.landscape,
    };

    const picElement = document.createElement("img");
    picElement.src = pic.src;
    picContainer.innerHTML = "";
    picContainer.prepend(picElement);
    document.querySelector(".round-input").value = "";
  } catch (err) {
    alert(err);
    console.error(err);
  }
};

const eventTypes = ["click", "keydown"];
eventTypes.forEach((event) => {
  submitButton.addEventListener(event, function (e) {
    // e.preventDefault();
    if (e.key === "Enter") {
      // Functionality
      const inputText = document.querySelector(".round-input").value;
      getPics(inputText);
    }

    if (event === "click") {
      const clicked = e.target.closest(".cute-button");
      if (!clicked) return;
      // Functionality
      const inputText = document.querySelector(".round-input").value;
      getPics(inputText);
    }
  });
});

console.log("Welcome");
