import React, { useState, useEffect } from "react";
import * as Flex from "@twilio/flex-ui";

import { Theme } from "@twilio-paste/core/theme";
import { Box } from "@twilio-paste/core/box";
import { Separator } from "@twilio-paste/core/separator";
import { Text } from "@twilio-paste/core/text";
import { Button } from "@twilio-paste/core/button";
import { Stack } from "@twilio-paste/core/stack";
import {
  ChatLog,
  ChatMessage,
  ChatMessageMeta,
  ChatMessageMetaItem,
  ChatBubble,
} from "@twilio-paste/chat-log";

import SuggestionService from "../../utils/SuggestionService";

function Suggestion(props) {
  const [suggestion, setSuggestion] = useState();
  const [confidence, setConfidence] = useState(0);

  

  useEffect(() => {
    async function init() {
      const manager = Flex.Manager.getInstance();
      const worker = manager.workerClient.name;

      const conversation =
        await manager.conversationsClient.getConversationBySid(
          props.conversationSid
        );

      conversation.on("messageAdded", async (message) => {
        const response = await getSuggestedResponse(message, worker);
        setSuggestedResponse(response);
      });

      const messages = await conversation.getMessages();

      for (const message of messages.items) {
        const response = await getSuggestedResponse(message, worker);
        if (response) {
          setSuggestedResponse(response);
          break;
        }
      }
    }

    init();
  }, []);

  const sendMessage = () => {
    Flex.Actions.invokeAction("SendMessage", {
      conversationSid: props.conversationSid,
      body: suggestion,
    });
    setSuggestion(null);
  };

  const insertMessage = () => {
    Flex.Actions.invokeAction("SetInputText", {
      conversationSid: props.conversationSid,
      body: suggestion,
    });
    setSuggestion(null);
  };

  const getSuggestedResponse = async(message, worker)=> {
    if (message.author === worker) {
      return;
    }

    if (message.type !== "text") {
      return;
    }

    if (message.body.split(" ").length === 1) {
      return;
    }
    try {
      const suggestion = await SuggestionService.getSuggestion(message.body);
      return suggestion;
    } catch (e) {
      console.log("Error fetching suggested answer: " + e);
    }

    return null;
  }

  const setSuggestedResponse = (response) => {
    if (response && response.answer.length > 0) {
      const answer = response.answerSpan?.text || response.answer;
      const score =
        response.answerSpan?.confidenceScore || response.confidenceScore;
      setSuggestion(answer);
      setConfidence(Math.round(score * 100) / 100);
    }
  };

  return (
    <Theme.Provider theme={props.theme}>
      <Box
        paddingBottom="space10"
        margin="space0"
        height="size20"
        paddingTop="space0"
      >
        <Separator
          orientation="horizontal"
        />
        <ChatLog>
          <ChatMessage variant="inbound">
            <ChatMessageMeta aria-label="heading">
              <ChatMessageMetaItem>
                <Text
                  textAlign="center"
                  fontFamily="fontFamilyText"
                  fontWeight="fontWeightSemibold"
                >
                  Suggested response
                </Text>
              </ChatMessageMetaItem>
            </ChatMessageMeta>
            <ChatBubble>{suggestion ? suggestion : "No suggestion"}</ChatBubble>
            {suggestion && (
              <Box padding="space10">
                <ChatMessageMeta
                  aria-label="suggestion confidence score"
                  paddingBottom="space10"
                >
                  <ChatMessageMetaItem>
                    Confidence: {confidence}
                  </ChatMessageMetaItem>
                  <ChatMessageMetaItem>
                    <Stack orientation="horizontal" spacing="space30">
                      <Button
                        variant="primary"
                        size="small"
                        onClick={sendMessage}
                      >
                        Send
                      </Button>
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={insertMessage}
                      >
                        Insert
                      </Button>
                    </Stack>
                  </ChatMessageMetaItem>
                </ChatMessageMeta>
              </Box>
            )}
          </ChatMessage>
        </ChatLog>
      </Box>
    </Theme.Provider>
  );
}

export default Flex.withTheme(Suggestion);
