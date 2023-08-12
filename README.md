# Twilio Flex: Suggested Responses

This [Twilio Flex](https://www.twilio.com/flex) plugin uses the [Azure Cognitive Question Answering](https://azure.microsoft.com/en-gb/services/cognitive-services/question-answering/) service to suggest answers to customer queries for contact center agents.

It also enables agents to add and improve suggestions by allowing them to mark questions and answer pairs in chat interactions.


## Demo
![Demo](demo.png?raw=true)

## Design
![Architecture](architecture.png?raw=true)

The repository contains two folders:
- `suggested-response-functions`: contains the code for [Twilio Functions](https://www.twilio.com/docs/runtime/functions) used for fetching and adding suggestions, respectively. 
- `suggested-response-plugin`: contains the code for a [Twilio Flex plugin](https://www.twilio.com/docs/flex/developer/plugins). The plugin displays suggested responses for the agents to view and send. It also enables agents to mark messages as either questions or answers to add and improve suggestions based on customer interactions.

## Setup

1. **Create and deploy a Question Answering project on Azure. You can use [this](https://docs.microsoft.com/en-us/azure/cognitive-services/language-service/question-answering/quickstart/sdk?pivots=studio) quickstart to get started.**

2. ***Deploy Twilio Functions***
   1. Install the [Twilio Serverless Toolkit](https://www.twilio.com/docs/labs/serverless-toolkit).
   2. Navigate to the function directory: `cd suggested-responses-functions`
   3. Rename `.env.example` to `.env` and update it with the details of your Azure deployment from step 1. 
   3. Deploy the functions using the `twilio serverless:deploy` command.
   4. Make note of the newly deployed function URLs.

3. ***Install the Flex plugin:***

   Note that the plugin uses Flex UI 2.


   1. Install the [Flex Plugins CLI](https://www.twilio.com/docs/flex/developer/plugins/cli).
   2. Navigate to the plugin directory: `cd suggested-response-plugin`
   3. Rename `.env.example` to `.env` and then open it and set `FLEX_APP_SERVERLESS_URL` to the base URL of your Twilio functions from step 2. 
   4. Install the flex plugin using the `twilio flex:plugins:deploy` command. 

4. ***Optional: disable updates*** 
   
   By default, the plugin allows agents to add and update suggestions. This can be disabled if needed by [updating the Flex Configuration](https://www.twilio.com/docs/flex/developer/config/flex-configuration-rest-api#update-your-configuration) and adding the below entry under `ui_attributes`:
      
      ```json
         "suggested_responses": {
            "enableUpdates": false
         }
      ```
   


That's it! Navigate to your Flex instance and click on a messaging-based task to see the plugin in action.

## Maintainer
Thanks for reading this far!
If you have any questions, do not hesitate to reach out at `hello@slintab.dev`