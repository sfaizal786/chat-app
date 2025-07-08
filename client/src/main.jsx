import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from './components/ui/sonner.tsx'
import { SocketProvider } from './context/SocketContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
//  <StrictMode>
<><SocketProvider>
    <App />
    <Toaster closeButton/>
    </SocketProvider>
    </>
 // </StrictMode>,
)
