import React, { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

const SelectableList = ({ data, onItemSelect }) => {
    const [selectedItems, setSelectedItems] = useState([]);
    // console.log("Props in SelectableList:", { data, onItemSelect });

    const toggleItem = (item) => {
        // Check if the item is already selected
        const isSelected = selectedItems.includes(item);

        // If the item is selected, remove it from the selected items
        // If the item is not selected and we haven't reached the max selection limit, add it
        // If the item is not selected and we've reached the max selection limit, do nothing
        let newSelectedItems;
        if (isSelected) {
            newSelectedItems = selectedItems.filter((i) => i !== item);
        } else if (selectedItems.length <  5) {
            newSelectedItems = [...selectedItems, item];
        }

        if (newSelectedItems) {
            setSelectedItems(newSelectedItems);
            onItemSelect(newSelectedItems); // Call the callback function with the updated list of selected items
        }
    };

    const renderItem = ({ item, index }) => {
        // Determine if the item is the first or the last in the list
        const isFirstItem = index ===  0;
        const isLastItem = index === data.length -  1;

        // Apply different border radius styles based on the item's position
        const borderRadiusStyle = {
            borderTopLeftRadius: isFirstItem ?  10 :  0,
            borderTopRightRadius: isFirstItem ?  10 :  0,
            borderBottomLeftRadius: isLastItem ?  10 :  0,
            borderBottomRightRadius: isLastItem ?  10 :  0,
        };

        return (
            <TouchableOpacity onPress={() => toggleItem(item)}>
                <View style={{
                    flex:  1, // Make the View take up the full width
                    padding:  10,
                    backgroundColor: selectedItems.includes(item) ? 'lightblue' : '#32328A',
                    borderBottomWidth: isLastItem ?  0 :  1, // Remove bottom border for the last item
                    borderBottomColor: 'lightgray',
                    justifyContent: 'center', // Center the text vertically
                    alignItems: 'center', // Center the text horizontally
                    ...borderRadiusStyle, // Apply the border radius styles
                }}>
                    <Text style={{ color: 'white', fontSize:  24 }}>{item}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item}
        />
    );
};
export default SelectableList;
