import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatProvider";
import UserItem from "./UserItem";
import axios from "../../utils/axios";
import UserListItem from "./UserListItem";

const UpdateGroupChatModel = ({ fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, selectedChat, setSelectedChat } = useContext(ChatContext);
  const toast = useToast();

  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User Already in group !",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    console.log(selectedChat.groupAdmin._id !== user._id);

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admin can add someone!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        "/chat/groupadd",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error for add user to group !",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: "Only admin can remove someone!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        "/chat/groupremove",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      user1._id === user._id ? setSelectedChat(null) : setSelectedChat(data);

      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error for remove user from group !",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const { data } = await axios.post(
        "/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error for rename group !",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

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

  return (
    <div>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"30px"}
            display={"flex"}
            justifyContent={"center"}
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w={"100%"} display={"flex"} flexWrap={"wrap"}>
              {selectedChat.users.map((u) => (
                <UserItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>

            <FormControl display={"flex"}>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
                value={groupChatName}
              />
              <Button
                isLoading={renameLoading}
                onClick={handleRename}
                ml={1}
                color={"white"}
                variant={"solid"}
                backgroundColor={"teal"}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users to group"
                mb={3}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size={"lg"} />
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((u) => (
                  <UserListItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleAddUser(u)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UpdateGroupChatModel;
