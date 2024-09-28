//joinoptions.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function JoinAsLearnerAndGuru() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [showError, setShowError] = useState(false);
  const router = useRouter();
  const { userId } = useLocalSearchParams();

  console.log('JoinAsLearnerAndGuru rendered. Received userId:', userId);

  const options = [
    { label: 'Learner', value: 'Learner' },
    { label: 'Guru', value: 'Guru' },
  ];

  const toggleRole = (value) => {
    setSelectedRoles(prevRoles => {
      if (prevRoles.includes(value)) {
        return prevRoles.filter(role => role !== value);
      } else {
        return [...prevRoles, value];
      }
    });
    setShowError(false);
  };

  const handleNext = async () => {
    console.log('handleNext called. Selected roles:', selectedRoles);

    if (selectedRoles.length === 0) {
      setShowError(true);
      return;
    }

    let joinOption;
    if (selectedRoles.includes('Guru') && selectedRoles.includes('Learner')) {
      joinOption = 'both';
    } else if (selectedRoles.includes('Guru')) {
      joinOption = 'mentor';
    } else {
      joinOption = 'student';
    }

    console.log('Determined joinOption:', joinOption);

    try {
      // Update the user's joinOption in the database
      const response = await fetch(`${process.env.API_KEY}/v1/api/user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userType: joinOption
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('User joinOption updated successfully:', data);
        
        // Navigate to the appropriate page
        if (joinOption === 'Learner') { 
          console.log('Navigating to skilloptionslearner');
          router.push({
            pathname: '/skilloptionslearner',
            params: { userId, joinOption }
          });
        } else {
          console.log('Navigating to skilloptionsguru');
          router.push({
            pathname: '/skilloptionsguru',
            params: { userId, joinOption }
          });
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user joinOption');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to update user information. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.headerText}>Join as Learner & Guru</Text>
      <Text style={styles.subText}>Learn and share.</Text>

      <TouchableOpacity
        style={[styles.dropdownButton, showError && styles.errorBorder]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.dropdownText, { color: selectedRoles.length === 0 ? '#D3D3D3' : 'black' }]}>
          {selectedRoles.length > 0 ? selectedRoles.join(', ') : 'Choose your role here'}
        </Text>
        <AntDesign name="down" size={20} color="#D3D3D3" />
      </TouchableOpacity>

      {showError && <Text style={styles.errorText}>Please select your role</Text>}

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionContainer}
                  onPress={() => toggleRole(item.value)}
                >
                  <View style={[styles.checkbox, selectedRoles.includes(item.value) && styles.checkedBox]}>
                    {selectedRoles.includes(item.value) && (
                      <AntDesign name="check" size={16} color="#FFFFFF" />
                    )}
                  </View>
                  <Text style={styles.optionLabel}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.doneButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>
          Next <AntDesign name="arrowright" size={16} color="#FFFFFF" />
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#A0A0A0',
    marginBottom: 40,
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
    marginBottom: 10,
  },
  errorBorder: {
    borderColor: 'red',
  },
  dropdownText: {
    fontSize: 16,
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
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#007BFF',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: '#007BFF',
  },
  optionLabel: {
    fontSize: 16,
  },
  doneButton: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    width: '60%',
    marginLeft: '20%',
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 30,
    width: '60%',
    marginLeft: '20%',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});