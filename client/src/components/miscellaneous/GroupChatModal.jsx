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
} from "@chakra-ui/react";
import UserListItem from "./UserListItem";
import { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import {
  useCreateGroupChatMutation,
  useGetUserBySearchQuery,
} from "../../redux/features/callApis/chatApi";
import UserbadgeItem from "../UserbadgeItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);

  const { selectedChat, setSelectedChat, setChats, chats } = ChatState();
  const { user } = useSelector((state) => state.auth);
  const [createGroup] = useCreateGroupChatMutation();
  const { data } = useGetUserBySearchQuery(search);

  const handleSearch = async (query) => {
    if (query) setSearch(query);

    try {
      setSearchResult(data?.data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast.warning(`Please fill all the field`);
    }
    const groupData = {
      name: groupChatName,
      users: selectedUsers,
    };

    try {
      const res = await createGroup(groupData);
      if (res.error) {
        toast.error(res.error.data.message);
      } else {
        toast.success(res.data?.message);
        setChats([res.data.data, ...chats]);
        onClose();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast.warning("user already added");
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px" d="flex" justifyContent="center">
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: John, Piyush, Jane"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box w="100%" d="flex" flexWrap="wrap">
              {selectedUsers.map((u) => {
                return (
                  <UserbadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleDelete(u)}
                  />
                );
              })}
            </Box>
            {loading ? (
              <div>Loading...</div>
            ) : searchResult.length !== 0 ? (
              data?.data
                ?.slice(0, 4)
                ?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSubmit} colorScheme="blue">
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
