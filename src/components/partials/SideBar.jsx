import {
  Box,
  Button,
  Tooltip,
  Text,
  Menu,
  MenuButton,
  MenuList,
  Avatar,
  MenuItem,
  MenuDivider,
  Drawer,
  useDisclosure,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatContext } from "../../context/ChatProvider";
import ProfileModel from "./ProfileModel";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";

const SideBar = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { user, setSelectedChat, chats, setChats } = useContext(ChatContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Serach something in search.",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top-left",
      });
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
      setSearch("");
    } catch (error) {
      console.log(error.response.data);
      toast({
        title: "Error Occured !",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
      setSearch("");
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const { data } = await axios.get(
        `/chat`,
        { userId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }

      setLoadingChat(false);
      setSelectedChat(data);
      onClose();
    } catch (error) {
      console.log(error.response.data);

      toast({
        title: "Error fetching the chat ! !",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
        w={"100%"}
        p={"5px 10px 5px 10px"}
        borderWidth={"5px"}
        bg={"white"}
      >
        <Tooltip label="Search User to chat" hasArrow placement="bottom-end">
          <Button variant={"ghost"} onClick={onOpen}>
            <i className="ri-search-line"></i>
            <Text display={{ base: "none", md: "flex" }} px="2">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize={"2xl"}>Talk-A-Tive</Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize={"2xl"} m={1} />
            </MenuButton>
            {/* <MenuList></MenuList> */}
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size={"sm"}
                cursor={"pointer"}
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModel>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth={"1px"}>Search User</DrawerHeader>
          <DrawerBody>
            <Box display={"flex"} pb={2}>
              <Input
                placeholder="Serach by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>

            {loading ? (
              <ChatLoading />
            ) : (
              searchResult.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml={"auto"} display={"flex"} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideBar;
