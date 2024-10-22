import React, { useContext, useState } from "react";
import { ChatContext } from "../context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SideBar from "./partials/SideBar";
import MyChats from "./partials/MyChats";
import ChatBox from "./partials/ChatBox";

const Chatpage = () => {
  const { user } = useContext(ChatContext);
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      {user && <SideBar />}
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        w={"100%"}
        h={"90vh"}
        p={"10px"}
      >
        {user && (
          <MyChats fetchAgain={fetchAgain} />
        )}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  );
};

export default Chatpage;
