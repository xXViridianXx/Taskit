// import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import RegisterInfo from './screens/RegisterInfo';
// import QuestInfoScreen from './screens/QuestInfoScreen';
import CreatePost from './screens/CreatePost';
import UserLogsScreen from './screens/UserLogsScreen';
import Home from './screens/Home';
import { React, useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import Tabs from './components/Tab';
import { setUser } from './redux/slices/user';

import { getAuth, onAuthStateChanged, initializeAuth } from 'firebase/auth'

import ActivityScreen from './screens/ActivityScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getUID } from './components/Helpers';


const Stack = createNativeStackNavigator();

// console.log(uid)


// Start a timer for 5 seconds





export default function Index() {


    // gives root state in call back: user slice
    const user = useSelector(state => state.user.currentUser)

    const dispatch = useDispatch()


    const auth = getAuth()


    // let loggedSleepAsync = false

    const [loggedSleepAsync, setLoggedSleepAsync] = useState(false);

    // setup logged_sleep async boolean value
    useEffect(() => {

        // function that checks if user logged sleep for the day
        const checkLoggedSleep = async () => {
            const uid = getUID()
            const userRef = doc(database, 'users', uid);

            
            // gets logged sleep status, current date as a string, and the date user logged sleep
            // const logged_sleep = await AsyncStorage.getItem(uid + '|' + 'logged_sleep');
            const currentDate = new Date().toDateString()
            // const postedDate = await AsyncStorage.getItem(uid + '|' + 'logged_date');

            const logged_sleep = ""
            const postedDate = ""
            try {
                const userSnapShot = await getDoc(userRef)
                if (userSnapShot.exists()) {
                    userInfo = userSnapShot.data()
                    logged_sleep = userInfo.loggedSleep
                    postedDate = userInfo.loggedDate
                }
                else {
                    console.log("failed to get user data")
                }
            }
            catch (error) {
                console.log('failed to last entry date ', error.message)
                return null
            }
            // checks if logged sleep exists
            if (logged_sleep) {
                // if user logged sleep we will check if the user entered sleep for the current date
                if (logged_sleep === 'true') {

                    // if the current date and posted date are the same then the user already posted sleep for the current date
                    if (currentDate === postedDate) {

                        console.log('Already logged sleep')
                        setLoggedSleepAsync(true)

                        // else the user should be prompted to enter the sleep logs since it is a new day
                        // this only happens when the user opens the app for the first time on a new day
                    } else {

                        console.log('New day log sleep again')
                        // await AsyncStorage.setItem(uid + '|' + "logged_sleep", "false")
                        try {
                            await updateDoc(userRef, {
                                loggedSleep: "false"
                            })
                        }
                        catch (error) {
                            console.log("error updating data: ", error.message)
                        }
                        setLoggedSleepAsync(false)

                    }

                    // if the user never entered sleep logs for the current day then make them do it
                } else {

                    console.log('Logged sleep was false')
                    setLoggedSleepAsync(false)

                }

                // if the logged sleep doesnt exist then make user log sleep anyways
            } else {

                console.log('logged value does not exist')
                // await AsyncStorage.setItem(uid + '|' + 'logged_sleep', 'false')
                try {
                    await updateDoc(userRef, {
                        loggedSleep: "false"
                    })
                }
                catch (error) {
                    console.log("error updating data: ", error.message)
                }
                setLoggedSleepAsync(false)

            }
        }

        if (user) {
            checkLoggedSleep();
        }
        
    }, []);

    onAuthStateChanged(auth, (u) => {
        let email = null
        if (u != null) {
            email = u.email
        }

        dispatch(setUser(email))
    })


    if (user) {
        if (!loggedSleepAsync) {
            return (
                <NavigationContainer>
                    <Stack.Navigator>
                        <Stack.Screen name="CreatePost" component={CreatePost} options={{ headerShown: false }} />
                        <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
                    </Stack.Navigator>
                </NavigationContainer>
            );
        }
        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
    else {
        return (
            <NavigationContainer initialRouteName='Login'>
                <Stack.Navigator >
                    <Stack.Screen name='Login' component={LoginScreen} options={{ headerShown: false }} />
                    <Stack.Screen name='Register' component={RegisterScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="Info" component={RegisterInfo} options={{ headerShown: false }} />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }

}
