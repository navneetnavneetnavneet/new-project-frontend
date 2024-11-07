import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../context/ChatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModel from "./ProfileModel";
import UpdateGroupChatModel from "./UpdateGroupChatModel";
import axios from "../../utils/axios";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const { user, selectedChat, setSelectedChat } = useContext(ChatContext);

  const getSender = (authUser, users) => {
    return users[0]._id === authUser._id ? users[1].name : users[0].name;
  };

  const getSenderDetails = (authUser, users) => {
    return users[0]._id === authUser._id ? users[1] : users[0];
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      setNewMessage("");
      try {
        const { data } = await axios.post(
          "/messages",
          {
            chatId: selectedChat._id,
            content: newMessage,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setMessages([...messages, data]);
      } catch (error) {
        console.log(error.response.data);
        toast({
          title: "Failed to send message!",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-center",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // Typing Indicator Logic
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w={"100%"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModel
                  user={getSenderDetails(user, selectedChat.users)}
                />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                {
                  <UpdateGroupChatModel
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                }
              </>
            )}
          </Text>
          <Box
            p={3}
            h={"100%"}
            w={"100%"}
            display={"flex"}
            flexDir={"column"}
            justifyContent={"flex-end"}
            bg={"#E8E8E8"}
            borderRadius={"lg"}
            overflowY={"hidden"}
          >
            {loading ? (
              <Spinner
                size={"xl"}
                w={20}
                h={20}
                alignSelf={"center"}
                margin={"auto"}
              />
            ) : (
              <div>{/* messages */}</div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              <Input
                variant={"filled"}
                bg={"#E0E0E0"}
                placeholder="Enter a message . . ."
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          w={"100%"}
          h={"100%"}
        >
          <Text fontSize={"3xl"}>Click on a user to start chatting</Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
