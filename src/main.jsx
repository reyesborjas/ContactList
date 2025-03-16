import React from 'react'
import ReactDOM from 'react-dom/client'


import './index.css'  
import "bootstrap/dist/css/bootstrap.min.css";

import "@fortawesome/fontawesome-free/css/all.css";

import "./styles/index.css";


import { RouterProvider } from "react-router-dom";
import { router } from "./routes";  
import { StoreProvider } from './hooks/useGlobalReducer';

const Main = () => {
    return (
        <React.StrictMode>  
            <StoreProvider> 
                <RouterProvider router={router}>
                </RouterProvider>
            </StoreProvider>
        </React.StrictMode>
    );
}

// Render the Main component into the root DOM element.
ReactDOM.createRoot(document.getElementById('root')).render(<Main />)