import * as Flex from "@twilio/flex-ui";
import axios from "axios";

const SERVERLESS_URL = process.env.FLEX_APP_SERVERLESS_URL

class SuggestionService {
  constructor() {
    this.url = SERVERLESS_URL;
    this.manager = Flex.Manager.getInstance();
  }

  async addSuggestion(question, answer) {    
    const url = this.url + "/addSuggestion"
    const payload = { question, answer }
    
    return this.makeRequest(url, payload);
  }

  async getSuggestion(question) {
    const url = this.url + "/getSuggestion"
    const payload = { question}
    
    const result = await this.makeRequest(url, payload);
    
    return result ? result.data?.answers?.[0] : result;
  }

  async makeRequest(url, data) {
    const token =
      this.manager.store.getState().flex.session.ssoTokenPayload.token;
    const payload = { ...data, Token: token };
    
    try {
      const result = await axios.post(url, payload)
    return result
    } catch (e) {
      console.log(`Error making request: ${e}} `)
    }

    return false
  }
}

export default new SuggestionService();
