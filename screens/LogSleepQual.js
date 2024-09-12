import { StatusBar, View, Text, SafeAreaView, StyleSheet, TextInput, ScrollView, TouchableOpacity, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import * as Location from 'expo-location'
import * as Calendar from 'expo-calendar';
import HealthKit from '../components/HealthKit'
import sampleHealthData from '../Data/sampleHealthData'
import { NapAlgorithm, getEventsForCurrentDay } from '../components/NapAlgorithm';

import { getAuth, signOut } from 'firebase/auth';
import Item from '../components/Post'
import NoSideQuests from '../components/NoSideQuests';
import LogoTopLeft from '../components/LogoTopLeft';
import SearchBar from '../components/SearchBar';

const logout = async () => {
    console.log('logging out')
    await signOut(getAuth())
}
const HomeScreen = () => {

    const [sleepLogs, setSleepLogs] = useState(null)

    useEffect(() => {
        (async () => {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            ({ status } = await Calendar.requestCalendarPermissionsAsync());
            if (status === 'granted') {
                const events = await getEventsForCurrentDay();
                availableTimeSlots = NapAlgorithm({ events })
            }

            let { sleepData, activityData } = HealthKit()

            setSleepLogs(sleepData)

            console.log("Available Nap Slots: ", availableTimeSlots)
            console.log("Sleep Data: ", sleepData)
            console.log("Activity Data: ", activityData)
            // console.log("Activity Data: ", sampleHealthData)

        })();
    }, []);

    // gives access to navigation object
    const navigation = useNavigation()

    return (
        <SafeAreaView style={styles.container} behavior='padding'>

            {/* status bar */}
            {/* <StatusBar barStyle="light-content" /> */}
            {/* Header: Search, profile, logo */}
            <LogoTopLeft profileColor={'#3d3dac'} />

            {/* Search Bar */}
            <SearchBar />
            {/* body */}
            <View style={styles.questsContainer}>
                <Text style={styles.questsText}>Sleep Data</Text>
            </View>
            <View style={{ height: 550, backgroundColor: '#FFF' }}>
                <FlatList
                    data={sleepLogs}
                    ListEmptyComponent={NoSideQuests}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => <Item post={item} />}
                    keyExtractor={item => item.id}
                />
            </View>

        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        flex: 1
    },
    questsContainer: {
        alignItems: 'center',
        marginTop: 50,
        borderBottomWidth: 2,
        borderBottomColor: '#e5e5e5',
        marginRight: 25,
        marginLeft: 25,
        padding: 10
    },
    questsText: {
        color: '#3d3dac',
        fontSize: 20,
        fontWeight: '600',
    },
})

