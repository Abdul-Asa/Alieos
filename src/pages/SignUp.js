import React, { useState } from 'react';
import {
  Box,
  VStack,
  Button,
  Heading,
  Input,
  Text,
  Stack,
  Flex,
  FormLabel,
  FormControl,
  Checkbox,
  Image,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from '../elements/components/ColorModeSwitcher';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  setUser,
  loginAction,
  signupAction,
  setToken,
  getUser,
  setName,
  setId,
} from '../utils/actions';
import logo from '../elements/assets/favicon.ico';

const Entry = ({ type }) => {
  // const [isLaptopSize] = useMediaQuery(['(min-width: 1023px)']);
  const [message, setmessage] = useState('');
  const user = getUser();

  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', fullName: '' });
  var validRegex =
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  const validateForm = () => {
    return form.password.length >= 6 && form.email.match(validRegex);
  };

  const handleChange = e => {
    e.preventDefault();
    const { value, name } = e.target;
    setForm(el => {
      return { ...el, [name]: value };
    });
  };
  if (user) {
    return <Navigate to={'/dashboard'} />;
  }

  return (
    <Box>
      <VStack h="100vh">
        <Flex p={[2, 4]} justify={'space-between'} w="full">
          <Button variant={'unstyled'} onClick={() => navigate('/')}>
            <Image src={logo} boxSize={10} />
          </Button>
          <ColorModeSwitcher />
        </Flex>
        <Stack
          // bg="red"
          align={'center'}
          w={['full', 'full', '60%']}
          // bg="brown"
          // pt={['16', 20]}
        >
          <Stack spacing={4}>
            <Heading pb={[0, 6]} fontSize={['2xl', '2xl', '4xl']}>
              {type === 'Login' ? '🚪' : '📬'} {type}
            </Heading>
            {type === 'Sign-up' && (
              <FormControl>
                <FormLabel pl="1">Full Name:</FormLabel>
                <Input
                  value={form.fullName}
                  type={'text'}
                  rounded={'none'}
                  maxW="300px"
                  placeholder="John Doe"
                  name="fullName"
                  autoComplete={'false'}
                  onChange={handleChange}
                />
              </FormControl>
            )}
            <FormControl>
              <FormLabel pl="1">Email:</FormLabel>
              <Input
                value={form.email}
                type={'text'}
                rounded={'none'}
                maxW="300px"
                placeholder="test@gmail.com"
                name="email"
                autoComplete={'false'}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel pl="1">Password:</FormLabel>
              <Input
                value={form.password}
                rounded={'none'}
                type={'password'}
                maxW="300px"
                placeholder="* * * * * *"
                name="password"
                autoComplete={'false'}
                onChange={handleChange}
              />
            </FormControl>
            <Stack pt="2" spacing={'4'}>
              <Checkbox
                isChecked={form.email.match(validRegex) ? true : false}
                isReadOnly
                _checked={{
                  textDecoration: 'line-through',
                  opacity: 0.375,
                }}
              >
                <Text fontSize={['12px', '12px', '16px']}>Valid email</Text>
              </Checkbox>
              <Checkbox
                isChecked={form.password.length >= 6 ? true : false}
                isReadOnly
                _checked={{
                  textDecoration: 'line-through',
                  opacity: 0.375,
                }}
              >
                <Text fontSize={['12px', '12px', '16px']}>
                  Password must be longer than 6 characters
                </Text>
              </Checkbox>
              <Flex
                visibility={message ? 'visible' : 'hidden'}
                align="center"
                p={1}
                bg="rgb(251 243 219)"
                w="75%"
                color="black"
              >
                <span>⚠️</span>
                <Text pl="3" fontSize={['12px', '12px', '16px']}>
                  {message}
                </Text>
              </Flex>
            </Stack>
            <Button
              disabled={!validateForm()}
              w="60%"
              alignSelf={'center'}
              onClick={
                type === 'Login'
                  ? () => {
                      loginAction(form).then(data => {
                        if (data.token) {
                          setToken(data.token);
                          setName(data.first_name);
                          setId(data.user);
                          setUser(form.email);
                          navigate('/dashboard');
                        } else {
                          setmessage('Error');
                        }
                      });
                    }
                  : () => {
                      signupAction(form).then(data => {
                        if (data.first_name) {
                          navigate('/login');
                        } else {
                          setmessage('Error');
                        }
                      });
                    }
              }
            >
              {type === 'Login' ? 'Login' : 'Sign up'}
            </Button>
            <Text
              pl={[0, '3']}
              fontSize={['12px', '12px', '18px']}
              textAlign="center"
            >
              {' '}
              {type === 'Login' ? "Don't have an account?" : 'Have an account?'}
              <Button
                variant={'link'}
                ml={3}
                // leftIcon={<FiArrowUpRight color={color} />}
                textDecor="underline"
                // textColor={color}
                onClick={
                  type === 'Login'
                    ? () => {
                        navigate('/signup');
                        if (form.email || form.password)
                          setForm({ email: '', password: '' });
                        if (message) setmessage('');
                      }
                    : () => {
                        navigate('/login');
                        if (form.email || form.password)
                          setForm({ email: '', password: '' });
                        if (message) setmessage('');
                      }
                }
              >
                {type === 'Login' ? 'Sign up' : 'Login'}
              </Button>
            </Text>
          </Stack>
        </Stack>
      </VStack>
    </Box>
  );
};

export default Entry;
