import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { Dimensions } from 'react-native';
import Item from '../components/Post'
import { sampleHealthData } from '../Data/sampleHealthData'
import { NapAlgorithm, getEventsForCurrentDay } from '../components/NapAlgorithm';
import NoSideQuests from '../components/NoSideQuests';
import * as Calendar from 'expo-calendar';
import { getAuth, signOut } from 'firebase/auth';
import HealthKit from '../components/HealthKit'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { getWeatherInfo, getLocalTime, randomIntFromInterval, getUID } from '../components/Helpers';
import * as Location from 'expo-location'
import * as Progress from 'react-native-progress';
// import getCurActivityDur from '../components/CurrentAcitivty';
import getCurActivityDur from '../components/CurrentAcitivty';
import { database, doc, setDoc, addDoc } from '../firebaseConfig';
import { collection, getDoc, updateDoc } from 'firebase/firestore';

import AppleHealthKit from 'react-native-health'

// 
const width = Dimensions.get('window').width;

const logout = async () => {
    console.log('logging out')
    await signOut(getAuth())
    // await AsyncStorage.setItem('logged_sleep', 'false')
    // console.log("set to false")
}

function formatTime(date) {
    const formattedTime = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        timeZone: 'America/Los_Angeles'
    }).format(date);
    // 
    return formattedTime
}
const accessItemList = async () => {
    try {
        const uid = getUID()
        const value = await AsyncStorage.getItem(uid + '|' + 'selectedItems');
        return value;
    } catch (error) {
        console.log('Error getting selected items');
        return [];
    }
}

