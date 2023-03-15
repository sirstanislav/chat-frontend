import { useForm } from '@mantine/form';
import { upperFirst } from '@mantine/hooks';
import { Container, createStyles } from '@mantine/core';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  Button,
  Anchor,
  Stack,
} from '@mantine/core';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../redux/hooks';
import { isUserLoggedIn, userName } from '../../redux/chatSlice';
import { useSignupMutation, useSigninMutation } from '../../redux/chatApi';

const useStyles = createStyles((theme) => ({
  root: {
    margin: 'auto',
  }
}));

interface IRegisterProps {
  typeValue: string;
}

const Register: React.FunctionComponent<IRegisterProps> = ({ typeValue }) => {
  const navigate = useNavigate();
  const { classes } = useStyles();
  const dispatch = useAppDispatch();
  const [signup] = useSignupMutation();
  const [signin] = useSigninMutation();

  const [type, setType] = useState(typeValue);
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    },
  });

  async function signupUser() {
    try {
      await signup(form.values).unwrap();
      navigate("/signin")
      setType('login')
    } catch (error) {
      console.error('rejected', error);
    }
  }

  async function signinUser() {
    try {
      const payload = await signin({ email: form.values.email, password: form.values.password }).unwrap();
      dispatch(isUserLoggedIn(true))
      dispatch(userName(payload.name))
      localStorage.setItem("userId", payload.userId)
      localStorage.setItem("token", payload.token)
      localStorage.setItem("userName", payload.name)
      navigate("/")
    } catch (error) {
      console.error('rejected', error);
    }
  }

  return (
    <Container className={classes.root}>
      <Paper radius="md" p="xl" withBorder>
        <Text size="lg" weight={500}>
          Welcome to Chat, {type} with
        </Text>

        <form onSubmit={form.onSubmit(() => {
          type === "register" ? signupUser() : signinUser()
        })}>
          <Stack>
            {type === 'register' && (
              <TextInput
                required
                label="Name"
                placeholder="Your name"
                value={form.values.name}
                onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
                radius="md"
              />
            )}

            <TextInput
              required
              label="Email"
              placeholder="hello@mantine.dev"
              value={form.values.email}
              onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
              error={form.errors.email && 'Invalid email'}
              radius="md"
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              value={form.values.password}
              onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
              error={form.errors.password && 'Password should include at least 6 characters'}
              radius="md"
            />
          </Stack>

          <Group position="apart" mt="xl">
            <Anchor
              component="button"
              type="button"
              color="dimmed"
              onClick={() => {
                setType(type === 'register' ? 'login' : 'register')
                navigate(type === 'register' ? '/signin' : '/signup')
              }}
              size="xs"
            >
              {type === 'register'
                ? 'Already have an account? Login'
                : "Don't have an account? Register"}
            </Anchor>
            <Button type="submit" radius="xl">
              {upperFirst(type)}
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
};

export { Register };
