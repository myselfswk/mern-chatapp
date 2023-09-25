import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Text,
    Input,
    FormControl,
    IconButton,
    useToast,
    Spinner
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import axios from 'axios';
import Lottie from 'react-lottie';
import io from 'socket.io-client';

import { ChatState } from '../Context/ChatProvider';
import { getSender, getSenderFull } from '../config/ChatLogics';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import ProfileModal from './miscellaneous/ProfileModal';
import ScrollableChat from './ScrollableChat';
import animationData from '../animations/typing.json';

import './Style.css';

const ENDPOINT = "https://chatapp-nodejsapp.adaptable.app";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    // state of all of our messages (fetch messages from backend)
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);

    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();
    const toast = useToast();

    // Animation options
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    // Fetch All Messages from single chat
    const fetchMessages = useCallback(async () => {
        // check if no chat is selected
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            setLoading(true);

            const { data } = await axios.get(`/api/messages/${selectedChat._id}`, config);
            setMessages(data);
            setLoading(false);

            // users can join room
            socket.emit("join chat", selectedChat._id);

        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    }, [selectedChat, toast, user.token]);

    // Send Messages
    const sendMessages = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id);
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        "Content-Type": "application/json"
                    }
                }

                setNewMessage("");
                const { data } = await axios.post("/api/messages", {
                    content: newMessage,
                    chatId: selectedChat._id,
                }, config);

                socket.emit("new message", data);
                // append all the messages in message state
                setMessages([...messages, data]);

            } catch (error) {
                toast({
                    title: "Error Occured!",
                    description: error.response.data.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }
    }

    useEffect(() => {
        // start socket.io
        socket = io(ENDPOINT);
        socket.emit("setup", user); //for creating specific room for user
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
    }, [user]);

    useEffect(() => {
        // call fetch messages to useEffect in order to re-render if any message occur
        fetchMessages();

        // keep the backup of selected chat
        selectedChatCompare = selectedChat;
    }, [selectedChat, fetchMessages]);
    // selectedChat, whenever user select different chat, useEffect will render UI

    useEffect(() => {
        //run everytime our state update
        // check if we receive any message from that socket
        socket.on('message recieved', (newMessageRecieved) => {
            if (
                !selectedChatCompare || // if chat is not selected or doesn't match current chat
                selectedChatCompare._id !== newMessageRecieved.chat._id //show notification if selected chat is not eqaul with new message chat that recieved
            ) {
                // give notification
                if (!notification.includes(newMessageRecieved)) {  //notification object doesn't have new message (doesn't include the message if chat is selected)
                    setNotification([newMessageRecieved, ...notification]); // ...notification (spread remaining notification)
                    setFetchAgain(!fetchAgain); // update list of our chat (updated list of chat)
                }
            } else {
                setMessages([...messages, newMessageRecieved]);
            }
        });
    });

    // Typing Input (typing user functonality)
    const typingHandler = (e) => {
        setNewMessage(e.target.value);
        // typing indicator logic
        if (!socketConnected) return;

        // this function gonna run everytime any key is pressed
        if (!typing) {
            setTyping(true);
            socket.emit("typing", [selectedChat._id, user._id]); //the selected chat id for room
        }

        // debouncing type functionality
        let lastTypingTime = new Date().getTime();
        // stop the typing timer after 3 sec
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", [selectedChat._id, user._id]);
                setTyping(false);
            }
        }, timerLength);
    }

    return (
        <>
            {
                selectedChat ? (
                    <>
                        <Text
                            fontSize={{ base: "28px", md: "30px" }}
                            pb={3}
                            px={2}
                            w="100%"
                            fontFamily="Work sans"
                            display="flex"
                            justifyContent={{ base: "space-between" }}
                            alignItems="center"
                            fontWeight="semibold"
                        >
                            <IconButton
                                display={{ base: "flex", md: "none" }}
                                icon={<ArrowBackIcon />}
                                onClick={() => setSelectedChat("")}
                            />
                            {/* if the selected chat is not group chat */}
                            {
                                !selectedChat.isGroupChat ? (
                                    <>
                                        {getSender(user, selectedChat.users)}
                                        <ProfileModal
                                            user={getSenderFull(user, selectedChat.users)}
                                        />
                                    </>
                                ) : (
                                    <>
                                        {selectedChat.chatName.toUpperCase()}
                                        <UpdateGroupChatModal
                                            fetchAgain={fetchAgain}
                                            setFetchAgain={setFetchAgain}
                                            fetchMessages={fetchMessages}
                                        />
                                    </>
                                )
                            }
                        </Text>
                        <Box
                            display="flex"
                            flexDir="column"
                            justifyContent="flex-end"
                            p={3}
                            bg="#E8E8E8"
                            w="100%"
                            h="100%"
                            borderRadius="lg"
                            overflowY="hidden"
                        >
                            {/* Message Box Here */}
                            {
                                loading ? (
                                    <Spinner
                                        size="xl"
                                        w={20}
                                        h={20}
                                        alignSelf="center"
                                        margin="auto"
                                    />
                                ) : (
                                    <div className='messages'>
                                        {/* Messages */}
                                        <ScrollableChat messages={messages} />
                                    </div>
                                )
                            }
                            <FormControl onKeyDown={sendMessages} isRequired mt={3}>
                                {
                                    istyping ? (
                                        <div>
                                            <Lottie
                                                options={defaultOptions}
                                                width={70}
                                                style={{ marginBottom: 15, marginLeft: 0 }}
                                            />
                                        </div>
                                    ) : (
                                        <></>
                                    )
                                }
                                <Input
                                    variant="filled"
                                    bg="#E0E0E0"
                                    placeholder="Enter a message.."
                                    value={newMessage}
                                    onChange={typingHandler}
                                />
                            </FormControl>
                        </Box>
                    </>
                ) : (
                    <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                        <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                            Click on a user to start chatting
                        </Text>
                    </Box>
                )
            }
        </>
    )
}

export default SingleChat;