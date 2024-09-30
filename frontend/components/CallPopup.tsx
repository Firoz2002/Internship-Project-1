import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";

interface CallPopupProps {
    doubt: string;
    caller: string;
    visible: boolean;
    onAccept: () => void;
    onDecline: () => void;
}

const CallPopup: React.FC<CallPopupProps> = ({
    doubt,
    caller,
    visible,
    onAccept,
    onDecline,
}) => {
    const [slideAnim] = useState(new Animated.Value(-100));

    useEffect(() => {
        if(visible) {
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    if(!visible) return null;

    return (
        <Animated.View
            style={[
                styles.popupContainer,
                { transform: [{ translateY: slideAnim }] },
            ]}
        >
            <Text style={styles.title}> Doubt: {doubt} </Text>
            <Text style={styles.callerName}> Caller: {caller} </Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                style={[styles.button, styles.declineButton]}
                onPress={onDecline}
                >
                <Text style={styles.buttonText}>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={[styles.button, styles.acceptButton]}
                onPress={onAccept}
                >
                <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    popupContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "white",
        padding: 20,
        alignItems: "center",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    callerName: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 25,
        elevation: 2,
        marginHorizontal: 10,
    },
    declineButton: {
        backgroundColor: "#FF3B30",
    },
    acceptButton: {
        backgroundColor: "#34C759",
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
});
export default CallPopup;