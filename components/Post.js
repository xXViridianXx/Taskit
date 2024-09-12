import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'

import { useNavigation } from '@react-navigation/native'

function formatDate(timestamp) {
    const date = new Date(timestamp);
    const month = date.getMonth() + 1; // Months are zero-based, so add 1
    const day = date.getDate();
    const year = date.getFullYear();
    
    return `${month}-${day}-${year}`;
}

const Post = ({ post }) => {

    const navigation = useNavigation()

    // console.log(post)

    return (
        <TouchableOpacity style={styles.item} activeOpacity={.75} onPress={() => { navigation.navigate('SleepInfoScreen'), { } }}>
            <View style={styles.content}>
                <View style={{ padding: 15, width: '60%' }}>
                    <View style={{ borderRadius: 0, backgroundColor: '#FFF', borderBottomWidth: 2, borderColor: '#3d3dac', marginBottom: 20, padding: 10, alignItems: 'center' }}>
                        <Text style={{ fontSize: 20, fontWeight: 800, color: '#3d3dac' }}>{ formatDate(post.date ? post.date : '00-00-0000') }</Text>
                    </View>
                    <Text style={{ marginBottom: 30, fontSize: 23, fontWeight: 600, color: '#2b2d42' }}>Sleep Duration</Text>
                    <Text style={{ marginBottom: 30, fontSize: 23, fontWeight: 600, color: '#2b2d42' }}>Activity Duration</Text>
                </View>
                <View style={styles.tag}>
                    <Text style={{ marginTop: 65, fontSize: 20, fontWeight: 600, color: '#FFF' }}>{post.sleepDuration ? post.sleepDuration : '0:00'}</Text>
                    <Text style={{ marginTop: 65, fontSize: 20, fontWeight: 600, color: '#FFF' }}>{post.activityDuration ? post.activityDuration : 0}  mins</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default Post

const styles = StyleSheet.create({
    item: {
        width: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '10%',
        marginLeft: '10%',
        marginTop: '0%',
        marginBottom: '3%',
        backgroundColor: '#FFF',
        borderWidth: 3,
        borderColor: '#7b2cbf',
        borderRadius: 10,

        // also need to do for android using elevation
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
    tag: {
        backgroundColor: '#3d3dac',
        width: '40%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flexDirection: 'row',
        flex: 1
    }
})