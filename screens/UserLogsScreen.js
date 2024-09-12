import { StyleSheet, Text, View, SafeAreaView, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import NoSideQuests from '../components/NoSideQuests';
import Item from '../components/Post'
import user from '../redux/slices/user';
import HealthKit from '../components/HealthKit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUID } from '../components/Helpers';
// const uid = getUID()
const UserLogsScreen = ({ route }) => {

    const params = route.params;
    const [userLogs, setUserLogs] = useState()
    const [username, setUsername] = useState(null)

    useEffect(() => {

        if (params && params.userLogs) {
            setUserLogs(params.userLogs)
        }

        const getUsername = async () => {
            const uid = getUID()
            const value = await AsyncStorage.getItem(uid + '|' + "username")
            setUsername(value)
        }

        getUsername()

    }, [userLogs])


    return (
        <SafeAreaView style={styles.container}>

            <View>
                <View>
                    <Text style={{ fontSize: 40 }}>{username ? username + "'s" : 'Your'} Logs</Text>
                </View>
            </View>

            <View style={styles.sleepLogs}>
                <FlatList
                    style={{ height: '50%' }}
                    data={userLogs}
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

export default UserLogsScreen

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFF'
    },
    sleepLogs: {
        alignItems: 'center',
        borderBottomWidth: 1,
        paddingTop: 25,
        paddingBottom: 25,
    },
})