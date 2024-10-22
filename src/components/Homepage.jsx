import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import Login from "./authentication/Login";
import Signup from "./authentication/Signup";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        w="100%"
        p={3}
        m="40px 0 15px 0"
        bg="white"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text textAlign="center" fontSize="3xl" fontWeight="semibold">
          Talk-A-Tive
        </Text>
      </Box>
      <Box
        bg="white"
        color="black"
        w="100%"
        p={4}
        borderRadius="lg"
        borderWidth="1px"
      >
        <Tabs variant="soft-rounded">
          <TabList mb="1em">
            <Tab w="50%">Login</Tab>
            <Tab w="50%">Sign up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Homepage;
