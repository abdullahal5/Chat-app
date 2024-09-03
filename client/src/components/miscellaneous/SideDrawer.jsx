import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import ProfileModal from "./ProfileModal";
import { logout } from "../../redux/features/slice/authSlice";
import { toast } from "sonner";
import {
  useAccessChatMutation,
  useGetUserBySearchQuery,
} from "../../redux/features/callApis/chatApi";
import ChatLoading from "../ChatLoading";
import UserListItem from "./UserListItem";
import { ChatState } from "../../context/ChatProvider";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const dispatch = useDispatch();
  const btnRef = useRef();

  const { user } = useSelector((state) => state.auth);

  const { setSelectedChat, notification, setNotification, chats, setChats } =
    ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data, isFetching } = useGetUserBySearchQuery(search);
  const [addAccessChat] = useAccessChatMutation();

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const searchInput = e.target.search.value;

    if (!searchInput) {
      toast.warning("Please enter something in search");
    }

    setSearch(searchInput);
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const res = await addAccessChat(userId);
      const data = res.data.data;
      if (res.error) {
        toast.error(res?.error?.data?.message, {
          duration: 2000,
        });
      } else {
        if (!chats?.find((c) => c._id === data._id)) setChats([data, ...chats]);
        setSelectedChat(data);
        setLoadingChat(false);
        onClose();
        toast.success(res?.data?.message, {
          duration: 2000,
        });
      }
    } catch (error) {
      setLoadingChat(false);
      console.log(error);
      toast.error(error.message, {
        duration: 2000,
      });
    }
  };

  //  console.log(chats);

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        p="5px 10px 5px 10px"
        borderWidth="3px"
      >
        <Tooltip label="Search users to chat" hasArrow placement="bottom">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px="2">
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl">Knock Knock</Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize={"2xl"} m={1} />
            </MenuButton>
            {/* <MenuList>
            sdf
          </MenuList> */}
          </Menu>

          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                src={user?.pic}
                name={user?.name || "GU"}
                size="sm"
                cursor="pointer"
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>MY Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search user to chat</DrawerHeader>

          <DrawerBody>
            <form onSubmit={handleSearch} className="flex">
              <Input mr={2} name="search" placeholder="Search here..." />
              <Button type="submit">Go</Button>
            </form>
            {isFetching ? (
              <ChatLoading />
            ) : data?.data?.length ? (
              data.data.map((user) => (
                <UserListItem
                  key={user._id}
                  handleFunction={() => accessChat(user._id)}
                  user={user}
                >
                  {user?.name}
                </UserListItem>
              ))
            ) : (
              <p>No users found</p>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
