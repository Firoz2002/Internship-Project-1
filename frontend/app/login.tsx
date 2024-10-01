//login.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);

  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [loginError, setLoginError] = useState(null);

  const router = useRouter();

  const handleLogin = async () => {
    let hasError = false;
    setLoginError(null);

    const validDomains = [
      '@gmail.com', '@outlook.com', '@yahoo.com', '@hotmail.com', '@icloud.com',
      '@aol.com', '@protonmail.com', '@zoho.com', '@mail.com', '@gmx.com'
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
    
    if (!password) {
      setPasswordError('This field is required');
      hasError = true;
    } else {
      setPasswordError(null);
    }

    if (hasError) {
      return; 
    }

    try {
      const response = await fetch(`${process.env.API_KEY}/v1/api/signin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ 
            email: email, 
            password: password, 
          }),
      });

      const data = await response.json();

      if (response.status === 201 && data.userId) {
        // Login successful
        await AsyncStorage.setItem('userId', data.userId);
        await AsyncStorage.setItem('userType', data.userType);
        await AsyncStorage.setItem('username', data.userName);
        await AsyncStorage.setItem('skillSet', JSON.stringify(data.skillSet));
        
        router.push(`/home`);
      } else {
        // This shouldn't happen if the backend is set up correctly, but just in case
        setLoginError('An unexpected error occurred. Please try again.');
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 401) {
        setLoginError('Invalid email or password.');
      } else {
        setLoginError('unknown error occurred. Please try again.');
      }
      // Do not redirect to home page on error
    }
  };

  return (
    <View style={styles.container}>

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.welcomeText}>Welcome!</Text>
      <Text style={styles.subText}>Unlock Potential or Share Wisdom</Text>

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
          placeholder="Enter password"
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
      {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

      {loginError && <Text style={styles.loginErrorText}>{loginError}</Text>}

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Log in</Text>
      </TouchableOpacity>
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

  loginButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginLeft: '20%',
    marginTop: '10%',
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
  errorInput: {
    borderColor: 'red',
    elevation: 3,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  loginErrorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 10,
  },
 
});