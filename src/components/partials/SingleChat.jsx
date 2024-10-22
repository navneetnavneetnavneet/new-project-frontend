import React, { useContext } from "react";
import { ChatContext } from "../../context/ChatProvider";
import { Box, IconButton, Text } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModel from "./ProfileModel";
import UpdateGroupChatModel from "./UpdateGroupChatModel";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = useContext(ChatContext);

  const getSender = (authUser, users) => {
    return users[0]._id === authUser._id ? users[1].name : users[0].name;
  };

  const getSenderDetails = (authUser, users) => {
    return users[0]._id === authUser._id ? users[1] : users[0];
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
          ></Box>
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
