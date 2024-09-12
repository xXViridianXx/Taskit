// import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Index from './Index';
import { RootSiblingParent } from 'react-native-root-siblings';

export default function App() {
    return (
        <Provider store={store}>
            <RootSiblingParent>
                <Index />
            </RootSiblingParent>
        </Provider>
    );
}
