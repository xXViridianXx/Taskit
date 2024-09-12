import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth'
import { database, doc, setDoc, addDoc } from '../firebaseConfig';

import Toast from 'react-native-root-toast'
import { collection, getDoc, updateDoc } from 'firebase/firestore';
import { err } from 'react-native-svg';
import { itemList, initializeItemList, Activity, initializeCategories } from '../recClasses/recClasses';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Loc from 'expo-location'
import { useState } from 'react';
import { REACT_APP_RAPIDAPIKEY } from '@env'

import HealthKit from './HealthKit';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const showToast = (text) => {
    let toast = Toast.show(text, {
        duration: Toast.durations.SHORT,
        backgroundColor: '#D90429',
        position: 150,
        shadow: false,
    });
};

const storeItemList = async () => {
    // in this function we will get the itemList from the recClasses file and store it in async storage

    //call initializeItemList

    let itemList2 = initializeItemList()
    let categoryMapList = initializeCategories()
    uid = getUID()
    const userRef = doc(database, 'users', uid);
    // const userSnapshot = await getDoc(userRef);
    // 
    try {
        await updateDoc(userRef, {
            itemList: JSON.stringify(itemList2),
            categoryMapList: JSON.stringify(categoryMapList)
        })
        // await AsyncStorage.setItem(uid + '|' + 'itemList', JSON.stringify(itemList2));
        // await AsyncStorage.setItem(uid + '|' + 'categoryMapList', JSON.stringify(categoryMapList))
    } catch (e) {
        console.log("error storing item list")
    }
}

const createDocument = async (email, username, uid) => {
    // getting current date
    const currentDate = new Date().toISOString().slice(0, 10)
    try {
        const userRef = doc(database, 'users', uid)
        await setDoc(userRef, {
            email: email,
            username: username,
            lastDate: currentDate,
            sleepGoal: 0,
            activityGoal: 0,
            favCategory: "",
            bedTime: 0,
            napDur: 0,
            selectedItems: "",
            itemList: "",
            categoryMapList: "",
            loggedDate: "",
            loggedSleep: "false"

        })

        const sleepDataCollectionRef = collection(userRef, "sleepData")

        // creating date document
        const dateDoc = doc(sleepDataCollectionRef, currentDate)

        const userInfo = {
            sleepQuality: 0
        }

        try {
            await setDoc(dateDoc, userInfo)
        }
        catch (error) {
            console.log('Error, submitting sleep info')
        }
        console.log(`Data submitted; uid: ${uid}`)
    }
    catch (error) {
        console.log('Error' + error.message)
    }
}

const postSleepData = async (sleepQuality) => {
    const myUID = getUID()
    // only call storeItemList when async storage for 'itemList' and 'categoryMapList' is empty
    const userRef = doc(database, 'users', myUID);
    const userSnapShot = await getDoc(userRef)

    let lastDate = ""
    let itemList = ""
    let categoryMapList = ""
    try {
        const userSnapShot = await getDoc(userRef)
        if (userSnapShot.exists()) {
            userInfo = userSnapShot.data()
            lastDate = userInfo.lastDate
            itemList = userInfo.itemList
            categoryMapList = userInfo.categoryMapList
        }
        else {
            console.log("failed to get user data")
        }
    }
    catch (error) {
        console.log('failed to last entry date ', error.message)
        return null
    }
    // if (await getDoc(userRef, ))
    // if (await AsyncStorage.getItem(myUID + '|' + 'itemList') == null || await AsyncStorage.getItem(uid + '|' + 'categoryMapList') == null) {
    //     storeItemList()
    // }
    if (itemList == "" || categoryMapList == "") {
        storeItemList()
    }
    updateActivityScores(sleepQuality, categoryMapList)

    try {
        const currentDate = new Date().toDateString()
        try {
            await updateDoc(userRef, {
                loggedSleep: "true",
                loggedDate: currentDate
            })
        }
        catch (error) {
            console.log("error updating data: ", error.message)
        }
        // await AsyncStorage.setItem(myUID + '|' + 'logged_sleep', 'true')
        // await AsyncStorage.setItem(myUID + '|' + "logged_date", currentDate)
        console.log("posted sleep data!")

        // don't uplaod this to firebase
        await AsyncStorage.setItem(myUID + '|' + 'sleepQuality', sleepQuality.toString())

        // store the sleep quality in async storage?
    }
    catch (e) {
        console.log("error updating Async variable")
    }

    // getting current user id
    // const auth = getAuth()
    // const user = auth.currentUser
    // uid = user.uid

    // getting user from database
    // const userRef = doc(database, 'users', uid)
    // getting user's last entry
    try {
        // const userSnapShot = await getDoc(userRef)
        if (userSnapShot.exists()) {
            userInfo = userSnapShot.data()
            lastDate = userInfo.lastDate
        }
        else {
            console.log("failed to get user data")
        }
    }
    catch (error) {
        console.log('failed to last entry date ', error.message)
        return null
    }

    // getting current date
    const currentDate = new Date().toISOString().slice(0, 10)

    // console.log(currentDate, lastDate)
    // checking if current date equals last entry
    // only post if last date different
    if (currentDate === lastDate) {
        showToast('Already submitted post for today!')
        return null
    }

    // posting sleep quality
    const sleepDataCollection = collection(userRef, "sleepData")
    const dateDoc = doc(sleepDataCollection, currentDate)
    try {
        await setDoc(dateDoc, {
            sleepQuality: sleepQuality
        })

    } catch (error) {
        console.log("error posting sleep ", error.message)
    }



    // updating last user entry date
    try {
        await updateDoc(userRef, {
            lastDate: currentDate
        })
    }
    catch (error) {
        console.log("error updating data: ", error.message)
    }


}

