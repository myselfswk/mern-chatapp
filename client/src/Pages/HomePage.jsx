import React from 'react';
import { Container, Box, Text, Tabs, Tab, TabList, TabPanel, TabPanels } from '@chakra-ui/react';

import Login from "../Components/Authentication/Login";
import SignUp from '../Components/Authentication/SignUp';

const HomePage = () => {
  return (
    <Container maxW='xl' centerContent>
      <Box
        display='flex'
        justifyContent="center"
        padding="3"
        bg={"white"}
        w="100%"
        m={"40px 0 15px 0"}
        borderRadius="lg"
        borderWidth={"1px"}
      ><Text
        fontSize={"4xl"}
        fontFamily="work sans"
      >Chat App - MERN Stack</Text></Box>
      <Box
        bg={"white"}
        w="100%"
        p={4}
        borderRadius="lg"
        borderWidth={"1px"}
      >
        <Tabs variant='soft-rounded'>
          <TabList mb={"1em"}>
            <Tab width={"50%"}>Login</Tab>
            <Tab width={"50%"}>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default HomePage;