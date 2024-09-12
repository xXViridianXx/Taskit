import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Button, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native'
import React, { useState, useLayoutEffect, useEffect } from 'react'
import LoginInputs from '../components/LoginInputs'
import { authUserSignUp, create} from '../components/Helpers'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import user from '../redux/slices/user'


const RegisterScreen = ({ navigation }) => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')


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
          <Text style={styles.introText}>Welcome Aboard</Text>
        </View>

        <View style={styles.inputContainer}>

          <LoginInputs labelText={'Username'} input={username} setInput={setUsername} style={styles.input} color={'#3d3dac'} boardType='default' secure={false} />
          <LoginInputs labelText={'Email'} input={email} setInput={setEmail} style={styles.input} color={'#3d3dac'} boardType='email-address' secure={false} />
          <LoginInputs labelText={'Password'} input={password} setInput={setPassword} style={styles.input} color={'#3d3dac'} boardType='default' secure={true} />
          <LoginInputs labelText={'Confirm Password'} input={confirmPassword} setInput={setConfirmPassword} style={styles.input} color={'#3d3dac'} boardType='default' secure={true} />
        </View>

        <View
          style={styles.buttonContainer}
        >
          <TouchableOpacity onPress={() => { authUserSignUp(email, password, confirmPassword, username).then((value) => {if (value) { navigation.navigate('Info', {email: email, password: password, confirmPassword: confirmPassword, username: username}) }}) }} style={styles.button}>
          {/* <TouchableOpacity onPress={() => { signUp(email, password, confirmPassword, username)}} style={styles.button}> */}
            <Text style={styles.buttonText}>Lets Go</Text>
          </TouchableOpacity>

          <View style={styles.signUpContainer}>
            <Text style={{ color: '#FFF', fontSize: 12, fontWeight: 500 }}>Already Have An Account?</Text>
            <TouchableOpacity onPress={() => { navigation.navigate('Login') }} style={[styles.buttonOutline]}>
              <Text style={styles.buttonOutlineText}> Sign In</Text>
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>

  )
}

export default RegisterScreen

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
