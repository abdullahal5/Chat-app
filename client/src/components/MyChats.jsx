import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMyChatsQuery } from "../redux/features/callApis/chatApi";
import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { ChatState } from "../context/ChatProvider";
import { getSender } from "../config/ChatLogics";
import "../app.css";
import GroupChatModal from "./miscellaneous/GroupChatModal";

const MyChats = () => {
  const { user } = useSelector((state) => state.auth);
  const { selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const dispatch = useDispatch();
  const { data, isFetching } = useMyChatsQuery();

  useEffect(() => {
    if (data && !isFetching) {
      setChats(data.data);
    }
  }, [data, isFetching, dispatch]);

  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <div className="flex items-center justify-between">
        <p className="text-2xl">My Chats</p>
        <GroupChatModal>
          <Button
            d="flex"
            fontSize={{ base: "5px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </div>

      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        borderRadius="lg"
        overflowY="hidden"
        mt={5}
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats?.map((chat) => {
              return (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                  color={selectedChat === chat ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={chat._id}
                >
                  <Text>
                    {!chat.isGroupChat
                      ? getSender(user, chat.users)
                      : chat.chatName}
                  </Text>
                </Box>
              );
            })}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
