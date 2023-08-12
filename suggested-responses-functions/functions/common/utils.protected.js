exports.createError = (e, code, callback) => {
  console.error("Exception: ", typeof e, e);

  const response = new Twilio.Response();

  response.setStatusCode(code);
  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
  response.appendHeader("Content-Type", "application/json");
  response.setBody({ error: typeof e === "string" ? e : e.message });

  callback(null, response);
};

exports.createResponse = (obj, callback) => {
  const response = new Twilio.Response();

  response.setStatusCode(200);
  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
  response.appendHeader("Content-Type", "application/json");
  response.setBody(typeof obj === "string" ? { obj } : obj);

  callback(null, response);
};

exports.makeRequest = async (url, method, payload, context) => {
  const axios = require("axios");
  const headers = {
    "Ocp-Apim-Subscription-Key": context.QA_API_KEY,
    "Content-Type": "application/json",
  };

  return axios[method](url, payload, {
    headers: headers,
  });
};