export const accessActivityList = async () => {
    try {
        const uid = getUID()
        const userRef = doc(database, 'users', uid);
        
        // const activities = await AsyncStorage.getItem(uid + '|' + 'itemList');
        let activities = "";

        try {
            const userSnapShot = await getDoc(userRef)
            if (userSnapShot.exists()) {
                userInfo = userSnapShot.data()
                activities = userInfo.itemList
            }
            else {
                console.log("failed to get user data")
            }
        }
        catch (error) {
            console.log('failed to last entry date ', error.message)
            return null
        }
        return activities;
    } catch (error) {
        console.log('Error getting activity list');
        return [];
    }
}
export default function Home({ route, navigation }) {

    // var activityRec = "Go Workout" // update this with actual workout
    // var activityRec = ["Go Workout", "Walk", "Meditate"]

    // if (route.params?.items) {
    //     activityRec = [route.params?.items[0]];
    // }
    // get the async data for selectedItems

    const params = route.params
    const [activityRec, setActivityRec] = useState([]);
    const [userLogs, setUserLogs] = useState([]);
    // const [activityLogs, setActivityLogs] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [forceUpdate, setForceUpdate] = useState(false);
    const [activityDur, setActivityDur] = useState(0)
    const [activityGoal, setActivityGoal] = useState(0)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await accessItemList();
                const newItems = result ? JSON.parse(result) : [];
                setActivityRec(newItems);
            } catch (error) {
                // console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                var result = await accessActivityList();
                result = JSON.parse(result);
                let first = result[0];
                let second = result[1];
                let third = result[2];
                let firstSecondThird = [first, second, third];
                let activityList = firstSecondThird.map(obj => obj.name ); // for testing: + " " + obj.indScore.toString()

                const newItems = activityList ? activityList : [];
                setActivityRec(newItems);
            } catch (error) {
                // console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [activityRec]);

    useEffect(() => {
        const fetchData = async () => {
            let { status } = await Calendar.requestCalendarPermissionsAsync();
            if (status === 'granted') {
                const events = await getEventsForCurrentDay();
                const availableTimeSlots = await NapAlgorithm({ events })
                setStartTime(availableTimeSlots ? formatTime(availableTimeSlots.startTime) : '')
                setEndTime(availableTimeSlots ? formatTime(availableTimeSlots.endTime) : '')
            }

            ({ status } = await Location.requestForegroundPermissionsAsync());
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
            }
        };

        fetchData()

    }, []);



    useEffect(() => {
        const getUserLogs = () => {
            let { sleepData } = HealthKit()
            setUserLogs(sleepData)
        }

        getUserLogs()//LEVI this is where the workout time should be done
    }, [userLogs])

    /*
        Create a new function that grabs the users current day activity duration.
        Store that in useState and use it to create a progress bar on home screen.
        Use the user's activity goal to create progress bar.

        Input: Activity Duration from HealthKit
        Output: currentActivityDur in useState
    */
    useEffect(() => {
        let options = {
            startDate: new Date().toISOString(), // required
            endDate: new Date().toISOString(), // optional; default now
            limit: 1, // optional; default no limit
            ascending: true, // optional; default false
        }

        AppleHealthKit.getActivitySummary(
            options,
            (err, results) => {
                if (err) {
                    return
                }

                let duration = results[0] ? results[0].appleExerciseTime : randomIntFromInterval(0, 120)
                setActivityDur(duration)
            },
        )
        
        const fetchActivityGoal = async() => {
            // const uid = getUID()
            // const value = await AsyncStorage.getItem(uid + '|' + 'activityGoal');
            // setActivityGoal(Number(value));
            const userRef = doc(database, 'users', uid)
            let activityGoal = -1
            // getting user's last entry
            try {
                const userSnapShot = await getDoc(userRef)
                if (userSnapShot.exists()) {
                    userInfo = userSnapShot.data()
                    activityGoal = userInfo.activityGoal
                }                else {
                    console.log("failed to get user data")
                }
            }
            catch (error) {
                console.log('failed to fetch activityGoal ', error.message)
                return null
            }

            console.log("fb test, activityGoal:", activityGoal)


            setActivityGoal(activityGoal);

        }

        fetchActivityGoal()

    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={{ fontSize: 40 }}>Siesta</Text>
                </View>
                <View>
                    <TouchableOpacity onPress={logout}>
                        <Text>Logout</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={getWeatherInfo}>
                        <Text>Test Weather</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={getLocalTime}>
                        <Text>Test Time</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.body}>
                <View style={styles.activity}>
                    <Text style={{ fontSize: 30, paddingBottom: 10 }}>Top Activity for the Day</Text>
                    {activityRec.map((activity, index) => (
                        <Text key={index} style={styles.activityRec}>{activity}</Text>
                    ))}
                </View>

                <View style={styles.nap}>
                    <Text style={{ fontSize: 30, paddingBottom: 10 }}>Recommended Nap Time</Text>
                    {startTime ?
                        (
                            <Text style={styles.napRec}> {startTime} - {endTime}</Text>
                        )
                        :
                        (
                            <Text style={styles.napRec}>No Naps Recommended</Text>
                        )
                    }
                </View>
                
                {/* Put the circular progress tracker here for activity duration */}
                
                <View style={styles.progressBar}>
                    <Text style={{fontSize: 30, paddingBottom: 10, paddingTop: 10}}>Activity Goal Progress</Text>
                    <Progress.Circle progress={activityGoal ? activityDur / activityGoal : 0} size={200} showsText={true} textStyle={{textAlign: 'center'}} thickness={5} borderWidth={3}formatText={(progress) => `${Math.round(progress * 100)}%\n ${activityDur} / ${activityGoal}`}/>
                </View>
                
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFF'
    },
    header: {
        width: width,
        borderBottomWidth: 1,
        alignItems: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
    },
    body: {
        display: 'flex',
        flex: 1,
        width: width,
    },
    activity: {
        alignItems: 'center',
        borderBottomWidth: 1,
        paddingTop: 25,
        paddingBottom: 25,
    },
    activityRec: {
        borderWidth: 1,
        borderRadius: 5,
        fontSize: 30,
        padding: (5, 5, 5, 5)
    },
    nap: {
        alignItems: 'center',
        borderBottomWidth: 1,
        paddingTop: 25,
        paddingBottom: 25,
    },
    napRec: {
        borderWidth: 1,
        borderRadius: 5,
        fontSize: 30,
        padding: (5, 5, 5, 5),
    },
    sleepLogs: {
        alignItems: 'center',
        borderBottomWidth: 1,
        paddingTop: 25,
        paddingBottom: 25,
    },
    progressBar: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }

})