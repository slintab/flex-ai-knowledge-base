const axios = require("axios");

exports.handler = async (context, event, callback) => {
  const createResponse = () => {
    const response = new Twilio.Response();

    response.appendHeader("Access-Control-Allow-Origin", "*");
    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS, POST, GET");
    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
    response.appendHeader("Content-Type", "application/json");

    return response;
  };

  const updateKnowledgebase = async () => {
    const headers = {
      "Ocp-Apim-Subscription-Key": context.azureApiKey,
      "Content-Type": "application/json",
    };

    const payload = [
      {
        op: "add",
        value: {
          answer: event.answer,
          source: "flex",
          questions: [event.question],
        },
      },
    ];

    await axios.patch(context.updateUrl, payload, {
      headers: headers,
    });
  };

  const deployKnowledgebase = async () => {
    const headers = {
      "Ocp-Apim-Subscription-Key": context.azureApiKey,
    };

    await axios.put(
      context.deployUrl,
      {},
      {
        headers: headers,
      }
    );
  };

  const response = createResponse();

  if (!event.question || !event.answer) {
    response.setStatusCode(400);
    callback(null, response);
  }

  try {
    await updateKnowledgebase();
    await deployKnowledgebase();
  } catch (error) {
    response.setStatusCode(500);
    callback(null, response);
  }

  response.setStatusCode(200);
  return callback(null, response);
};
