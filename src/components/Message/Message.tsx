import uuid from 'react-uuid';
import * as React from 'react';
import { useForm } from '@mantine/form';
import { useAppSelector } from '../../redux/hooks';
import { Container, TextInput } from '@mantine/core';
import { useSendMessageMutation } from '../../redux/chatApi';

interface IMessageProps {
}

const Message: React.FunctionComponent<IMessageProps> = (props) => {
  const { userInfo } = useAppSelector((state) => state.chatSlice);
  const form = useForm({
    initialValues: {
      message: '',
    },
  });
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const [sendMessage] = useSendMessageMutation()

  const handleSubmit = async () => {
    try {
      await sendMessage({
        token: token,
        message: {
          id: uuid(),
          owner: userId,
          userName: userName,
          text: form.values.message,
        }
      }).unwrap();
      form.reset();
    } catch (error) {
      console.error('rejected', error);
    }
  }

  if (!userInfo.isUserLoggedIn) return <></>

  return <Container style={{ width: '100%' }} mt="auto">
    <form onSubmit={form.onSubmit(() => {
      handleSubmit()
    })}>
      <TextInput mb={30}
        required
        placeholder="Your message"
        label="Your message"
        withAsterisk
        value={form.values.message}
        onChange={(event) => form.setFieldValue('message', event.currentTarget.value)}
      ></TextInput>
    </form>
  </Container>
};

export { Message };
