import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// import { Activity, itemList } from '../recClasses/Activity';
import { itemList, categoryMapList } from '../recClasses/recClasses';
import SelectableList from '../components/SelectableList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { accessActivityList } from './Home';
import { getUID } from '../components/Helpers';
import { collection, getDoc, updateDoc } from 'firebase/firestore';
import { database, doc, setDoc, addDoc } from '../firebaseConfig';



const ActivityScreen = () => {
    const navigation = useNavigation(); // used for navigating to other screens
    var itemNames = itemList.map((item) => item.name); // get the names of the activities like Walk, Run, etc
    // const [itemNames, setItems] = useState([]);
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             var result = await accessActivityList();
    //             result = JSON.parse(result);
    //             // console.log("levi result", result)
    //             // let activityList = result.map(obj => obj.name + " " + obj.indScore.toString());

    //             const newItems = result ? result : [];
    //             const newItems = result ? result : [];

    //             var itemNames = newItems.map((item) => item.name); // get the names of the activities like Walk, Run, etc
    //             console.log("levi item names: ", itemNames)
    //             setItems(itemNames);
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         }
    //     };
    //     fetchData();
    // }, []); //
    const [selectedItems, setSelectedItems] = useState([]); // managed in the useState hook
    // initialized with two values: current state value and function that allows you to update the state
    useEffect(() => {
        const updateAsyncStorage = async () => {
            const uid = getUID();
            const userRef = doc(database, 'users', uid);
            const userSnapshot = await getDoc(userRef); //don't think we need this
            try {
                if (selectedItems.length > 0) {
                    await AsyncStorage.setItem(uid + '|' + 'selectedItems', JSON.stringify(selectedItems));

                    try {
                        await updateDoc(userRef, {
                            selectedItems: JSON.stringify(selectedItems)
                        })
                        console.log("updated selectedItems (fb)!", selectedItems)
                    }
                    catch (error) {
                        console.log("error selectedItems data: ", error.message)
                    }

                } else {
                    const defaultSelectedItems = [];
                    await AsyncStorage.setItem(uid + '|' + 'selectedItems', JSON.stringify(defaultSelectedItems));

                    try {
                        await updateDoc(userRef, {
                            selectedItems: JSON.stringify(defaultSelectedItems)
                        })
                        console.log("updated selectedItems (fb)!", defaultSelectedItems)
                    }
                    catch (error) {
                        console.log("error selectedItems data: ", error.message)
                    }
                }
            } catch (error) {
                console.log('Error storing selected items');
            }
        };

        updateAsyncStorage();
    }, [selectedItems]);

    const handleItemSelect = (newSelectedItems) => {
        //selectedItem is a list that get updated whenever someone selects/deselects item
        console.log("select4ed item: ", newSelectedItems);
        setSelectedItems(newSelectedItems);
    };

    const handleButtonPress = async () => { // take action button
        // navigation.navigate('Home');
        // we are going to store the selected items in async storage
        try {
            const uid = getUID();
            if (selectedItems.length > 0) {

                await AsyncStorage.setItem(uid + '|' + 'selectedItems', JSON.stringify(selectedItems));
            }
            // get the async item first and then modify that
            console.log('selected Items: ', selectedItems)
            if (selectedItems.length == 0) {
                console.log('No items selected');
                await AsyncStorage.setItem(uid + '|' + 'selectedItems', JSON.stringify(selectedItems));
            }
        }
        catch (error) {
            console.log('Error storing selected items');
        }
        navigation.navigate('Home', { items: selectedItems });
    }
    const handleAddActivity = (userInput) => {
        const updatedItems = [...selectedItems, userInput];
        setSelectedItems(updatedItems);
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.selectableListContainer}>
                <SelectableList data={itemNames} onItemSelect={handleItemSelect} />
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Enter your activity: "
                    />
                    <Button
                        title="Add"
                        // onpress={handleAddActivity}
                        color="#3498db"
                        onPress={handleAddActivity}
                    />
                </View>
            </View>

            <Button title="Take Action!" onPress={handleButtonPress}></Button>
        </SafeAreaView>

    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
        backgroundColor: '#3d3dac',
    },
    selectableListContainer: {
        height: '80%',
        width: '80%',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#3d3dac',
    },
    textInput: {
        height: 40, // Set a fixed height
        flex: 1, // Take remaining space
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 10,
        backgroundColor: '#ecf0f1',
        marginRight: 10, // Add some margin between TextInput and Button
    },
    inputContainer: {
        flexDirection: 'row', // Arrange children horizontally
        alignItems: 'center', // Center vertically
        margin: 10,
    },
    text: {
        fontSize: 40,
        margin: 10,
    },
});

export default ActivityScreen;