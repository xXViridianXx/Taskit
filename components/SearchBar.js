import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'
import {
    AdjustmentsHorizontalIcon,
    MagnifyingGlassIcon
} from "react-native-heroicons/outline";

import { getAuth, signOut } from 'firebase/auth';

const logout = async () => {
    console.log('logging out')
    await signOut(getAuth())
}

const SearchBar = () => {
    return (
        <View style={styles.searchContainer}>
            <View style={styles.Search}>
                <MagnifyingGlassIcon size='25' color='#3d3dac' style={styles.searchIcon} />
                <TextInput placeholder='Sleep greater than 8' keyboardType='default' style={styles.searchInput} />
            </View>
            <TouchableOpacity>
                <AdjustmentsHorizontalIcon size='30' color='#3d3dac' style={styles.filterIcon} onPress={logout} />
            </TouchableOpacity>

        </View>
    )
}

export default SearchBar

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
        marginRight: 50,
        width: '100%',
    },
    searchIcon: {
        marginLeft: 10,
        marginRight: 4,
    },
    filterIcon: {
        marginLeft: 10,
        marginRight: 25
    },
    Search: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',

        marginLeft: 25,
        width: '80%',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#3d3dac'
    },
    searchInput: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        width: '80%',
        fontWeight: 600,
    },
})