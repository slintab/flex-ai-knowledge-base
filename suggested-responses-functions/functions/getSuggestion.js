const TokenValidator = require("twilio-flex-token-validator").functionValidator;
const {
  createResponse,
  createError,
  makeRequest,
} = require(Runtime.getFunctions()["common/utils"].path);

async function handler(context, event, callback) {
  if (event.question) {
    return getSuggestion(event.question, context, callback);
  }

  return createError("Missing parameters", 400, callback);
}

async function getSuggestion(question, context, callback) {
  const { QA_RESOURCE_NAME, QA_PROJECT_NAME, QA_ENVIRONMENT, QA_API_KEY } =
    context;
  const url = `https://${QA_RESOURCE_NAME}.cognitiveservices.azure.com/language/:query-knowledgebases?projectName=${QA_PROJECT_NAME}&api-version=2021-10-01&deploymentName=${QA_ENVIRONMENT}`;
  const payload = {
    top: 1,
    question: question,
    includeUnstructuredSources: true,
    confidenceScoreThreshold: 0.3,
    answerSpanRequest: {
      enable: true,
      confidenceScoreThreshold: 0.3,
      topAnswersWithSpan: 1,
    },
  };

  try {
    const result = await makeRequest(url, "post", payload, { QA_API_KEY });
    return createResponse(result.data, callback);
  } catch (e) {
    return createError(e, 503, callback);
  }
}

exports.handler = TokenValidator(handler);
