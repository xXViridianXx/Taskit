import { View, Text, TextInput, StyleSheet} from 'react-native'
import React, {useState} from 'react'


const LoginInputs = ({labelText, input, setInput, color, boardType, secure}) => {

    // const [input, setInput] = useState('')
    // const [password, setPassword] = useState('')
    // const [username, setUsername] = useState('')
    // const [confirmPassword, setConfirmPassword] = useState('')

    return (
        <TextInput
            placeholder = {labelText}
            value = {input}

            
            onChangeText={text => setInput(text)}
            style={styles.input}
            placeholderTextColor={color}
            keyboardType = {boardType}
            secureTextEntry = {secure}

        />
    )
}

export default LoginInputs

const styles = StyleSheet.create({
    input: {
        backgroundColor: '#32328a',
        paddingHorizontal: 8,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 15,
        borderWidth: 1,
        borderColor: '#240046',
        color: '#FFF',
      }
})

