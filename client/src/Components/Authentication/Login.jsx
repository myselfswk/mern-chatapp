import React, { useState, useEffect } from 'react';
import { Button, Input, InputGroup, InputRightElement, VStack } from "@chakra-ui/react";
import { FormControl, FormHelperText, FormLabel } from "@chakra-ui/form-control";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [show, setShow] = useState(false);

    const handleClick = () => {
        setShow(curr => !curr);
    }

    const submitHandle = () => { }

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

            <Button colorScheme="blue" variant="outline" width="100%" marginTop="15px" onClick={submitHandle}>Login</Button>
            <Button variant="outline" colorScheme="red" width="100%" onClick={guestUser}>Get Guest User Credential</Button>
        </VStack>
    )
}

export default Login;