import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";

import { QueryClient, QueryClientProvider } from 'react-query';

import Todos from "./pages/todos";

function App() {

  const client = new QueryClient();

  return (
    <QueryClientProvider client={client}>
      <Todos />
    </QueryClientProvider>
  );
}

export default App;
