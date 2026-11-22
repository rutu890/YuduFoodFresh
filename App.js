
// import React from 'react';
// import AppNavigator from './src/navigation/AppNavigator';

// export default function App() {
//   return <AppNavigator />;
// }

import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { ShopProvider } from './src/context/ShopContext';

export default function App() {
  return (
    <ShopProvider>
      <AppNavigator />
    </ShopProvider>
  );
}
