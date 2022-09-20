import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Unity, useUnityContext } from 'react-unity-webgl';

import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import IconButton from '@mui/material/IconButton';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import Tooltip from '@mui/material/Tooltip';

import './App.css';

export const Configurator = () => {
    const {
        unityProvider,
        isLoaded,
        loadingProgression,
        takeScreenshot,
        requestFullscreen,
        sendMessage,
        addEventListener,
        removeEventListener,
    } = useUnityContext({
        loaderUrl: 'build/dist.loader.js',
        dataUrl: 'build/dist.data',
        frameworkUrl: 'build/dist.framework.js',
        codeUrl: 'build/dist.wasm',
        streamingAssetsUrl: 'StreamingAssets',
        webglContextAttributes: {
            alpha: true,
            antialias: true,
            depth: true,
            failIfMajorPerformanceCaveat: true,
            powerPreference: 'high-performance',
            premultipliedAlpha: true,
            preserveDrawingBuffer: true,
            stencil: true,
            desynchronized: true,
            xrCompatible: true,
        },
    });
    const [selection, setSelection] = useState('1');

    const loadingPercentage = useMemo(
        () => Math.round(loadingProgression * 100),
        [loadingProgression],
    );

    const handleScreenshot = useCallback(() => {
        const data = takeScreenshot('image/jpeg', 1.0);
        if (data !== null) {
            window.open(data, 'popup', 'width=960,height=600');
        } else {
            console.log('no data');
        }
    }, [takeScreenshot]);

    const handleFullscreen = useCallback(() => {
        requestFullscreen(true);
    }, [requestFullscreen]);

    useEffect(() => {
        console.log(selection);
    }, [selection]);

    const handleSelect = useCallback(
        (event: React.MouseEvent<HTMLElement>, selected: string) => {
            setSelection(selected);
            sendMessage('Button-1', 'SetFixture', selected);
        },
        [setSelection, sendMessage],
    );

    const handleSetSelection = useCallback(
        (selection: string) => {
            console.log('received', selection);
            setSelection(selection);
        },
        [setSelection],
    );

    useEffect(() => {
        addEventListener('SetSelection', handleSetSelection);

        return () => {
            removeEventListener('SetSelection', handleSetSelection);
        };
    }, [addEventListener, removeEventListener, handleSetSelection]);

    return (
        <div className='wrapper'>
            <div className='container'>
                <Typography variant='h6' gutterBottom>
                    Room Configurator POC with Unity & React
                </Typography>
                {isLoaded === false && (
                    <div className='loading-overlay'>
                        <p>Loading... ({loadingPercentage}%)</p>
                    </div>
                )}
                <Unity className='unity' unityProvider={unityProvider} />
                <div className='controls'>
                    <div className='selector'>
                        <ToggleButtonGroup
                            color='primary'
                            value={selection}
                            exclusive
                            onChange={handleSelect}
                            aria-label='Platform'
                        >
                            <ToggleButton value='1'>SINK 1</ToggleButton>
                            <ToggleButton value='2'>SINK 2</ToggleButton>
                            <ToggleButton value='3'>SINK 3</ToggleButton>
                        </ToggleButtonGroup>
                    </div>
                    <div className='screen'>
                        <div className='screen-control-wrapper'>
                            <Tooltip title='Take Screenshot'>
                                <IconButton
                                    onClick={handleScreenshot}
                                    color='primary'
                                    aria-label='take screeshot'
                                    component='label'
                                >
                                    <PhotoCameraIcon />
                                </IconButton>
                            </Tooltip>
                        </div>

                        <div className='screen-control-wrapper'>
                            <Tooltip title='Enter Fullscreen'>
                                <IconButton
                                    onClick={handleFullscreen}
                                    color='primary'
                                    aria-label='enter fullscreen'
                                    component='label'
                                >
                                    <FullscreenIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
