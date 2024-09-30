//home.tsx
import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Animated, Modal, Text, FlatList, Alert, Button } from 'react-native';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import { Link, useRouter, useLocalSearchParams } from 'expo-router';
import socketIO from 'socket.io-client';
 
import { storage } from './login';
import CallPopup from "@/components/CallPopup";

const windowWidth = Dimensions.get('window').width;

export default function QuestionScreen() {

  const [animation] = useState(new Animated.Value(0));
  const [selectedSkill, setSelectedSkill] = useState('');
  const [question, setQuestion] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showSkillError, setShowSkillError] = useState(false);
  const [showQuestionError, setShowQuestionError] = useState(false);
  const router = useRouter();

  //Incoming Doubt Call
  const [query, setQuery] = useState("");
  const [isEnabled, setIsEnabled] = useState(true);
  const [callerName, setCallerName] = useState("");
  const [doubtSessionId, setDoubtSessionId] = useState("");
  const [callPopupVisible, setCallPopupVisible] = useState(false);

  const socket = socketIO(process.env.API_KEY);

  const userID = storage.getString('user.userId');
  const userType = storage.getString('user.userType');
  const userName = storage.getString('user.username');
  const skillSet = storage.getString('user.skillSet');

  useEffect(() => {
    socket.emit('user-online', {
      id: userID,
      type: userType,
      skillSet: skillSet,
      username: userName,
    });
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {

      const response = await fetch(`${process.env.API_KEY}/v1/api/user?userCredentials=${userID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
      });
      if (response.status === 201) {
        const data = await response.json();

        setIsEnabled(data.isAvaliable);
        setQuestion(data.question || '');
        setSelectedSkill(data.questionType || '');
        // Set the initial animation value based on the toggle status
        Animated.timing(animation, {
          toValue: data.toggleStatus ? 1 : 0,
          duration: 0,
          useNativeDriver: false,
        }).start();
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const toggleSwitch = async () => {
    const newStatus = !isEnabled;
    setIsEnabled(!isEnabled);
    Animated.timing(animation, {
      toValue: newStatus ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const toggleInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['3%', '63%'],
  });

  const thumbColorInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#f4f3f4', '#ffffff'],
  });

  const backgroundColorInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#D3D3D3', '#34C759'],
  });

  const options = [
    { label: 'Figma', value: 'Figma' },
    { label: 'App Development', value: 'App Development' },
    { label: 'Power BI', value: 'Power BI' },
    { label: 'Photoshop', value: 'Photoshop' },
    { label: 'Web Development', value: 'Web Development' },
    { label: 'UI/UX Design', value: 'UI/UX Design' },
    { label: 'Data Analysis', value: 'Data Analysis' },
    { label: 'Graphic Design', value: 'Graphic Design' },
    { label: 'Content Creation', value: 'Content Creation' },
    { label: 'Cloud Computing', value: 'Cloud Computing' },
    { label: 'SEO Optimization', value: 'SEO Optimization' },
    { label: 'Machine Learning', value: 'Machine Learning' },
    { label: 'Digital Marketing', value: 'Digital Marketing' },
    { label: 'Blockchain', value: 'Blockchain' },
    { label: 'Artificial Intelligence', value: 'Artificial Intelligence' },
    { label: 'Game Development', value: 'Game Development' },
    { label: 'Cybersecurity', value: 'Cybersecurity' },
    { label: 'DevOps', value: 'DevOps' },
    { label: '3D Modeling', value: '3D Modeling' },
    { label: 'Video Editing', value: 'Video Editing' },
    { label: 'Database Management', value: 'Database Management' },
    { label: 'Animation', value: 'Animation' },
    { label: 'Cloud Architecture', value: 'Cloud Architecture' },
    { label: 'Product Management', value: 'Product Management' },
    { label: 'Salesforce', value: 'Salesforce' },
    { label: 'React Native', value: 'React Native' },
    { label: 'Next.js', value: 'Next.js' },
    { label: 'Backend Development', value: 'Backend Development' },
    { label: 'Others', value: 'Others' },
  ];

  const selectSkill = (value) => {
    setSelectedSkill(value);
    setShowSkillError(false);
  };

  const handleCallButtonPress = async () => {
    let hasError = false;

    if (!question.trim()) {
      setShowQuestionError(true);
      hasError = true;
    } else {
      setShowQuestionError(false);
    }

    if (!selectedSkill) {
      setShowSkillError(true);
      hasError = true;
    } else {
      setShowSkillError(false);
    }

    if (hasError) {
      return;
    }

    try {
      const response = await fetch(`${process.env.API_KEY}/v1/api/doubt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          doubt: question, 
          topic: selectedSkill 
        })
      });

      if (response.status === 201) {
        const data = await response.json();
        // Login successfull

        socket.emit('doubt', {
          username: userName,
          question: question,
          room: data.info._id,
          topic: data.info.topic,
        })
        router.push({ pathname: `/doubtSession`, params: { channelName: encodeURIComponent(`${data.info._id}`) }});
      } else {
        // This shouldn't happen if the backend is set up correctly, but just in case
        console.log('An unexpected error occurred. Please try again.');
      }

      /*
      if (!response.ok) {
        throw new Error('Failed to save question');
      }
      Alert.alert('Success', 'Your question has been saved.');*/
    } catch (error) {
      console.error('Error saving question:', error);
      Alert.alert('Error', 'Failed to save question. Please try again.');
    }
  };


  const handleEdit = async() => {
    try {
      // Update the user's joinOption in the database
      const response = await fetch(`${process.env.API_KEY}/api/users/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ userId}),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('User joinOption updated successfully:', data);
        
        // Navigate to the appropriate page
        
        setMenuVisible(false);
        router.push({
          pathname: '/joinoptions',
          params: { userId }
        });
      
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to edit user joinOption');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to edit user information. Please try again.');
    }
  };

  socket.on('doubt', (data) => {
    if(isEnabled) {
      setQuery(data.question);
      setCallerName(data.username);
      setDoubtSessionId(data.room);
      handleShowPopup();
    }
  })

  socket.on('calloff', () => {
    handleDeclineCall();
  })

  const handleShowPopup = () => {
    setCallPopupVisible(true);
  }

  const handleAcceptCall = () => {
    socket.emit('calloff');
    router.push({ pathname: `/doubtSession`, params: { channelName: encodeURIComponent(`${doubtSessionId}`) }});
  }

  const handleDeclineCall = () => {
    setCallPopupVisible(false);
  }

  return (
    <View style={styles.container}>
      {/* Hamburger Icon */}
      <TouchableOpacity style={styles.hamburger} onPress={() => setMenuVisible(true)}>
        <Entypo name="menu" size={30} color="black" />
      </TouchableOpacity>

      {/* Call Modal */}
      <View>
        <CallPopup 
          doubt={query}
          caller={callerName}
          visible={callPopupVisible}
          onAccept={handleAcceptCall}
          onDecline={handleDeclineCall}
        />
      </View>

      {/* Hamburger Menu Modal */}
      <Modal
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
        animationType="none"
      >
        <TouchableOpacity style={styles.callModalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.callModal}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleEdit}
            >
              <Text style={styles.menuText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                router.push('/');
              }}
            >
              <Text style={styles.menuText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Custom Toggle Button */}
      <TouchableOpacity onPress={toggleSwitch} style={styles.toggleContainer}>
        <Animated.View
          style={[
            styles.toggleBackground,
            {
              backgroundColor: backgroundColorInterpolation,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.toggleThumb,
              {
                left: toggleInterpolation,
                backgroundColor: thumbColorInterpolation,
              },
            ]}
          />
        </Animated.View>
      </TouchableOpacity>

      {/* Question Input */}
      <TextInput
        style={[styles.input, { fontSize: 20 }, showQuestionError && styles.errorInput]}
        placeholder="Type your question here"
        placeholderTextColor="#D3D3D3"
        value={question}
        onChangeText={setQuestion}
        multiline={true}
        textAlignVertical="top"
        scrollEnabled={true}
      />
      {showQuestionError && <Text style={styles.errorText}>Please type your question here</Text>}

      {/* Skill Dropdown */}
      <TouchableOpacity
        style={[styles.dropdownButton, showSkillError && { borderColor: 'red' }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.dropdownText, { color: selectedSkill ? 'black' : '#D3D3D3' }]}>
          {selectedSkill || 'Choose your skill here'}
        </Text>
        <AntDesign name="down" size={20} color="#D3D3D3" />
      </TouchableOpacity>
      {showSkillError && <Text style={styles.errorText}>Please select relevant skill</Text>}

      {/* Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionContainer}
                  onPress={() => {
                    selectSkill(item.value);
                    setModalVisible(false);
                  }}
                >
                  <View style={styles.radioButton}>
                    {selectedSkill === item.value && <View style={styles.radioButtonInner} />}
                  </View>
                  <Text style={styles.optionLabel}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Call Icon */}
      <TouchableOpacity style={styles.callButton} onPress={handleCallButtonPress}>
        <AntDesign name="phone" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  hamburger: {
    position: 'absolute',
    top: 60,
    left: 20,
  },
  callModalOverlay: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  callModal: {

  },
  menuModalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuModal: {
    backgroundColor: '#fff',
    width: 150,
    padding: 10,
    borderRadius: 10,
    marginTop: 100,
    marginLeft: 20,
  },
  menuItem: {
    paddingVertical: 10,
  },
  menuText: {
    fontSize: 18,
  },
  toggleContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 80,
    height: 40,
  },
  toggleBackground: {
    width: '100%',
    height: '100%',
    backgroundColor: '#D3D3D3',
    borderRadius: 50,
    justifyContent: 'center',
    padding: 2,
  },
  toggleThumb: {
    width: 36,
    height: 36,
    borderRadius: 18,
    position: 'absolute',
    backgroundColor: '#f4f3f4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    backgroundColor: '#F0F0F0',
    padding: 20,
    height: 150,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    fontSize: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#F7F7F7',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  dropdownText: {
    fontSize: 16,
    color: 'black',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 8,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  radioButton: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioButtonInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#000',
  },
  optionLabel: {
    fontSize: 16,
  },
  callButton: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 50,
    left: '42%',
    backgroundColor: '#32CD32',
    padding: 20,
    borderRadius: 50,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  errorInput: {
    borderColor: 'red',
  },
  callContainer: {
    flex: 1,
    position: "relative",
    zIndex: -1,
    justifyContent: "center",
    alignItems: "center",
  },
});