import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Button, Input, InputGroup, InputRightElement, VStack, useToast } from "@chakra-ui/react";
import { FormControl, FormHelperText, FormLabel } from "@chakra-ui/form-control";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);

    const toast = useToast();
    const navigate = useNavigate();

    const handleClick = () => {
        setShow(curr => !curr);
    }

    const submitHandle = async () => {
        setLoading(true);
        if (!email || !password) {
            toast({
                title: "Empty Fields",
                description: "Please Fill all the Feilds",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
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

            const { data } = await axios.post("/api/user/login", {
                email, password
            }, config);

            toast({
                title: "Login Success",
                description: "User Login Successfully",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            navigate(0); //to refresh the page after login
            navigate("/chat");

        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    }

    const guestUser = () => {
        setEmail('guest@example.com');
        setPassword('123456');
    }

    return (
        <VStack spacing="5px">
            <FormControl id='login-email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder='Enter Your Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <FormHelperText>We'll never share your email.</FormHelperText>
            </FormControl>

            <FormControl id='login-password' isRequired>
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

            <Button colorScheme="blue" variant="outline" width="100%" marginTop="15px" onClick={submitHandle} isLoading={loading}>Login</Button>
            <Button variant="outline" colorScheme="red" width="100%" onClick={guestUser}>Get Guest User Credential</Button>
        </VStack>
    )
}

export default Login;