import React, { useState } from "react";
import * as Flex from "@twilio/flex-ui";
import { Theme } from "@twilio-paste/core/theme";
import { Button } from "@twilio-paste/core/button";
import {
  ChatMessage,
  ChatMessageMeta,
  ChatMessageMetaItem,
} from "@twilio-paste/chat-log";

function KBMessageMetaOption(props) {
  const direction = props.message.isFromMe ? "outbound" : "inbound";
  const [buttonDisabled, setbuttonDisabled] = useState(false);

  const handleMarking = () => {
    setbuttonDisabled(true);

    if (direction === "inbound") {
      props.task.setAttributes({
        ...props.task.attributes,
        question: props.message.source.body,
      });
    }

    if (direction === "outbound") {
      props.task.setAttributes({
        ...props.task.attributes,
        answer: props.message.source.body,
      });
    }
  };

  return (
    <Theme.Provider theme={props.theme}>
      <ChatMessage variant={direction}>
        <ChatMessageMeta aria-label="buttons to mark message as question or answer">
          {direction === "outbound" && (
            <ChatMessageMetaItem></ChatMessageMetaItem>
          )}
          <ChatMessageMetaItem>
            <Button
              variant={direction === "inbound" ? "destructive_link" : "link"}
              onClick={handleMarking}
              disabled={buttonDisabled}
            >
              Mark {direction === "inbound" ? "question" : "answer"}
            </Button>
          </ChatMessageMetaItem>
          {direction === "inbound" && (
            <ChatMessageMetaItem></ChatMessageMetaItem>
          )}
        </ChatMessageMeta>
      </ChatMessage>
    </Theme.Provider>
  );
}

export default Flex.withTheme(Flex.withTaskContext(KBMessageMetaOption));
