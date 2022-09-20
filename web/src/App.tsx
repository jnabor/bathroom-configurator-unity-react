import React from 'react';
import { Unity, useUnityContext, IWebGLContextAttributes } from 'react-unity-webgl';

import Button from '@mui/material/Button';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

import './App.css';

const webglContextAttributes: IWebGLContextAttributes = {
  alpha: true,
  antialias: true,
  depth: true,
  failIfMajorPerformanceCaveat: true,
  powerPreference: "high-performance",
  premultipliedAlpha: true,
  preserveDrawingBuffer: true,
  stencil: true,
  desynchronized: true,
  xrCompatible: true,
}

function App() {
    const { unityProvider, isLoaded, loadingProgression, takeScreenshot } =
        useUnityContext({
            loaderUrl: 'build/dist.loader.js',
            dataUrl: 'build/dist.data',
            frameworkUrl: 'build/dist.framework.js',
            codeUrl: 'build/dist.wasm',
            streamingAssetsUrl: 'StreamingAssets',
            webglContextAttributes,
        });

    const loadingPercentage = Math.round(loadingProgression * 100);

    const handleClick = () => {
      const data = takeScreenshot("image/jpeg", 1.0);
      if (data !== null) {
        window.open(data, "_blank");
      } else {
        console.log('no data')
      }
    };

    return (
        <div className='wrapper'>
            <div className='container'>
                {isLoaded === false && (
                    <div className='loading-overlay'>
                        <p>Loading... ({loadingPercentage}%)</p>
                    </div>
                )}
                <Unity className='unity' unityProvider={unityProvider} />
                <Button
                    onClick={handleClick}
                    variant='outlined'
                    startIcon={<PhotoCamera />}
                >
                    Screenshot
                </Button>
            </div>
        </div>
    );
}

export default App;
