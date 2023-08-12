import { Actions } from "@twilio/flex-ui";
import SuggestionService from "../services/SuggestionService";

export async function updateKnowledgebase(payload) {
  const question = payload.task.attributes.question;
  const answer = payload.task.attributes.answer;

  const result = await SuggestionService.addSuggestion(question, answer);
  if (!result) {
    console.log(
      `Error updating KB with: ${question}: ${answer}.`
    );
  }
  console.log(
    `KB updated with: ${question}: ${answer}.`
  );  
}
