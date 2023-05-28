import * as Flex from "@twilio/flex-ui";
import axios from "axios";

import { FUNCTION_URL } from "../config";

class SuggestionService {
  constructor() {
    this.url = FUNCTION_URL;
    this.manager = Flex.Manager.getInstance();
  }

  async addSuggestion(question, answer) {
    if (!question || !answer) {
      return;
    }
    return axios.post(this.url, { question, answer });
  }

  async getSuggestion(question) {
    const result = await this.makeRequest({ question });
    return result.data?.answers?.[0];
  }

  async makeRequest(data) {
    const token =
      this.manager.store.getState().flex.session.ssoTokenPayload.token;
    const payload = { ...data, Token: token };
    console.log(payload);
    return axios.post(this.url, payload);
  }
}

export default new SuggestionService();
