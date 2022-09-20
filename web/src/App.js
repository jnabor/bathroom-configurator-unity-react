import React from 'react';
import { Unity, useUnityContext } from 'react-unity-webgl';

import './App.css';

function App() {
    const { unityProvider, isLoaded, loadingProgression } = useUnityContext({
        loaderUrl: 'build/dist.loader.js',
        dataUrl: 'build/dist.data',
        frameworkUrl: 'build/dist.framework.js',
        codeUrl: 'build/dist.wasm',
    });

    // We'll round the loading progression to a whole number to represent the
    // percentage of the Unity Application that has loaded.
    const loadingPercentage = Math.round(loadingProgression * 100);

    return (
        <div clasName='wrapper'>
            <div className='container'>
                {isLoaded === false && (
                    // We'll conditionally render the loading overlay if the Unity
                    // Application is not loaded.
                    <div className='loading-overlay'>
                        <p>Loading... ({loadingPercentage}%)</p>
                    </div>
                )}
                <Unity className='unity' unityProvider={unityProvider} />
            </div>
        </div>
    );
}

export default App;
