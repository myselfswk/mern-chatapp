import React, { useState, useEffect, useCallback } from 'react';
import { Box, Text } from '@chakra-ui/layout';
import {
    Tooltip, Button, Menu, MenuButton, MenuItem, AvatarBadge,
    MenuList, MenuDivider, Avatar, Input, useToast,
    Drawer, DrawerBody, DrawerFooter, DrawerHeader,
    DrawerOverlay, DrawerContent, DrawerCloseButton, Spinner
} from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { useDisclosure } from '@chakra-ui/hooks';
import { useNavigate } from 'react-router-dom';
import NotificationBadge, { Effect } from "react-notification-badge";
import Lottie from 'react-lottie';
import axios from 'axios';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { getSender } from '../../config/ChatLogics';
import animationData from '../../animations/message-plane.json';
import noSearchAnimationData from '../../animations/searchNotFound.json';

const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
    const navigate = useNavigate();
    const toast = useToast();

    // No Messages/Notification Animation options
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        }
    };

    // No Search Result Found Animation
    const noAnimationOptions = {
        loop: true,
        autoplay: true,
        animationData: noSearchAnimationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        }
    }

    // LogOut Functionality
    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        navigate("/");
    };

    // Handle Search Functionality
    const handleSearch = async (query) => {
        setSearch(query);

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`/api/user?search=${search}`, config);

            setLoading(false);
            setSearchResult(data);

        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    }

    // Access Chat with ID
    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    // we use content-type because we send some json data
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };

            // post request for chat
            const { data } = await axios.post('/api/chat', { userId }, config);
            // check if the chat is already present than append in it, not create new chat
            if (chats.find((c) => c._id === data.id)) {
                setChats([data, ...chats]);
            }
            setSelectedChat(data);
            setLoadingChat(false);
            onClose();

        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    }

    // Get All Users
    const handleAllUsers = useCallback(async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get('/api/user/allusers', config);
            setAllUsers(data);

        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    }, [toast, user.token]);

    useEffect(() => {
        handleAllUsers();
    }, [handleAllUsers]);

    return (
        <>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bg="white"
                w="100%"
                p="5px 10px 5px 10px"
                borderWidth="5px"
            >
                <Tooltip label="Search User to Chat" hasArrow placement='bottom-end'>
                    <Button variant="ghost" onClick={onOpen}>
                        <i className="fa fa-search" aria-hidden="true"></i>
                        <Text
                            display={{ base: "none", md: "flex" }}
                            px="4"
                        >Search User</Text>
                    </Button>
                </Tooltip>
                <Text fontSize={{ base: "sm", lg: "2xl", md: "2xl", sm: "xl" }} fontFamily="Work sans">
                    Chat App - Mern Stack
                </Text>
                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <NotificationBadge
                                count={notification.length > 9 ? "9+" : notification.length}
                                effect={Effect.SCALE}
                            />
                            <BellIcon fontSize="2xl" m={1} />
                        </MenuButton>
                        <MenuList pl={2}>
                            {/* if there is no message, no notification */}
                            {
                                !notification.length &&
                                <Lottie
                                    options={defaultOptions}
                                    height={70}
                                    width={70}
                                    style={{ margin: "auto" }}
                                />
                            }
                            {
                                notification.map((notif) => (
                                    <MenuItem
                                        key={notif._id}
                                        onClick={() => {
                                            setSelectedChat(notif.chat); //redirect to that chat from which message send
                                            setNotification(notification.filter((n) => n !== notif));
                                            //remove that notification on which onclicked perform from notification array
                                        }}
                                    >
                                        {
                                            notif.chat.isGroupChat
                                                ? `New Message in ${notif.chat.chatName}`
                                                : `New Message from ${getSender(user, notif.chat.users)}`
                                        }
                                    </MenuItem>
                                ))
                            }
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic}>
                                <AvatarBadge bg="green" boxSize="11" />
                            </Avatar>
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem><PersonIcon /><Text paddingLeft="10px">My Profile</Text></MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={logoutHandler}><ExitToAppIcon /><Text paddingLeft="10px">Log Out</Text></MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>

            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
                    <DrawerBody>
                        <Box display="flex" pb={2}>
                            <Tooltip label="More than one word to search" hasArrow placement='bottom'>
                                <Input
                                    placeholder="Search by name or email"
                                    mr={2}
                                    value={search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </Tooltip>
                        </Box>
                        <Text
                            fontSize="2xl"
                            fontWeight="bold"
                        >User List:-</Text>
                        {
                            // if loading show laod then show details
                            loading ? (
                                <ChatLoading />
                            ) : (
                                searchResult.length > 0 ? (
                                    searchResult.map((user) => (
                                        <UserListItem
                                            key={user._id}
                                            user={user}
                                            handleFunction={() => accessChat(user._id)}
                                        />
                                    ))
                                ) : (
                                    searchResult.length < 1 && search.length > 0 && <Lottie
                                        options={noAnimationOptions}
                                        height={70}
                                        width={70}
                                        style={{ margin: "auto" }}
                                    />
                                )
                            )
                        }
                        {
                            search.length < 1 && searchResult.length < 1 && (
                                allUsers?.map((users) => (
                                    <UserListItem
                                        key={users._id}
                                        user={users}
                                        handleFunction={() => accessChat(users._id)}
                                    />
                                ))
                            )
                        }
                        {loadingChat && <Spinner ml="auto" display="flex" />}
                    </DrawerBody>
                    <hr />
                    <DrawerFooter margin="auto">
                        <Text>By: Muhammad Waleed Khan</Text>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default SideDrawer;