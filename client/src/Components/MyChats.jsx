import React, { useState, useEffect } from 'react';
import { useToast, Box, Button, Text, Stack } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import axios from 'axios';

import { ChatState } from '../Context/ChatProvider';
import ChatLoading from '../Components/ChatLoading';
import GroupChatModal from '../Components/miscellaneous/GroupChatModal';
import { getSender } from '../config/ChatLogics';

const MyChats = ({ fetchAgain }) => {
    const [loggedUser, setLoggedUser] = useState();
    const { chats, setChats, user, selectedChat, setSelectedChat } = ChatState();
    const toast = useToast();

    // Get Chats from database
    const fetchChats = async () => {
        try {
            // Logged In User
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get("/api/chat", config);
            setChats(data);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the chats",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
    }, [fetchAgain]);
    // whenever, any changes happen in the chats... useEffect runs

    return (
        <Box
            display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            flexDir="column"
            alignItems="center"
            p={3}
            bg="white"
            w={{ base: "100%", md: "31%" }}
            borderRadius="lg"
            borderWidth="1px"
        >
            <Box
                pb={3}
                px={3}
                fontSize={{ base: "28px", md: "30px" }}
                fontFamily="Work sans"
                display="flex"
                w="100%"
                justifyContent="space-between"
                alignItems="center"
            >
                My Chats
                {/* wrap this button GroupChatModal */}
                <GroupChatModal>
                    <Button
                        display="flex"
                        fontSize={{ base: "17px", lg: "17px" }}
                        rightIcon={<AddIcon />}
                        paddingLeft={{ md: "10px" }}
                    >
                        <Text display={{ base: "flex", lg: "flex", md: "none" }}>New Group Chat</Text>
                    </Button>
                </GroupChatModal>
            </Box>
            <Box
                display="flex"
                flexDir="column"
                p={3}
                bg="#F8F8F8"
                w="100%"
                h="100%"
                borderRadius="lg"
                overflowY="hidden"
            >
                {chats ? (
                    <Stack overflowY="scroll">
                        {
                            chats.map((chat) => (
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
                                        {
                                            !chat.isGroupChat
                                                ? getSender(loggedUser, chat.users)
                                                : chat.chatName
                                        }
                                    </Text>
                                    {chat.latestMessage && (
                                        <Text fontSize="xs">
                                            <b>{chat.latestMessage.sender.name} : </b>
                                            {
                                                chat.latestMessage.content.length > 50
                                                    ? chat.latestMessage.content.substring(0, 51) + "..."
                                                    : chat.latestMessage.content
                                            }
                                        </Text>
                                    )}
                                </Box>
                            ))
                        }
                    </Stack>
                ) : (
                    <ChatLoading />
                )}
            </Box>
        </Box>
    )
}

export default MyChats;