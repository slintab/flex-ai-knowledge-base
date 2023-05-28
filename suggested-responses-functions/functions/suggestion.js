const TokenValidator = require("twilio-flex-token-validator").functionValidator;
const axios = require("axios");

async function suggestionHandler(context, event, callback) {
  if (event.question && event.answer) {
    return addSuggestion(event, context, callback);
  }
  if (event.question) {
    return fetchSuggestion(event, context, callback);
  }

  return createError("Missing parameters", 400, callback);
}

async function fetchSuggestion(event, context, callback) {
  const payload = {
    top: 1,
    question: event.question,
    includeUnstructuredSources: true,
    confidenceScoreThreshold: 0.3,
    answerSpanRequest: {
      enable: true,
      confidenceScoreThreshold: 0.3,
      topAnswersWithSpan: 1,
    },
  };

  const url = `https://${context.QA_RESOURCE_NAME}.cognitiveservices.azure.com/language/:query-knowledgebases?projectName=${context.QA_PROJECT_NAME}&api-version=2021-10-01&deploymentName=${context.QA_ENVIRONMENT}`;

  try {
    const result = await makeQARequest(url, "post", payload, context);
    return createResponse(result.data, callback);
  } catch (e) {
    return createError(e, 503, callback);
  }
}

async function addSuggestion(event, context, callback) {
  const updateKB = async () => {
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

    const url = `https://${context.QA_RESOURCE_NAME}.cognitiveservices.azure.com/language/query-knowledgebases/projects/${context.QA_PROJECT_NAME}/qnas?api-version=2021-10-01`;
    return makeQARequest(url, "patch", payload, context);
  };

  const deployKB = async () => {
    const url = `https://${context.QA_RESOURCE_NAME}.cognitiveservices.azure.com/language/query-knowledgebases/projects/${context.QA_PROJECT_NAME}/deployments/${context.QA_ENVIRONMENT}?api-version=2021-10-01`;
    return makeQARequest(url, "put", {}, context);
  };

  try {
    await updateKB();
    await deployKB();
    createResponse(null, callback);
  } catch (e) {
    createError(e, 503, callback);
  }
}

async function makeQARequest(url, method, payload, context) {
  const headers = {
    "Ocp-Apim-Subscription-Key": context.QA_API_KEY,
    "Content-Type": "application/json",
  };

  return axios[method](url, payload, {
    headers: headers,
  });
}

function createError(e, code, callback) {
  console.error("Exception: ", typeof e, e);

  const response = new Twilio.Response();

  response.setStatusCode(code);
  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
  response.appendHeader("Content-Type", "application/json");
  response.setBody({ error: typeof e === "string" ? e : e.message });

  callback(null, response);
}

function createResponse(obj, callback) {
  const response = new Twilio.Response();

  response.setStatusCode(200);
  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
  response.appendHeader("Content-Type", "application/json");
  response.setBody(typeof obj === "string" ? { obj } : obj);

  callback(null, response);
}

exports.handler = TokenValidator(suggestionHandler);
