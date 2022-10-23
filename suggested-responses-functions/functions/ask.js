const axios = require("axios");

exports.handler = async (context, event, callback) => {
  console.log("Question: ", event.question);
  const createResponse = () => {
    const response = new Twilio.Response();

    response.appendHeader("Access-Control-Allow-Origin", "*");
    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS, POST, GET");
    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
    response.appendHeader("Content-Type", "application/json");

    return response;
  };

  const getAnswer = async () => {
    const headers = {
      "Ocp-Apim-Subscription-Key": context.azureApiKey,
      "Content-Type": "application/json",
    };

    const payload = {
      top: 1,
      question: event.question,
      includeUnstructuredSources: true,
      confidenceScoreThreshold: 0.3,
      answerSpanRequest: {
        enable: true,
        confidenceScoreThreshold: 0,
        topAnswersWithSpan: 1,
      },
    };

    const result = await axios.post(context.queryUrl, payload, {
      headers: headers,
    });

    return result.data;
  };

  const response = createResponse();
  let answer;

  if (!event.question) {
    response.setStatusCode(400);
    callback(null, response);
  }

  try {
    answer = await getAnswer();
  } catch (error) {
    response.setStatusCode(500);
    callback(null, response);
  }

  response.setBody(answer);
  return callback(null, response);
};
