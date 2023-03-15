import * as React from 'react';
import { Message } from '../Message/Message';
import { useCallback, useEffect } from 'react';
import { Register } from '../Register/Register';
import { Messages } from '../Messages/Messages';
import { useAppDispatch } from '../../redux/hooks';
import { isUserLoggedIn } from '../../redux/chatSlice';
import { useCheckTokenMutation } from '../../redux/chatApi';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HeaderResponsive } from '../HeaderResponsive/HeaderResponsive';
import { ColorScheme, ColorSchemeProvider, createStyles, MantineProvider } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  root: {
    minWidth: 320,
    minHeight: "100vh",
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    margin: '0 auto',
  }
}));

const router = createBrowserRouter([
  {
    path: "/",
    element: <>
      <HeaderResponsive />
      <Messages />
      <Message />
    </>,
  },
  {
    path: "/signup",
    element: <>
      <Register typeValue="register" />
    </>,
  },
  {
    path: "/signin",
    element: <>
      <Register typeValue="login" />
    </>,
  }
]);

interface IAppProps { }

const App: React.FunctionComponent<IAppProps> = (props) => {
  const { classes } = useStyles();
  const dispatch = useAppDispatch();
  const [tokenMutation] = useCheckTokenMutation();

  const checkToken = useCallback(async () => {
    if (localStorage.getItem("token")) {
      const token = localStorage.getItem("token");
      try {
        await tokenMutation(token).unwrap();
        dispatch(isUserLoggedIn(true))
      } catch (error) {
        console.error('rejected', error);
        dispatch(isUserLoggedIn(false))
        localStorage.clear();
        window.location.reload();
      }
    }
  }, [dispatch, tokenMutation]);


  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  useHotkeys([["mod+J", () => toggleColorScheme()]]);

  useEffect(() => {
    checkToken();
  }, [checkToken]);

  return <div className={classes.root}>
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{
          colorScheme, loader: "dots", components: {
            Container: {
              defaultProps: {
                sizes: {
                  xs: 540,
                  sm: 720,
                  md: 960,
                  lg: 1140,
                  xl: 1320,
                },
              },
            },
          },
        }}
        withGlobalStyles
        withNormalizeCSS
      >
        <RouterProvider router={router} />
      </MantineProvider>

    </ColorSchemeProvider>

  </div>;
};

export { App };
