import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Button, Input, InputGroup, InputRightElement, VStack, useToast } from "@chakra-ui/react";
import { FormControl, FormHelperText, FormLabel } from "@chakra-ui/form-control";
import axios from "axios";

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [pic, setPic] = useState();
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);

    const navigate = useNavigate();

    // Create Toast
    const toast = useToast();

    const handleClick = () => {
        setShow(curr => !curr);
    }

    // Push image to the cloudinary platform
    const postDetails = (pics) => {
        setLoading(true);
        if (pics === undefined) {
            toast({
                title: 'Select Image',
                description: "Please Select an Image",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            return;
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
                    console.log(data.url.toString());
                    setLoading(false);
                })
                .catch(err => {
                    console.log(err);
                    setLoading(false);
                });
        } else {
            toast({
                title: 'Select Image',
                description: "Please Select an Image",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            setLoading(false);
            return;
        }
    }

    const submitHandle = async () => {
        setLoading(true);
        if (!name || !email || !password || !confirmPassword) {
            toast({
                title: 'Fill Fields',
                description: "Please Fill All The Fields",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            toast({
                title: 'Password Mismatch',
                description: "Password & Confirm Password Don't Match",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const { data } = await axios.post("/api/user", {
                name, email, password, pic
            }, config);

            toast({
                title: 'Registration Successful',
                description: "User Has been Registered Successfully",
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });

            // set User in local Storage
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            navigate('/chat');
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
        <VStack spacing={'5px'} >
            <FormControl id='name' isRequired>
                <FormLabel>Name</FormLabel>
                <Input placeholder='Enter Your Name' value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>

            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder='Enter Your Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <FormHelperText>We'll never share your email.</FormHelperText>
            </FormControl>

            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input type={show ? "text" : "password"} placeholder='Enter Your Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    <InputRightElement width={"4.5em"}>
                        <Button h={"1.75rem"} size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl id='confirm-password' isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input type={show ? "text" : "password"} placeholder='Enter Your Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <InputRightElement width={"4.5em"}>
                        <Button h={"1.75rem"} size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl>
                <FormLabel>Upload Your Image</FormLabel>
                <Input type={"file"} p={1.5} accept="image/" onChange={(e) => postDetails(e.target.files[0])} />
            </FormControl>

            <Button colorScheme="blue" variant="outline" width="100%" marginTop="15px" onClick={submitHandle} isLoading={loading}>Sign Up</Button>
        </VStack>
    )
}

export default SignUp;