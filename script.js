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

const spinner = `
    <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
    </div> 
          `;

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

const getData = async function (query) {
  try {
    textContainer.innerHTML = "";
    textContainer.insertAdjacentHTML("afterbegin", spinner);

    picContainer.innerHTML = "";
    picContainer.insertAdjacentHTML("afterbegin", spinner);

    const fetch = openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: preConfig },
        { role: "user", content: query },
      ],
    });

    const res = await Promise.race([fetch, timeout(12)]);
    const aiRes = res.data.choices[0].message.content;
    if (!aiRes) return;

    const html = `
      <h1>${query}</h1>
      <p>${aiRes}</p>
`;
    textContainer.innerHTML = "";
    textContainer.insertAdjacentHTML("afterbegin", html);

    const client = createClient(pexel);

    const resPhoto = await client.photos.search({ query, per_page: 1 });

    if (resPhoto.photos.length === 0)
      throw new Error(`Word does not exist! Try somthing else ;)`);

    const pic = {
      id: resPhoto.photos[0].id,
      alt: resPhoto.photos[0].alt,
      src: resPhoto.photos[0].src.landscape,
    };

    const picElement = document.createElement("img");
    picElement.src = pic.src;
    picElement.addEventListener("load", function () {
      picContainer.innerHTML = "";
      picContainer.prepend(picElement);
      document.querySelector(".round-input").value = "";
    });
  } catch (err) {
    console.error(err);
    alert(err);
    location.reload();
  }
};

// const getText = async function (message) {
//   try {
//     textContainer.innerHTML = "";
//     textContainer.insertAdjacentHTML("afterbegin", spinner);

//     const fetch = openai.createChatCompletion({
//       model: "gpt-3.5-turbo",
//       messages: [
//         { role: "system", content: preConfig },
//         { role: "user", content: message },
//       ],
//     });

//     const res = await Promise.race([fetch, timeout(12)]);
//     const aiRes = res.data.choices[0].message.content;
//     if (!aiRes) return;

//     const html = `
//       <h1>${message}</h1>
//       <p>${aiRes}</p>
// `;
//     textContainer.innerHTML = "";
//     textContainer.insertAdjacentHTML("afterbegin", html);
//   } catch (err) {
//     alert(err);
//     console.error(err);
//   }
// };

// const getPics = async function (query) {
//   try {
//     picContainer.innerHTML = "";
//     picContainer.insertAdjacentHTML("afterbegin", spinner);

//     const client = createClient(pexel);

//     const res = await client.photos.search({ query, per_page: 1 });

//     if (res.photos.length === 0)
//       throw new Error(`Word does not exist! Try somthing else ;)`);

//     const pic = {
//       id: res.photos[0].id,
//       alt: res.photos[0].alt,
//       src: res.photos[0].src.landscape,
//     };

//     const picElement = document.createElement("img");
//     picElement.src = pic.src;
//     picElement.addEventListener("load", function () {
//       picContainer.innerHTML = "";
//       picContainer.prepend(picElement);
//       document.querySelector(".round-input").value = "";
//     });
//   } catch (err) {
//     alert(err);
//     console.error(err);
//   }
// };

const eventTypes = ["click", "keydown"];
eventTypes.forEach((event) => {
  submitButton.addEventListener(event, function (e) {
    // e.preventDefault();
    if (e.key === "Enter") {
      // Functionality
      const inputText = document.querySelector(".round-input").value;
      // getText(inputText);
      // getPics(inputText);

      getData(inputText);
    }

    if (event === "click") {
      const clicked = e.target.closest(".cute-button");
      if (!clicked) return;
      // Functionality
      const inputText = document.querySelector(".round-input").value;
      // getText(inputText);
      // getPics(inputText);
      getData(inputText);
    }
  });
});
