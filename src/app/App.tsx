import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AttributesProvider } from './contexts/AttributesContext';

export default function App() {
  return (
    <AttributesProvider>
      <RouterProvider router={router} />
    </AttributesProvider>
  );
}
