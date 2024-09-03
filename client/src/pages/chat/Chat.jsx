import { Box } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import SideDrawer from "../../components/miscellaneous/SideDrawer";
import MyChats from "../../components/MyChats";
import ChatBox from "../../components/ChatBox";

const Chat = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="bg-[url('https://i.ibb.co/q1GLt6X/background-1.png')] w-full bg-no-repeat bg-cover">
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
};

export default Chat;
