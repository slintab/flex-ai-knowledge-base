const TokenValidator = require("twilio-flex-token-validator").functionValidator;
const {
  createResponse,
  createError,
  makeRequest,
} = require(Runtime.getFunctions()["common/utils"].path);

async function handler(context, event, callback) {
  if (event.question && event.answer) {
    return addSuggestion(event.question, event.answer, context, callback);
  }

  return createError("Missing parameters", 400, callback);
}

async function addSuggestion(question, answer, context, callback) {
  try {
    await updateKnowledgeBase(question, answer, context);
    await deployKnoledgeBase(context);

    createResponse(null, callback);
  } catch (e) {
    createError(e, 503, callback);
  }
}

async function updateKnowledgeBase(question, answer, context) {
  const { QA_RESOURCE_NAME, QA_PROJECT_NAME, QA_API_KEY } = context;
  const url = `https://${QA_RESOURCE_NAME}.cognitiveservices.azure.com/language/query-knowledgebases/projects/${QA_PROJECT_NAME}/qnas?api-version=2021-10-01`;
  const payload = [
    {
      op: "add",
      value: {
        answer: answer,
        source: "flex",
        questions: [question],
      },
    },
  ];

  return makeRequest(url, "patch", payload, {
    QA_API_KEY,
  });
}

async function deployKnoledgeBase(context) {
  const { QA_RESOURCE_NAME, QA_PROJECT_NAME, QA_ENVIRONMENT, QA_API_KEY } =
    context;
  const url = `https://${QA_RESOURCE_NAME}.cognitiveservices.azure.com/language/query-knowledgebases/projects/${QA_PROJECT_NAME}/deployments/${QA_ENVIRONMENT}?api-version=2021-10-01`;

  return makeRequest(url, "put", {}, { QA_API_KEY });
}

exports.handler = TokenValidator(handler);
