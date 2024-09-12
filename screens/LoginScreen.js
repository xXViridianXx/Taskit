import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Button, TouchableWithoutFeedback, Keyboard} from 'react-native'
import React, { useState, useEffect } from 'react'
import LoginInputs from '../components/LoginInputs'
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from '../firebaseConfig'
import { signIn } from '../components/Helpers'


// linking firebase
initializeApp(firebaseConfig)

const LoginScreen = ({ navigation }) => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // useEffect(() => {
  //   const auth = getAuth()
  //   onAuthStateChanged(auth, (user) => {

  //     // console.log(user.email)
  //     if (user) {
  //       navigation.replace('Home')
  //     }
  //   })
  // })

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };


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
          <Text style={styles.introText}>Sleep More. Do More.</Text>
        </View>

        <View style={styles.inputContainer}>

          <LoginInputs labelText={'Email'} input={email} setInput={setEmail} style={styles.input} color={'#3d3dac'} boardType='email-address' secure={false} />
          <LoginInputs labelText={'Password'} input={password} setInput={setPassword} style={styles.input} color={'#3d3dac'} boardType='default' secure={true} />

          <TouchableOpacity onPress={() => { }}>
            <Text style={{ color: '#FFF', fontWeight: 500, padding: 8, fontSize: 12 }}>Forgot Password</Text>
          </TouchableOpacity>
        </View>

        <View
          style={styles.buttonContainer}
        >
          <TouchableOpacity onPress={() => { (signIn(email, password))}} style={styles.button}>
            <Text style={styles.buttonText}>Sign in</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { }} style={styles.button}>
            <Text style={styles.buttonText}>Sign in with Google</Text>
          </TouchableOpacity>

          <View style={styles.signUpContainer}>
            <Text style={{ color: '#FFF', fontSize: 12, fontWeight: 500 }}>New To The App?</Text>
            <TouchableOpacity onPress={() => { navigation.navigate('Register') }} style={[styles.buttonOutline]}>
              <Text style={styles.buttonOutlineText}> Sign Up</Text>
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>

  )
}

export default LoginScreen

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
  buttonContainer: {
    width: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    width: '100%',
    backgroundColor: '#32328a',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FFF'
  },
  buttonOutline: {
    backgroundColor: '#3d3dac',

  },
  buttonOutlineText: {
    fontWeight: '500',
    fontSize: 14,
    color: '#FFF'
  }
})
