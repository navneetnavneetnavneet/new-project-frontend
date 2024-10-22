import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatProvider";
import axios from "../../utils/axios";
import UserListItem from "./UserListItem";
import UserItem from "./UserItem";
import { useNavigate } from "react-router-dom";

const GroupChatModel = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const toast = useToast();

  const { user, chats, setChats } = useContext(ChatContext);

  const handleSearch = async (query) => {
    setSearch(query);
    if (!search) {
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(`/users?search=${search}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setLoading(false);
      setSearchResult(data);
      //   console.log(data);

      setSearch("");
    } catch (error) {
      console.log(error.response.data);
      toast({
        title: "Error Occured form Sreaching Users !",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
      setSearch("");
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added !",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (removeUser) => {
    setSelectedUsers(
      selectedUsers.filter((selected) => selected._id !== removeUser._id)
    );
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the fields !",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    const { data } = await axios.post(
      "/chat/group",
      {
        name: groupChatName,
        users: JSON.stringify(selectedUsers.map((u) => u._id)),
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    setChats([data, ...chats]);
    onClose();
    toast({
      title: "Group chat created.",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "bottom",
    });
    try {
    } catch (error) {
      console.log(error.response.data);
      toast({
        title: "Error for group creation !",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"30px"}
            display={"flex"}
            justifyContent={"center"}
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"felx"} flexDir={"column"} alignItems={"center"}>
            <FormControl>
              <Input
                placeholder="Group Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
                value={groupChatName}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: Jhon, Piyush, Rohit"
                mb={3}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {/* selected users */}
            <Box w={"100%"} display={"flex"} flexWrap={"wrap"}>
              {selectedUsers.map((u) => (
                <UserItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>

            {/* render serach users */}
            {loading ? (
              <span>Loading . . .</span>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((u) => (
                  <UserListItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleGroup(u)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModel;