const updateActivityScores = async (sleepQuality, mapList) => {
    // get the activity from async storage

    const uid = getUID()
    const userRef = doc(database, 'users', uid);
    const userSnapShot = await getDoc(userRef);

    let weatherData = await getWeatherInfo();
    console.log("weather data in update activityscores: ", weatherData);
    // get the temperature data from the json
    let degrees = weatherData.current.temp_f;

    // get the current time
    let currentTimeJson = getLocalTime();
    console.log("current time: ", currentTimeJson);
    let currentTime = currentTimeJson.hours + (currentTimeJson.minutes / 60);

    let { sleepData } = HealthKit();
    console.log("Sleep data from healthkit: ", sleepData);
    if (sleepData === undefined) {
        console.log("Error: no sleep data, will not update scores")
        return
    }
    let lastSleepData = sleepData[sleepData.length - 1];
    console.log("last sleep data: ", lastSleepData);
    let hours = sleepData[sleepData.length - 1]["sleepDuration"];
    let [hour, minute] = hours.split(":");
    hours = parseInt(hour) + (parseInt(minute) / 60);
    console.log("hours: ", hours); // DEBUG



    // get the exercise duration from healthkit


    // retrieve from fb
    // let selectedItems = await AsyncStorage.getItem(uid + '|' + 'selectedItems')
    let selectedItems = ""
    console.log("about to retrieve selected items from firebase")
    // const auth = getAuth()
    // const user = auth.currentUser
    // uid = user.uid
    // const userRef = doc(database, 'users', uid);

    // const userSnapShot = await getDoc(userRef)
    try {
        if (userSnapShot.exists()) {
            userInfo = userSnapShot.data()
            selectedItems = userInfo.selectedItems
        } else {
            console.log("failed to get selected Items")
        }

    } catch (error) {
        console.log('failed to get selected itemss', error.message)
        return null
    }
    // selectedItems = await getFireBase('selectedItems');


    selectedItems = JSON.parse(selectedItems)
    console.log("selectedItems after json parse: ", selectedItems)


    // let activityList = await AsyncStorage.getItem(uid + '|' + 'itemList')
    let activityList = ""


    try {
        if (userSnapShot.exists()) {
            userInfo = userSnapShot.data()
            activityList = userInfo.itemList
        }
        else {
            console.log("failed to get user data")
        }
    }
    catch (error) {
        console.log('failed to last entry date ', error.message)
        return null
    }
    activityList = JSON.parse(activityList)
    activityList = activityList.map(obj => new Activity(obj.name, obj.categoryNames, obj.indScore, obj.numPicks))


    // get the category map list from async storage
    // let categoryMapList = await AsyncStorage.getItem(uid + '|' + 'categoryMapList')
    let categoryMapList = mapList;
    //retrieve category Map list from firebase

    categoryMapList = JSON.parse(categoryMapList)
    const map = new Map();
    for (const [key, value] of Object.entries(categoryMapList)) {
        map.set(key, value);
    }
    categoryMapList = map
    console.log("categoryMapList after map conversion: ", categoryMapList)

    // get sleepGoal from firebase


    let sleepGoal = -1
    // const userSnapShot = await getDoc(userRef);
    if (userSnapShot.exists()) {
        sleepGoal = userSnapShot.data().sleepGoal;
        console.log("firebase sleepGoal:", sleepGoal);
    } else {
        console.log("User does not exist.");
    }

    let sleepHours = Number(sleepData[sleepData.length - 1].sleepDuration.split(":")[0])
    console.log("sleep hours in 201: ", sleepHours);
    let sleepMins = Number(sleepData[sleepData.length - 1].sleepDuration.split(":")[1])
    let sleepDuration = sleepHours + (sleepMins / 60)
    // let sleepGoal = 9;



    // debugging categoryMapList and the type for it

    // 1. sleepquality, 2. sleep duration, 3. activities

    // go through the activityList and search for the activities
    for (let i = 0; i < activityList.length; i++) {
        let activity = activityList[i]
        for (let j = 0; j < selectedItems.length; j++) {
            if (activity.name == selectedItems[j]) {
                activity.updateScore(sleepDuration, sleepGoal, sleepQuality, categoryMapList)
            }
        }

    }

    const exerciseGoal = await AsyncStorage.getItem(uid + '|' + 'activityGoal');

    ({ sleepData } = HealthKit());

    latestData = sleepData[0];

    const exerciseDuration = latestData.activityDuration;
    console.log("levi ex dur", exerciseDuration)

    // sort activity score based on final score
    activityList.sort((a, b) => b.getScore(categoryMapList, degrees, currentTime, exerciseDuration, exerciseGoal) - a.getScore(categoryMapList, degrees, currentTime, exerciseDuration, exerciseGoal))
    try {
        console.log("Updated activityList: ", activityList)
        try {
            await updateDoc(userRef, {
                itemList: JSON.stringify(activityList)
            })
        }
        catch (error) {
            console.log("error updating data: ", error.message)
        }

        // await AsyncStorage.setItem(uid + '|' + 'itemList', JSON.stringify(activityList));
        // console.log("Updated activityList stored in AsyncStorage.");
    } catch (error) {
        console.error("Error storing updated activityList in AsyncStorage:", error.message);
    }

}


