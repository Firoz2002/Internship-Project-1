//index.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { MMKV } from 'react-native-mmkv';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = new MMKV();

export default function SignupScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [error, setError] = useState('');

  const [fullNameError, setFullNameError] = useState(false);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(false);
  const [signupError, setSignupError] = useState(null);

  const router = useRouter();

  const handleSignUp = async() => {
    let hasError = false;
    setSignupError(null);
    
    // Validate Full Name
    if (!fullName) {
      setFullNameError(true);
      hasError = true;
    } else {
      setFullNameError(false);
    }
  
    // Validate Email
    const validDomains = [
      '@gmail.com',
      '@outlook.com',
      '@yahoo.com',
      '@hotmail.com',
      '@icloud.com',
      '@aol.com',
      '@protonmail.com',
      '@zoho.com',
      '@mail.com',
      '@gmx.com'
    ];
    
    if (!email) {
      setEmailError('This field is required');
      hasError = true;
    } else if (!validDomains.some(domain => email.endsWith(domain))) {
      setEmailError('Enter valid email');
      hasError = true;
    } else {
      setEmailError(null);
    }
    
  
    // Validate Password
    if (!password) {
      setPasswordError(true);
      hasError = true;
    } else {
      setPasswordError(false);
    }
  
    // If no errors, print the data and reset the fields
    if (!hasError) {
      try {
        const response = await fetch(`${process.env.API_KEY}/v1/api/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ 
            username: fullName, 
            email: email, 
            password: password, 
          }),
        });
  
        const data = await response.json();
        console.log('Response from server:', data);
  
        if (response.ok) {
          const userID = AsyncStorage.getItem('user.userId');
          const userType = AsyncStorage.getItem('user.userType');
          const userName = AsyncStorage.getItem('user.username');
          const skillSet = AsyncStorage.getItem('user.skillSet');
          console.log('Signup successful. Attempting to navigate to joinoptions screen');
          router.push({
            pathname: '/joinoptions',
            params: { userId: data.userId }
          });
        } else {
          console.error('Signup failed:', data.message);
          Alert.alert('Error', data.message || 'An error occurred during signup');
          setSignupError('Account with this email id already exists.');
        }
      } catch (error) {
        if (error.response && error.response.status === 500) {
          setSignupError('Account with this email id already exists.');
        } else {
          setSignupError('unknown error occurred. Please try again.');
        }
        // Do not redirect to home page on error
      }
    }
  };

  const handleLogin = () => {
    router.push('/login');
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome!</Text>
      <Text style={styles.subText}>Unlock Potential or Share Wisdom</Text>

      <TextInput
        style={[styles.input, fullNameError && styles.errorInput]}
        placeholder="Your full name"
        placeholderTextColor="#B0B0B0"
        value={fullName}
        onChangeText={setFullName}
      />
      {fullNameError && <Text style={styles.errorText}>This field is required</Text>}

      <TextInput
        style={[styles.input, emailError && styles.errorInput]}
        placeholder="Email address"
        placeholderTextColor="#B0B0B0"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {emailError && <Text style={styles.errorText}>{emailError}</Text>}

      <View style={[styles.passwordContainer, passwordError && styles.errorInput]}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Create password"
          placeholderTextColor="#B0B0B0"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={hidePassword}
        />
        <TouchableOpacity
          onPress={() => setHidePassword(!hidePassword)}
          style={styles.eyeIcon}
        >
          <FontAwesome5
            name={hidePassword ? 'eye-slash' : 'eye'}
            size={20}
            color="#B0B0B0"
          />
        </TouchableOpacity>
      </View>
      {passwordError && <Text style={styles.errorText}>This field is required</Text>}

      {signupError && <Text style={styles.signupErrorText}>{signupError}</Text>}
      <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
        <Text style={styles.signupButtonText}>Sign up</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>or</Text>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Log in</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>or Login with</Text>

      <View style={styles.socialButtons}>
        <TouchableOpacity style={styles.socialButton}>
          <Image
            style={{ width: 24, height: 24 }}
            source={require('../assets/images/google.png')}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton}>
          <AntDesign name="linkedin-square" size={24} color="#0077B5" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <AntDesign name="apple1" size={24} color="#000000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#A0A0A0',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 5,
    backgroundColor: '#F7F7F7',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 5,
    backgroundColor: '#F7F7F7',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontSize: 16,
  },
  eyeIcon: {
    paddingHorizontal: 10,
  },
  signupButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: '10%',
    marginLeft: '20%',
    marginBottom: 20,
    width: '60%',
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginLeft: '20%',
    marginBottom: 20,
    width: '60%',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#A0A0A0',
    marginBottom: 20,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  socialButton: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  errorInput: {
    borderColor: 'red',
    elevation: 3,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  signupErrorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
});