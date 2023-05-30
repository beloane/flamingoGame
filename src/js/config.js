import { createClient } from "pexels";
import { Configuration, OpenAIApi } from "openai";

// export const aiStartInstructions = `imagine you are a 4 year old child, and you like giving explanations as a dictionary about certain input words. You will output in you own words as being a 4 year old kid the definition of the given word in one sentence, without repeating the word it's self`

export const aiStartInstructions = `imagine you are a 4 year old child, and you like giving fun facts about certain input words. You will output in you own words as being a 4 year old kid one random fun fact of the given word in one sentence, without repeating the word it's self.`;

const pexel = process.env.API_KEY_PEXEL;
const openaiKey = process.env.API_KEY_OPENAI;

const config = new Configuration({ apiKey: openaiKey });
delete config.baseOptions.headers["User-Agent"];

export const openai = new OpenAIApi(config);

export const client = createClient(pexel);