const signIn = async (email, password) => {
    const auth = getAuth()
    if (email && password) {
        try {
            let userSignInInfo = await signInWithEmailAndPassword(auth, email, password)

            const user = userSignInInfo.user

            console.log('Logged In With', user.email)
        }
        catch (error) {
            if (error.code === 'auth/user-not-found') {
                showToast('Invalid email address')
            }
            if (error.code === 'auth/wrong-password') {
                showToast('Invalid password')
            }
            showToast('Invalid credentials')
            console.error('Error signing in: ', error.message)
        }
    }
    else if (email) {
        showToast('Enter password')
    }
    else if (password) {
        showToast('Enter email')
    }
    else {
        showToast('Enter email and password')
    }
}

const authUserSignUp = async (email, password, confirmPassword, username) => {
    if (password != confirmPassword) {
        showToast('Password Do Not Match')
        return false
    }

    if (!email || !password || !confirmPassword || !username) {

        showToast('Missing Required Fields')
        return false
    }

    return true

}

const getUID = () => {
    const auth = getAuth()
    const user = auth.currentUser

    uid = user.uid


    return uid
}

const signUp = async (email, password, confirmPassword, username, sleepGoal, activityGoal, favCategory, bedTime, napDur) => {
    const auth = getAuth()
    if (password != confirmPassword) {
        showToast('Password Do Not Match')
        return
    }
    if (email && password) {

        try {
            let credentials = await createUserWithEmailAndPassword(auth, email, password)
            const user = credentials.user
            uid = user.uid
            console.log('user.uid', uid)
            createDocument(email, username, uid)
            await AsyncStorage.setItem(uid + '|' + "username", username)
            await AsyncStorage.setItem(uid + '|' + "sleepGoal", sleepGoal.toString())
            await AsyncStorage.setItem(uid + '|' + "activityGoal", activityGoal.toString())
            await AsyncStorage.setItem(uid + '|' + "favCategory", favCategory)
            await AsyncStorage.setItem(uid + '|' + "bedTime", bedTime)
            await AsyncStorage.setItem(uid + '|' + "napDur", napDur.toString())

            // update in firebase
            const userRef = doc(database, 'users', uid)
            // updating last user entry date
            try {
                await updateDoc(userRef, {
                    sleepGoal: sleepGoal,
                    activityGoal: activityGoal,
                    favCategory: favCategory,
                    bedTime: bedTime,
                    napDur: napDur

                })
                console.log("updated sleep goal (fb)!", sleepGoal)

                // await updateDoc(userRef, {
                //     activityGoal: activityGoal
                // })
                console.log("updated activityGoal goal (fb)!", activityGoal)

                // await updateDoc(userRef, {
                //     favCategory: favCategory
                // })
                console.log("updated favCategory goal (fb)!", favCategory)

                // await updateDoc(userRef, {
                //     bedTime: bedTime
                // })
                console.log("updated bedTime goal (fb)!", bedTime)

                // await updateDoc(userRef, {
                //     napDur: napDur
                // })
                console.log("updated napDur goal (fb)!", napDur)

            }
            catch (error) {
                console.log("error updating data: ", error.message)
            }


            console.log('Successfully created an account with', user.email)
        }
        catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                showToast('The email is already in use')
            }
            if (error.code === 'auth/invalid-email') {
                showToast("Invalid email")
            }

            console.error('Error creating account', error.message)

        }
    }
    else {
        showToast('Missing required fields')
    }
}

