import { Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, View, Text, SafeAreaView, StyleSheet, TextInput, Image, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState} from 'react'
import { useNavigation } from '@react-navigation/native'
import { postSleepData} from '../components/Helpers'
import Reward from '../components/Reward';

const CreatePost = () => {

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // gives access to navigation object
  const navigation = useNavigation()

  const [number, setNumber] = useState(5)

  const addOne = () => {
    if (number < 10) {
      setNumber(number + 1)
    }
  }
  const subOne = () => {
    if (number > 1) {
      setNumber(number - 1)
    }
  }

  return (
    <SafeAreaView style={styles.container} behavior='padding'>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding'>

        <View>
          {/* <LogoTopLeft profileColor={'#FFF'} /> */}

          <View style={{ display: 'flex', flex: 0, justifyContent: 'center', alignItems: 'center',  }}>
            <View>
              <Text style={styles.postText}>Rate Sleep Quality</Text>
            </View>
            <View>
              <Image style={styles.imageStyles} source={require("../images/sleep.jpg")} />
            </View>
          </View>

          {/* <View style={{ backgroundColor: 'black', justifyContent: 'center', alignItems: 'center'}}> */}
          <Reward sleepQuality={number} add={addOne} sub={subOne}/>
          {/* </View> */}
          <View style={{display: 'flex'}}>
            <TouchableOpacity style={{position: 'absolute', alignSelf: 'center', top: -100, width: 250}} onPress={() => (postSleepData(number), navigation.navigate('Tabs'))}>
              <View style={{ backgroundColor: '#32328f', justifyContent: 'center', alignItems: 'center', borderRadius: 10, height: 70, marginLeft: 25, marginRight: 25 }}>
                <Text style={{ color: '#FFF', fontSize: 20, fontWeight: '600' }}>Post</Text>
              </View>
            </TouchableOpacity>
          </View>


        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>


  )
}

export default CreatePost

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#3d3dac',
    display: 'flex',
    flex: 1
  },
  postText: {
    color: '#FFF',
    fontSize: 25,
    fontWeight: '600',
    textAlign: 'center',
  },
  imageStyles: {
    height: 200,
    width: 200,
    // marginTop: 15,
    // marginBottom: 15,

  },
  textStyle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#E63946'
  },
  inputStyle: {
    backgroundColor: '#E63946',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    marginBottom: 25,
    color: '#FFF',
    flexDirection: 'row',
    height: 40,

    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
    }),
  },
})