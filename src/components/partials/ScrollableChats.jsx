import React, { useContext } from "react";
import ScrollableFeed from "react-scrollable-feed";
import { ChatContext } from "../../context/ChatProvider";
import { Avatar, Tooltip } from "@chakra-ui/react";

const ScrollableChats = ({ messages }) => {
  const { user } = useContext(ChatContext);

  const isSameSender = (messages, m, i, userId) => {
    return (
      i < messages.length - 1 &&
      (messages[i + 1].senderId?._id !== m.senderId?._id ||
        (messages[i + 1].senderId?._id === undefined &&
          messages[i].senderId?._id !== userId))
    );
  };

  const isLastMessage = (messages, i, userId) => {
    return (
      i === messages.length - 1 &&
      messages[messages.length - 1].senderId?._id !== userId &&
      messages[messages.length - 1].senderId?._id
    );
  };

  const isSameSenderMargin = (messages, m, i, userId) => {
    if (
      i < messages.length - 1 &&
      messages[i + 1].senderId?._id !== m.senderId?._id &&
      messages[i].senderId?._id !== userId
    )
      return 33;
    else if (
      (i < messages.length - 1 &&
        messages[i + 1].senderId?._id !== m.senderId?._id &&
        messages[i].senderId?._id !== userId) ||
      (i === messages.length - 1 && messages[i].senderId?._id !== userId)
    )
      return 0;
    else return "auto";
  };

  const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].senderId?._id === m.senderId?._id;
  };

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user?._id) ||
              isLastMessage(messages, i, user?._id)) && (
              <Tooltip
                label={m.senderId?.name}
                placement="bottom-start"
                hasArrow
              >
                <Avatar
                  mt="7px"
                  mr={1}
                  size={"sm"}
                  cursor={"pointer"}
                  name={m.senderId._id?.name}
                  src={m.senderId._id?.pic}
                ></Avatar>
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.senderId._id == user?._id ? "#BEA3F8" : "#B9F5D0"
                }`,
                borderRadius: "10px",
                padding: "5px 10px",
                maxWidth: "75%",
                marginLeft: isSameSenderMargin(messages, m, i, user?._id),
                marginTop: isSameUser(messages, m, i) ? 3 : 10,
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChats;
