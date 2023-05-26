import { createClient } from "pexels";
import { Configuration, OpenAIApi } from "openai";
import icons from "./icons.svg";

const picContainer = document.querySelector(".picture-container");
const textContainer = document.querySelector(".text-container");
const submitButton = document.querySelector(".bottom-container");

const preConfig = `imagine you are a 4 year old child, and you like giving explanations as a dictionary about certain input words. You will output in you own words as being a 4 year old kid the definition of the given word in one sentence, without repeating the word it's self. if you undertood you task, answer with yes!`;

const pexel = process.env.API_KEY_PEXEL;
const openaiKey = process.env.API_KEY_OPENAI;

const config = new Configuration({ apiKey: openaiKey });
delete config.baseOptions.headers["User-Agent"];
const openai = new OpenAIApi(config);

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

const getText = async function (message) {
  try {
    textContainer.innerHTML = "";
    const spinner = `
    <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
    </div> 
          `;

    const fetch = openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: preConfig },
        { role: "user", content: message },
      ],
    });

    textContainer.insertAdjacentHTML("afterbegin", spinner);
    const res = await Promise.race([fetch, timeout(7)]);
    const aiRes = res.data.choices[0].message.content;
    if (!aiRes) return;

    const html = `
      <h1>${message}</h1>
      <p>${aiRes}</p>
`;
    textContainer.innerHTML = "";
    textContainer.insertAdjacentHTML("afterbegin", html);
  } catch (err) {
    alert(err);
    console.error(err);
  }
};

const getPics = async function (query) {
  try {
    const client = createClient(pexel);

    const res = await client.photos.search({ query, per_page: 1 });

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
      getText(inputText);
    }

    if (event === "click") {
      const clicked = e.target.closest(".cute-button");
      if (!clicked) return;
      // Functionality
      const inputText = document.querySelector(".round-input").value;
      getPics(inputText);
      getText(inputText);
    }
  });
});
