import React, { useEffect, useState } from 'react';

import Typography from '@mui/material/Typography';

import { Progress } from './common/components/Progress';
import { Controls } from './common/components/Controls';

import './App.css';

const baseUrl = 'https://f841-70-48-67-241.ngrok.io/image';
// const baseUrl = 'http://localhost/image ';

export const Configurator = () => {
    const [selection, setSelection] = useState('1');
    const [loading, setLoading] = useState(true);
    const [img, setImg] = useState(`${baseUrl}/1.jpg`)

    useEffect(() => {
        setLoading(true);
        setImg(`${baseUrl}/${selection}.jpg`)
    }, [selection])

    useEffect(() => {
        console.log(img)
    }, [img])

    return (
        <div className='wrapper'>
            <div className='container'>
                <Typography variant='h6' gutterBottom>
                    POC - SSR WebGL
                </Typography>
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
                <Controls selection={selection} setSelection={setSelection} />
                </div>
            </div>
        </div>
    );
};
