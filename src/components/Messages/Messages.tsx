import * as React from 'react';
import { useAppSelector } from '../../redux/hooks';
import { Container, ScrollArea } from '@mantine/core';
import { useRef, useEffect, useCallback } from 'react';
import { useAllMessagesQuery } from '../../redux/chatApi';
import {
  createStyles,
  Text,
  Avatar,
  Group,
  TypographyStylesProvider,
  Paper,
} from '@mantine/core';

const useStyles = createStyles((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  messageContainer: {
    display: 'flex',
  },
  comment: {
    width: '50%',
    padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
    [theme.fn.smallerThan('md')]: {
      width: '80%',
    },
  },

  body: {
    paddingTop: theme.spacing.sm,
    fontSize: theme.fontSizes.sm,
  },

  content: {
    '& > p:last-child': {
      marginBottom: 0,
    },
  },
}));


type MessageType = {
  owner: string;
  text: string;
  _id: string;
  userName: string;
}

const cardContent = {
  image: "https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
}

interface IMessagesProps {
}

const Messages: React.FC<IMessagesProps> = (props) => {
  const { classes } = useStyles();
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");
  const { data: messages } = useAllMessagesQuery(token);
  const { userInfo } = useAppSelector((state) => state.chatSlice);
  const viewport = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (viewport.current) {
      viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });
    }
  }, [])

  useEffect(() => {
    if (messages) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  if (!userInfo.isUserLoggedIn) return <></>

  return <Container className={classes.root}>
    <ScrollArea h="80vh" type='never' viewportRef={viewport}>
      {messages?.map((message: MessageType, index) => (
        <Container key={index} className={classes.messageContainer} style={message.userName === userName ? { justifyContent: "flex-end" } : { justifyContent: "flex-start" }}>
          <Paper withBorder radius="lg" className={classes.comment} my="md">
            <Group style={message.userName === userName ? { justifyContent: "flex-end" } : { justifyContent: "flex-start" }}>
              <Avatar src={cardContent.image} alt={''} radius="xl" />
              <div>
                <Text fz="sm">{message.userName}</Text>
              </div>
            </Group>
            <TypographyStylesProvider className={classes.body}>
              <div className={classes.content} dangerouslySetInnerHTML={{ __html: message.text }} />
            </TypographyStylesProvider>
          </Paper>
        </Container>
      ))}
    </ScrollArea>
  </Container >
};

export { Messages };
