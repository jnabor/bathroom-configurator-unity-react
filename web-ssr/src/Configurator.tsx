import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

import { Progress } from './common/components/Progress';
import { Controls } from './common/components/Controls';

import './App.css';

const baseUrl = 'https://f841-70-48-67-241.ngrok.io/image';
// const baseUrl = 'http://localhost/image ';

export const Configurator = () => {
    const [online, setOnline] = useState(false);
    const [selection, setSelection] = useState('1');
    const [loading, setLoading] = useState(true);
    const [img, setImg] = useState(`${baseUrl}/1.jpg`);

    useEffect(() => {
        fetch('https://f841-70-48-67-241.ngrok.io/')
            .then((res) => res.json())
            .then((data) => {
                data.res === 'online' && setOnline(true);
            });
    }, []);

    useEffect(() => {
        setLoading(true);
        setImg(`${baseUrl}/${selection}.jpg`);
    }, [selection]);

    useEffect(() => {
        console.log(img);
    }, [img]);

    return (
        <div className='wrapper'>
            <div className='container'>
                <Typography variant='h6' gutterBottom>
                    POC - SSR WebGL
                </Typography>
                <div className='status'>
                    {online ? (
                        <Chip
                            label='Server Online'
                            color='success'
                            variant='outlined'
                        />
                    ) : (
                        <Chip
                            label='Server Offline'
                            color='error'
                            variant='outlined'
                        />
                    )}
                </div>

                {loading && (
                    <div className='loading-overlay'>
                        <Progress />
                    </div>
                )}
                <div className='unity'>
                    <img
                        onLoad={() => setLoading(false)}
                        src={img}
                        width='960'
                        height='600'
                        alt='render'
                    />
                </div>
                <div className='controls'>
                    <Controls
                        selection={selection}
                        setSelection={setSelection}
                    />
                </div>
            </div>
        </div>
    );
};
