import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../context/ChatProvider";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "../../utils/axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import GroupChatModel from "./GroupChatModel";

const MyChats = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, setUser, selectedChat, setSelectedChat, chats, setChats } =
    useContext(ChatContext);
    
    
    const toast = useToast();
    
    const fetchChats = async () => {
      try {
        const { data } = await axios.get("/chat", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        
        setChats(data);
      } catch (error) {
        console.log(error.response.data);
        toast({
          title: "Error Occurred!",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    };
    
    useEffect(() => {
      setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
      fetchChats();
    }, [fetchAgain]);

  const getSender = (authUser, users) => {
    // console.log(authUser);
    // console.log(users);

    return users[0]?._id === authUser?._id ? users[1].name : users[0].name;
  };

  console.log(chats);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir={"column"}
      alignItems={"center"}
      p={3}
      bg={"white"}
      w={{ base: "100%", md: "30%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "25px", md: "30px" }}
        display={"flex"}
        w={"100%"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        My Chats
        <GroupChatModel>
          <Button
            fontSize={{ base: "17px", md: "15px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModel>
      </Box>
      <Box
        display={"flex"}
        flexDir={"column"}
        bg={"#F8F8F8"}
        w={"100%"}
        h={"100%"}
        borderRadius={"lg"}
        overflowY={"hidden"}
      >
        {chats ? (
          <Stack overflowY={"scroll"}>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor={"pointer"}
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius={"lg"}
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
