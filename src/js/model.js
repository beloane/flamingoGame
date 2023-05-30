import { createClient } from "pexels";
import { Configuration, OpenAIApi } from "openai";

// const aiStartInstructions = `imagine you are a 4 year old child, and you like giving explanations as a dictionary about certain input words. You will output in you own words as being a 4 year old kid the definition of the given word in one sentence, without repeating the word it's self`

const aiStartInstructions = `imagine you are a 4 year old child, and you like giving fun facts about certain input words. You will output in you own words as being a 4 year old kid one random fun fact of the given word in one sentence, without repeating the word it's self.`;

export const state = {
  pic: {},
  textContent: "",
  query: "",
  preConfig: aiStartInstructions,
};

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

const randomNumber = function getRandomInt(max) {
  return Math.floor(Math.random() * max);
};

const pexel = process.env.API_KEY_PEXEL;
const openaiKey = process.env.API_KEY_OPENAI;

const config = new Configuration({ apiKey: openaiKey });
delete config.baseOptions.headers["User-Agent"];
const openai = new OpenAIApi(config);

export const loadDescription = async function (query) {
  try {
    const fetch = openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: state.preConfig },
        { role: "user", content: query },
      ],
    });

    const res = await Promise.race([fetch, timeout(12)]);
    const aiRes = res.data.choices[0].message.content;
    if (!aiRes) throw new Error("Something went wrong ;)");
    state.textContent = aiRes;
  } catch (err) {
    throw err;
  }
};

const client = createClient(pexel);

export const loadPic = async function (query) {
  try {
    const res = await client.photos.search({ query, per_page: 10 });

    if (res.photos.length === 0)
      throw new Error(`Word does not exist! Try somthing else ;)`);
    const picNumber = randomNumber(10);
    state.query = query;
    state.pic = {
      id: res.photos[picNumber].id,
      alt: res.photos[picNumber].alt,
      src: res.photos[picNumber].src.landscape,
    };
  } catch (err) {
    throw err;
  }
};
