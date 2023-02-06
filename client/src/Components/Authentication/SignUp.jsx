import React, { useState, useEffect } from 'react';
import { Button, Input, InputGroup, InputRightElement, VStack } from "@chakra-ui/react";
import { FormControl, FormHelperText, FormLabel } from "@chakra-ui/form-control";

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [pic, setPic] = useState();

    const [show, setShow] = useState(false);

    const handleClick = () => {
        setShow(curr => !curr);
    }

    const postDetails = (pics) => { }

    const submitHandle = () => { }

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

            <Button colorScheme="blue" variant="outline" width="100%" marginTop="15px" onClick={submitHandle}>Sign Up</Button>
        </VStack>
    )
}

export default SignUp;