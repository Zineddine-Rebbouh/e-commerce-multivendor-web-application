import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux'
import store from './redux/store.js'
import ErrorBoundary from './components/ErrorBoundary.jsx'

const queryClient = new QueryClient();

ReactDOM.createRoot( document.getElementById( 'root' ) ).render(
  <Provider store={ store }>
    <QueryClientProvider client={ queryClient }>
      <BrowserRouter>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  </Provider>
)
