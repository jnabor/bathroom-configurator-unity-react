import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Unity, useUnityContext } from 'react-unity-webgl';

import Typography from '@mui/material/Typography';

import { Progress } from './common/components/Progress';
import { Controls } from './common/components/Controls';

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
        dataUrl: 'build/dist.data.unityweb',
        frameworkUrl: 'build/dist.framework.js.unityweb',
        codeUrl: 'build/dist.wasm.unityweb',
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

    const progress = useMemo(
        () => Math.round(loadingProgression * 100),
        [loadingProgression],
    );

    const handleSetSelection = useCallback(
        (selection: string) => {
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
                        <Progress value={progress} />
                    </div>
                )}
                <Unity className='unity' unityProvider={unityProvider} />
                <Controls
                    requestFullscreen={requestFullscreen}
                    takeScreenshot={takeScreenshot}
                    setSelection={setSelection}
                    sendMessage={sendMessage}
                    selection={selection}
                />
            </div>
        </div>
    );
};
