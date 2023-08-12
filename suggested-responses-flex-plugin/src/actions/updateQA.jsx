import { Actions } from "@twilio/flex-ui";
import SuggestionService from "../utils/SuggestionService";

export async function updateKnowledgebase(payload) {
  const question = payload.task.attributes.question;
  const answer = payload.task.attributes.answer;
  try {
    await SuggestionService.addSuggestion(question, answer);
    console.log("Knowledgebase updated with: " + question + " " + answer);
  } catch (e) {
    console.log(
      "Error updating KB with: " + question + " " + answer + " Error: " + e
    );
  }
}
