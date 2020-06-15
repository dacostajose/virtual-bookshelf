import React, { useEffect, useContext } from 'react';
import Routes from './router';
import { StylesProvider, createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { observer } from 'mobx-react-lite';
import { MainStore } from './stores/mainStore';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#006F99"
    },
    secondary: {
      main: "#0E1E3D"
    },
    success: {
      main: "#408400"
    },
    warning: {
      main: "#EFC620"
    },
    error: {
      main: "#EF423B"
    },
  },
});
const App = observer(() => {
  const mainStore = useContext(MainStore);

  useEffect(() => {
    mainStore.loadBooks();
  })
  return (
    <ThemeProvider theme={theme}>
      <StylesProvider injectFirst>
        <Routes />
      </StylesProvider>
    </ThemeProvider>
  );
})

export default App;
