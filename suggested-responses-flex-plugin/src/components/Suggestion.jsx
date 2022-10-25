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

import { getSuggestion } from "../utils";

function Suggestion(props) {
  const [suggestion, setSuggestion] = useState();
  const [confidence, setConfidence] = useState(0);

  useEffect(() => {
    async function getSuggestedResponse(message, worker) {
      if (message.author === worker) {
        return;
      }

      if (message.type !== "text") {
        return;
      }

      if (message.body.split(" ").length === 1) {
        return;
      }

      const suggestion = await getSuggestion(message.body);

      return suggestion;
    }

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
      await new Promise((resolve) => setTimeout(resolve, 200)); //object properties are set asynchronously - delay added to wait until they can be resolved

      messages.items.forEach(async (message) => {
        if (!suggestion) {
          const response = await getSuggestedResponse(message, worker);
          setSuggestedResponse(response);
        }
      });
    }

    init();
  }, []);

  const handleSend = () => {
    Flex.Actions.invokeAction("SendMessage", {
      conversationSid: props.conversationSid,
      body: suggestion,
    });
    setSuggestion(null);
  };

  const handleInsert = () => {
    Flex.Actions.invokeAction("SetInputText", {
      conversationSid: props.conversationSid,
      body: suggestion,
    });
    setSuggestion(null);
  };

  const setSuggestedResponse = (response) => {
    if (response && response.answer.length > 0) {
      // Use short answer if available
      if (response.answerSpan && response.answerSpan.text) {
        setSuggestion(response.answerSpan.text);
        setConfidence(response.answerSpan.confidenceScore);
      } else {
        setSuggestion(response.answer);
        setConfidence(response.confidenceScore);
      }
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
          verticalSpacing="space0"
          margin="space0"
        />
        <ChatLog>
          <ChatMessage variant="inbound">
            <ChatMessageMeta aria-label="heading">
              <ChatMessageMetaItem>
                <Text
                  textAlign="center"
                  paddingTop="space10"
                  fontFamily="fontFamilyText"
                  fontWeight="fontWeightSemibold"
                >
                  Suggested response
                </Text>
              </ChatMessageMetaItem>
              <ChatMessageMetaItem></ChatMessageMetaItem>
            </ChatMessageMeta>
            <ChatBubble>{suggestion ? suggestion : "No suggestion"}</ChatBubble>
            {suggestion && (
              <ChatMessageMeta aria-label="suggestion confidence score">
                <ChatMessageMetaItem>
                  Confidence: {confidence}
                </ChatMessageMetaItem>
                <ChatMessageMetaItem>
                  <Stack orientation="horizontal" spacing="space30">
                    <Button variant="primary" size="small" onClick={handleSend}>
                      Send
                    </Button>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={handleInsert}
                    >
                      Insert
                    </Button>
                  </Stack>
                </ChatMessageMetaItem>
              </ChatMessageMeta>
            )}
          </ChatMessage>
        </ChatLog>
      </Box>
    </Theme.Provider>
  );
}

export default Flex.withTheme(Suggestion);