// return realtime weather information based on coords
const getWeatherInfo = async () => {
    try {
        // retreives coords
        let geocodedAddress = await Loc.getCurrentPositionAsync({});
        let latitude = Number((geocodedAddress.coords.latitude))
        let longitude = Number((geocodedAddress.coords.longitude))

        // api settings
        console.log("latitude: " + latitude)
        console.log("longitude: " + longitude)
        // console.log(REACT_APP_RAPIDAPIKEY)
        const url = `https://weatherapi-com.p.rapidapi.com/current.json?q=${latitude},${longitude}`
        const headers = {
            'X-RapidAPI-Key': REACT_APP_RAPIDAPIKEY,
            'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
        }

        console.log(REACT_APP_RAPIDAPIKEY)


        // making api call and converting data to json
        const response = await fetch(url, { method: 'GET', headers });
        const data = await response.json();
        return data;
        console.log(data);
    }
    catch (error) {
        console.error(error);
    }
}

const getLocalTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    console.log(hours, minutes, seconds)
    return { hours: hours, minutes: minutes, seconds: seconds };
};

const setFirebase = async (item, value) => {
    const uid = getUID()
    const userRef = doc(database, 'users', uid)
    try {
        await updateDoc(userRef, {
            item: value
        })
        console.log("updated napDur goal (fb)!", napDur)

    }
    catch (error) {
        console.log("error updating data: ", error.message)
    }
}

const getFirebase = async (item) => {
    const uid = getUID()
    const userRef = doc(database, 'users', uid)
    try {
        const userSnapShot = await getDoc(userRef)
        if (userSnapShot.exists()) {
            userInfo = userSnapShot.data()
            // since item is a list of strings, we need to make a list here and return the list of items
            // initialize a list

            let listOfItems = []
            for (let i = 0; i < item.length; i++) {
                listOfItems.push(userInfo[item[i]])
            }
            return listOfItems
        } else {
            console.log("failed to get user nap duration")
        }
    } catch (error) {
        console.log('failed to get nap duration data', error.message)
        return null
    }
}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const getFireBase = async (item) => {
    const uid = getUID();
    const userRef = doc(database, 'users', uid)
    try {
        const userSnapShot = await getDoc(userRef)
        if (userSnapShot.exists()) {
            userInfo = userSnapShot.data()
            // since item is a list of strings, we need to make a list here and return the list of items
            // initialize a list

            let listOfItems = []
            for (let i = 0; i < item.length; i++) {
                listOfItems.push(userInfo[item[i]])
            }
            return listOfItems
        } else {
            console.log("failed to get user nap duration")
        }
    } catch (error) {
        console.log('failed to get nap duration data', error.message)
        return null
    }
}

export { signIn, signUp, authUserSignUp, postSleepData, getWeatherInfo, getLocalTime, randomIntFromInterval, getUID, getFirebase }