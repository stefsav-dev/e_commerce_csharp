// src/App.tsx
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import AppRoutes from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
        <ToastContainer position="bottom-right" />
      </BrowserRouter>
    </Provider>
  );
}

export default App;