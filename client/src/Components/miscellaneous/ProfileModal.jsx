import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    IconButton,
    Button,
    Text,
    Input,
    useToast
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDisclosure } from '@chakra-ui/hooks';
import { ViewIcon } from '@chakra-ui/icons';
import { Image } from '@chakra-ui/image';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';

const ProfileModal = ({ user, children }) => {
    const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
    const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure();

    const [name, setName] = useState('');
    const [pic, setPic] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    // logged in user
    const loggedInUser = JSON.parse(localStorage.getItem("userInfo"));

    // Push image to the cloudinary platform
    const postDetails = (pics) => {
        setLoading(true);
        if (pics === undefined) {
            setPic(user.pic);
        }

        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "mern-chatapp");
            data.append("cloud_name", "myselfswk");
            fetch("https://api.cloudinary.com/v1_1/myselfswk/image/upload", {
                method: "post",
                body: data
            })
                .then((res) => res.json())
                .then(data => {
                    setPic(data.url.toString());
                    setLoading(false);

                })
                .catch(err => {
                    setLoading(false);
                });
        } else {
            toast({
                title: 'Select Image',
                description: "Please Select jpeg/png Image",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            setLoading(false);
            return;
        }
    }

    // Update user name & pic
    const submitHandle = async () => {
        setLoading(true);

        if (!name) {
            toast({
                title: 'Enter Name Field',
                description: "Please Fill Name Field",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            await axios.put(`/api/user/${user._id}`, {
                name, pic
            }, config);

            toast({
                title: 'Update Successful',
                description: "User Has been Update Successfully",
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            const updateUser = JSON.parse(localStorage.getItem("userInfo"));
            updateUser["name"] = name;
            if (pic) {
                updateUser["pic"] = pic;
            }
            localStorage.setItem("userInfo", JSON.stringify(updateUser));

            setLoading(false);
            navigate(0);

        } catch (error) {
            toast({
                title: 'Error Occured',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            setLoading(false);
        }
    }

    return (
        <>
            {
                children ?
                    <span onClick={onViewOpen}>{children}</span>
                    : (
                        <IconButton
                            display={{ base: "flex" }}
                            icon={<ViewIcon />}
                            onClick={onViewOpen}
                        />
                    )
            }
            <Modal size={{ lg: "lg", sm: "sm" }} isOpen={isViewOpen} onClose={onViewClose} isCentered>
                <ModalOverlay />
                <ModalContent h="410px">
                    <ModalHeader
                        fontSize="40px"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent="center"
                    >{user.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDir="column"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Image
                            borderRadius="full"
                            boxSize="150px"
                            src={user.pic}
                            alt={user.name}
                        />
                        <Text
                            fontSize={{ base: "28px", md: "30px" }}
                            fontFamily="Work sans"
                        >
                            Email: {user.email}
                        </Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' variant="outline" mr={3} onClick={onViewClose}>
                            Close
                        </Button>
                        {
                            user.name === loggedInUser["name"] ? (
                                <Button colorScheme='purple' variant="outline" mr={3} onClick={onUpdateOpen}>
                                    Update
                                </Button>
                            ) : (
                                <></>
                            )
                        }

                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Update Profile Modal */}
            <Modal size={{ lg: "lg", sm: "sm" }} isOpen={isUpdateOpen} onClose={onUpdateClose} isCentered>
                <ModalOverlay />
                <ModalContent h="410px">
                    <ModalHeader
                        fontSize="40px"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent="center"
                    >Update User</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDir="column"
                        justifyContent="space-between"
                    >
                        <div style={{ margin: "auto" }}>
                            <Image
                                borderRadius="50%"
                                boxSize="100px"
                                src={user.pic}
                            />
                            <div>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    display="none"
                                    id="icon-button-file"
                                    onChange={(e) => postDetails(e.target.files[0])}
                                />
                                <label htmlFor="icon-button-file">
                                    <IconButton aria-label="upload picture" isRound={true} marginLeft="60px" marginTop="-20px" size="sm">
                                        <CameraAltOutlinedIcon />
                                    </IconButton>
                                </label>
                            </div>
                        </div>
                        <Text
                            fontSize={{ base: "20px", md: "22px" }}
                            fontFamily="Work sans"
                        >
                            Name
                        </Text>
                        <Input value={name} width={{ base: "320px", sm: "280px" }} onChange={(e) => setName(e.target.value)} />
                        <Text
                            fontSize={{ base: "20px", md: "22px" }}
                            fontFamily="Work sans"
                        >
                            Email: {user.email}
                        </Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' variant="outline" mr={3} onClick={onUpdateClose}>
                            Close
                        </Button>
                        <Button colorScheme='purple' variant="outline" mr={3} isLoading={loading} onClick={submitHandle}>
                            Done
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ProfileModal;