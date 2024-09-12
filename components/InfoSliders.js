import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Slider from '@react-native-community/slider';

const InfoSliders = ({ title, unit, val, setVal, minVal, maxVal, step}) => {
    return (
        <View style={styles.sliderContainer}>
            <Text style={styles.textStyles}>{title}: {val} {unit}</Text>
            <Slider
                style={styles.sliderStyle}
                minimumValue={minVal}
                maximumValue={maxVal}
                step={step}
                onValueChange={setVal}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#000000"
            />
        </View>
    )
}

export default InfoSliders

const styles = StyleSheet.create({
    sliderContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
    textStyles: {
        color: "#FFF",
        fontSize: 20,
        textAlign: "center",
        fontWeight: 600
    },
    sliderStyle: {
        width: '100%',
        height: 40
    }
})