import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export const Progress = () => {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant='indeterminate' />
        </Box>
    );
};
