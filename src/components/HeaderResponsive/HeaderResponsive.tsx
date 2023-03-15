import {
  createStyles,
  Header,
  Container,
  Group,
  Burger,
  Paper,
  Transition,
  rem,
  Button,
  Text,
  Switch,
  useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';
import { isUserLoggedIn } from '../../redux/chatSlice';
import { IconSun, IconMoonStars } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

const HEADER_HEIGHT = rem(60);

const useStyles = createStyles((theme) => ({
  root: {
    position: 'relative',
    zIndex: 1,
    border: "none"
  },

  dropdown: {
    position: 'absolute',
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: 'hidden',

    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },

  links: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },

    [theme.fn.smallerThan('sm')]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
    },
  },
  hiddenMobile: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },
  hiddenDesktop: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },
}));

interface IHeaderResponsiveProps {
}

const HeaderResponsive: React.FC<IHeaderResponsiveProps> = (
  props
) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { classes, theme } = useStyles();
  const [opened, { toggle }] = useDisclosure(false);
  const { userInfo: getUserInfo } = useAppSelector((state) => state.chatSlice);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const handleSignOut = () => {
    dispatch(isUserLoggedIn(false));
    localStorage.clear()
  }

  return (
    <Header height={HEADER_HEIGHT} className={classes.root}>
      <Container className={classes.header}>
        <Text variant="gradient" fz="xl" fw={900}
          gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}>Chat</Text>

        <Group position="center" my={30}>
          <Switch
            checked={colorScheme === 'dark'}
            onChange={() => toggleColorScheme()}
            size="lg"
            onLabel={<IconSun color={theme.white} size="1.25rem" stroke={1.5} />}
            offLabel={<IconMoonStars color={theme.colors.gray[6]} size="1.25rem" stroke={1.5} />}
          />
        </Group>

        <Group className={classes.hiddenMobile}>
          {getUserInfo.isUserLoggedIn
            ?
            <Button variant="default"
              onClick={() => {
                handleSignOut()
                navigate('/');
                localStorage.removeItem('token')
              }}>Exit</Button>
            :
            <>
              <Button variant="default"
                onClick={() => {
                  navigate('/signin');
                }}>Log in</Button>
              <Button onClick={() => {
                navigate('/signup');
              }}>Sign up</Button>
            </>
          }
        </Group>

        <Burger opened={opened} onClick={toggle} className={classes.burger} size="sm" />

        <Transition transition="pop-top-right" duration={200} mounted={opened}>
          {(styles) => (
            <Paper className={classes.dropdown} withBorder style={styles}>

              <Group position="center" grow pb="xl" px="md" mt='lg'>
                {getUserInfo.isUserLoggedIn
                  ?
                  <Button variant="default"
                    onClick={() => {
                      handleSignOut()
                      navigate('/');
                      localStorage.removeItem('token')
                    }}>Exit</Button>
                  :
                  <>
                    <Button variant="default"
                      onClick={() => {
                        navigate('/signin');
                      }}>Log in</Button>
                    <Button onClick={() => {
                      navigate('/signup');
                    }}>Sign up</Button>
                  </>
                }
              </Group>

            </Paper>
          )}
        </Transition>
      </Container>
    </Header>
  );
}

export { HeaderResponsive };

