import React from "react";
import { FlexPlugin } from "@twilio/flex-plugin";
import * as listeners from "./listeners";
import "./notifications/updateQANotifications";
import Suggestion from "./components/Suggestion/Suggestion";
import KBMessageMetaOption from "./components/QAMessageMetaItem/QAMessageMetaItem";

const PLUGIN_NAME = "SuggestedResponsePlugin";

export default class SuggestedResponse extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   */
  async init(flex, manager) {
    const pluginConfig =
      manager.serviceConfiguration.ui_attributes.suggested_responses;

    flex.MessageInputV2.Content.add(<Suggestion key="suggestion" />);

    flex.MessageListItem.Content.add(
      <KBMessageMetaOption key="kb-message-option" />,
      { if: () => pluginConfig?.enableUpdates !== false }
    );
    if (pluginConfig?.enableUpdates !== false) {
      listeners.afterCompleteTask();
    }
  }
}
