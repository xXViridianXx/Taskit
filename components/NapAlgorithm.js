import { useState } from 'react';
import * as Calendar from 'expo-calendar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUID, getFirebase } from './Helpers';
import { database } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';


async function NapAlgorithm({ events }) {
    // default nap time
    let napDur = 30;
    const uid = getUID()

    // const value = await AsyncStorage.getItem(uid + '|' + "napDur");
    const userRef = doc(database, 'users', uid)
    // try {
    //     const userSnapShot = await getDoc(userRef) 
    //         if (userSnapShot.exists()) {
    //             userInfo = userSnapShot.data()
    //             napDur = userInfo.napDur
    //         } else {
    //             console.log("failed to get user nap duration")
    //         }
    
    // } catch (error) {
    //     console.log('failed to get nap duration data', error.message)
    //     return null
    // }
    napDur = await getFirebase(["napDur"])
    napDur = napDur[0]

    console.log("nap duration in nap algorithm: ", napDur);

    let startTime = new Date()
    startTime.setHours(12)
    startTime.setMinutes(0)
    startTime.setSeconds(0)
    startTime.setMilliseconds(0)

    let endTime = new Date()
    endTime.setHours(17)
    endTime.setMinutes(0)
    endTime.setSeconds(0)
    endTime.setMilliseconds(0)

    let availableTimeSlots = []
    let currentTime = new Date(startTime)
    let currNapDur = napDur

    while (availableTimeSlots.length < 1) {
        if (currNapDur <= 0) {
            break;
        }

        while (currentTime < endTime) {
            const slotEndTime = new Date(currentTime.getTime() + currNapDur * 60000)
            availableTimeSlots.push({ startTime: new Date(currentTime), endTime: slotEndTime })
            currentTime = slotEndTime
        }

        currNapDur = currNapDur - 15
    }

    events.forEach(event => {

        const eventStartTime = new Date(event.startDate)
        const eventEndTime = new Date(event.endDate)

        if (!event.allDay || event.availability !== 'notSupported') {
            availableTimeSlots = availableTimeSlots.filter(slot => {
                return (slot.startTime < eventStartTime && slot.endTime <= eventStartTime) || // Slot ends before event starts
                    (slot.startTime >= eventEndTime && slot.endTime > eventEndTime);       // Slot starts after event ends
            });
        }
    });

    return availableTimeSlots[0]
}


const getEventsForCurrentDay = async () => {
    const currentDate = new Date();
    const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0);
    const endOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59);

    const defaultCalendar = getDefaultCalendarSource()

    const events = await Calendar.getEventsAsync([defaultCalendar.id], startOfDay, endOfDay);

    return events;
}

async function getDefaultCalendarSource() {
    const defaultCalendar = await Calendar.getDefaultCalendarAsync();
    return defaultCalendar.source;
}

export { getEventsForCurrentDay, NapAlgorithm }