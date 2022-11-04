import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Configurator } from './Configurator';

const theme = createTheme({
    palette: {
        primary: {
            main: '#fe7c55',
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Configurator />
        </ThemeProvider>
    );
}

export default App;
