import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Button, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native'
import React, { useState, useLayoutEffect, useEffect } from 'react'
import LoginInputs from '../components/LoginInputs'
import SelectDropdown from 'react-native-select-dropdown'
import { signUp, create, getUID } from '../components/Helpers'
import Slider from '@react-native-community/slider';
import InfoSliders from '../components/InfoSliders'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useDispatch, useSelector } from 'react-redux';

// const uid = getUID()

const RegisterInfo = ({ route, navigation }) => {

  const user = useSelector(state => state.user.currentUser)

  console.log('user in reg', user)


  const favoriteCategory = ["Walk", 'Gym', 'Meditation']
  const bedTimeCategories = ['8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '1:00', '1:30']
  const { email, password, confirmPassword, username } = route.params
  const [favCategory, setFavCategory] = useState('');
  const [sleepGoal, setSleepGoal] = useState(8);
  const [activityGoal, setActivityGoal] = useState(0);
  const [bedTime, setBedTime] = useState('');
  const [napDur, setNapDur] = useState(0);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  useEffect(() => {
    console.log('sleepGoal', sleepGoal)
    console.log('activityGoal', activityGoal)
    console.log('favCategory', favCategory)
    console.log('bedTime', bedTime)
    console.log('napDur', napDur)

    // im muted

    // const storeAsync = async () => {
    //   await AsyncStorage.setItem("sleepGoal", sleepGoal.toString())
    //   await AsyncStorage.setItem("activityGoal", activityGoal.toString())
    //   await AsyncStorage.setItem("favCategory", favCategory)
    //   await AsyncStorage.setItem("bedTime", bedTime)
    //   await AsyncStorage.setItem("napDur", napDur.toString())
    // }

    // storeAsync();
  }, [sleepGoal, activityGoal, favCategory, bedTime, napDur])

  return (


    // keyboard won't cover input fields

    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior='padding'
      >
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Siesta</Text>
        </View>

        <View style={styles.introContainer}>
          <Text style={styles.introText}>Some Information About You</Text>
        </View>

        <View style={styles.inputContainer}>

          {/* Sleep Goal */}
          <InfoSliders
            val={sleepGoal}
            title={"Sleep Goal"}
            unit={1 == sleepGoal  ? "Hour" : "Hours" }
            setVal={setSleepGoal}
            minVal={1}
            maxVal={12}
            step={.25} />

          {/* activity goal */}
          <InfoSliders
            val={activityGoal}
            title={"Activity Goal"}
            unit={"minutes"}
            setVal={setActivityGoal}
            minVal={0}
            maxVal={120}
            step={1} />

          {/* Nap Goal */}
          <InfoSliders
            val={napDur}
            title={"Nap Duration"}
            unit={"minutes"}
            setVal={setNapDur}
            minVal={0}
            maxVal={60}
            step={1} />

          {/* sleep time */}
          <SelectDropdown
            data={bedTimeCategories}
            buttonStyle={{ width: '100%', borderRadius: 10, marginBottom: 20 }}
            defaultButtonText='Select a bedtime'
            onSelect={(selectedItem, index) => {
              setBedTime(selectedItem)
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              // text represented after item is selected
              // if data array is an array of objects then return selectedItem.property to render after item is selected
              return selectedItem
            }}
            rowTextForSelection={(item, index) => {
              // text represented for each item in dropdown
              // if data array is an array of objects then return item.property to represent item in dropdown
              return item
            }}
          />

          {/* fav category */}
          <SelectDropdown
            data={favoriteCategory}
            defaultButtonText=' Select ur favorite destresser'
            buttonStyle={{ width: '100%', borderRadius: 10 }}
            onSelect={(selectedItem, index) => {
              setFavCategory(selectedItem)
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              // text represented after item is selected
              // if data array is an array of objects then return selectedItem.property to render after item is selected
              return selectedItem
            }}
            rowTextForSelection={(item, index) => {
              // text represented for each item in dropdown
              // if data array is an array of objects then return item.property to represent item in dropdown
              return item
            }}
          />




        </View>

        <View
          style={styles.buttonContainer}
        >
          <TouchableOpacity onPress={() => { signUp(email, password, confirmPassword, username, sleepGoal, activityGoal, favCategory, bedTime, napDur) }} style={styles.button}>
            {/* <TouchableOpacity onPress={() => { signUp(email, password, confirmPassword, username)}} style={styles.button}> */}
            <Text style={styles.buttonText}>Lets Go</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { navigation.navigate('Register')}} style={styles.button}>
            {/* <TouchableOpacity onPress={() => { signUp(email, password, confirmPassword, username)}} style={styles.button}> */}
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>

  )
}

export default RegisterInfo

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3d3dac',
  },

  signUpContainer: {
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  logoContainer: {
    width: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 300
  },
  logoText: {
    color: '#FFF',
    fontSize: 50,
    fontWeight: 'bold',
    fontStyle: 'italic'

  },

  introContainer: {
    width: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 20

  },
  introText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '500',
    // fontStyle: 'italic'
  },
  inputContainer: {
    width: '70%',

  },
  input: {
    backgroundColor: '#E63946',
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: 10,
    marginTop: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#D90429',
    color: '#FFF',
  },
  buttonContainer: {
    width: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    width: '100%',
    backgroundColor: '#32328a',
    color: '#FFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#e5e5e5'
  },
  buttonOutline: {
    // backgroundColor: '#E63946',
    // marginTop: 10,
    // borderColor: '#D90429',
    // borderWidth: 3

  },
  buttonOutlineText: {
    fontWeight: '500',
    fontSize: 14,
    color: '#FFF'
  }
})
