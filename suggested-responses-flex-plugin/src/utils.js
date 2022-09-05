import axios from "axios";
import config from "./config";

async function updateKnowledgebase(task) {
  const question = task.attributes.question;
  const answer = task.attributes.answer;

  if (!question || !answer) {
    return;
  }

  const url = config.FUNCTION_URL + "/answer";
  const payload = { question: question, answer: answer };

  try {
    await axios.post(url, payload);
  } catch (error) {
    console.log("Failed to update knowledgebase: " + error);
  }
}

async function getSuggestion(question) {
  const url = config.FUNCTION_URL + "/ask";
  const payload = { question: question };
  let response;

  try {
    response = await axios.post(url, payload);
  } catch (error) {
    console.log("Error fetching suggested answer: " + error);
  }

  if (response?.status !== 200 || !response?.data) {
    return;
  }

  return response.data?.answers?.[0];
}

export { updateKnowledgebase, getSuggestion };
