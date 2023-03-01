import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { Avatar, Tooltip } from '@chakra-ui/react';

import { isSameSender, isLastMessage, isSameSenderMargin, isSameUser } from '../config/ChatLogics';
import { ChatState } from '../Context/ChatProvider';

const ScrollableChat = ({ messages }) => {
    const { user } = ChatState();

    return (
        <ScrollableFeed>
            {
                messages && messages.map((m, i) => (
                    <div style={{ display: "flex" }} key={m._id}>
                        {/* for same sender and last message */}
                        {
                            (
                                isSameSender(messages, m, i, user._id)
                                || isLastMessage(messages, i, user._id)
                            ) && (
                                <Tooltip
                                    label={m.sender.name}
                                    placement="bottom-start"
                                    hasArrow
                                >
                                    <Avatar
                                        mt="7px"
                                        mr={1}
                                        size="sm"
                                        cursor="pointer"
                                        name={m.sender.name}
                                        src={m.sender.pic}
                                    />
                                </Tooltip>
                            )
                        }
                        <Tooltip label={
                            m.createdAt.split("T")[1].substring(0, 2) > 12 ?
                                `${m.createdAt.split("T")[1].substring(0, 2) - 7}:${m.createdAt.split("T")[1].substring(3, 8)} PM`
                                : `${m.createdAt.split("T")[1].substring(0, 8)} AM`
                        } hasArrow>
                            <span
                                style={{
                                    backgroundColor: `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"}`,
                                    marginLeft: isSameSenderMargin(messages, m, i, user._id),
                                    marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                                    borderRadius: "20px",
                                    padding: "5px 15px",
                                    maxWidth: "75%",
                                    cursor: "pointer"
                                }}
                            >{m.content}</span>
                        </Tooltip>
                    </div>
                ))
            }
        </ScrollableFeed >
    )
}

export default ScrollableChat;