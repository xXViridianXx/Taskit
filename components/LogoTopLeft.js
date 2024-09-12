import { StyleSheet, Text, View} from 'react-native'
import React from 'react'

import {
    UserCircleIcon,
  } from "react-native-heroicons/outline";

const LogoTopLeft = ({profileColor}) => {
    return (
        <View style={styles.headerContainer}>
            <View style={styles.logoContainer}>
                <Text style={styles.logoText}>Siesta</Text>
            </View>
            <UserCircleIcon size='40' color={profileColor} />
        </View>
    )
}

export default LogoTopLeft

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        marginTop: 25,
        paddingRight: 20,
        paddingLeft: 25,

    },
    logoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    logoText: {
        color: '#3d3dac',
        fontSize: 20,
        fontWeight: '600',
    },
})