import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import History from './History';

export default function TdeeCalculator() {
  const [formData, setFormData] = useState({
    age: '',
    gender: 'male',
    weight: '',
    height: '',
    activityLevel: '1.2'
  });
  const [tdee, setTdee] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem('tdeeHistory');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const saveToHistory = async (tdeeValue) => {
    try {
      const newEntry = {
        ...formData,
        tdee: tdeeValue,
        date: new Date().getTime(),
      };
      const updatedHistory = [newEntry, ...history].slice(0, 10); 
      await AsyncStorage.setItem('tdeeHistory', JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
    } catch (error) {
      console.error('Error saving history:', error);
    }
  };

  const validateForm = () => {
    let tempErrors = {};
    
    if (!formData.age) tempErrors.age = 'Age is required';
    else if (formData.age < 15 || formData.age > 80) tempErrors.age = 'Age must be between 15 and 80';
    
    if (!formData.weight) tempErrors.weight = 'Weight is required';
    else if (formData.weight < 30 || formData.weight > 300) tempErrors.weight = 'Weight must be between 30 and 300 kg';
    
    if (!formData.height) tempErrors.height = 'Height is required';
    else if (formData.height < 130 || formData.height > 230) tempErrors.height = 'Height must be between 130 and 230 cm';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const calculateTDEE = () => {
    if (!validateForm()) {
      Alert.alert(
        "Invalid Input",
        "Please check all fields and try again.",
        [{ text: "OK" }]
      );
      return;
    }

    const { age, gender, weight, height, activityLevel } = formData;
    let bmr;
    
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    
    const calculatedTdee = Math.round(bmr * parseFloat(activityLevel));
    setTdee(calculatedTdee);
    saveToHistory(calculatedTdee);
  };

  if (showHistory) {
    return (
      <View style={styles.container}>
        <History history={history} />
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => setShowHistory(false)}
        >
          <Text style={styles.buttonText}>Back to Calculator</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>TDEE Calculator</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Age</Text>
        <TextInput
          style={[styles.input, errors.age && styles.inputError]}
          keyboardType="numeric"
          value={formData.age}
          onChangeText={(text) => {
            setFormData({...formData, age: text});
            if (errors.age) setErrors({...errors, age: null});
          }}
          placeholder="Enter your age"
        />
        {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}

        <Text style={styles.label}>Gender</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.gender}
            onValueChange={(value) => setFormData({...formData, gender: value})}
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label="Male" value="male" color="#000000" />
            <Picker.Item label="Female" value="female" color="#000000" />
          </Picker>
        </View>

        <Text style={styles.label}>Weight (kg)</Text>
        <TextInput
          style={[styles.input, errors.weight && styles.inputError]}
          keyboardType="numeric"
          value={formData.weight}
          onChangeText={(text) => {
            setFormData({...formData, weight: text});
            if (errors.weight) setErrors({...errors, weight: null});
          }}
          placeholder="Enter your weight"
        />
        {errors.weight && <Text style={styles.errorText}>{errors.weight}</Text>}

        <Text style={styles.label}>Height (cm)</Text>
        <TextInput
          style={[styles.input, errors.height && styles.inputError]}
          keyboardType="numeric"
          value={formData.height}
          onChangeText={(text) => {
            setFormData({...formData, height: text});
            if (errors.height) setErrors({...errors, height: null});
          }}
          placeholder="Enter your height"
        />
        {errors.height && <Text style={styles.errorText}>{errors.height}</Text>}

        <Text style={styles.label}>Activity Level</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.activityLevel}
            onValueChange={(value) => setFormData({...formData, activityLevel: value})}
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label="Sedentary" value="1.2" color="#000000" />
            <Picker.Item label="Lightly active" value="1.375" color="#000000" />
            <Picker.Item label="Moderately active" value="1.55" color="#000000" />
            <Picker.Item label="Very active" value="1.725" color="#000000" />
            <Picker.Item label="Extra active" value="1.9" color="#000000" />
          </Picker>
        </View>

        <TouchableOpacity style={styles.button} onPress={calculateTDEE}>
          <Text style={styles.buttonText}>Calculate TDEE</Text>
        </TouchableOpacity>

        {tdee && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Your TDEE:</Text>
            <Text style={styles.resultValue}>{tdee} calories/day</Text>
          </View>
        )}
      </View>
      
      <TouchableOpacity 
        style={[styles.button, { marginTop: 10 }]} 
        onPress={() => setShowHistory(true)}
      >
        <Text style={styles.buttonText}>View History</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    
    
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: 'white',
  },
  picker: {
    height: Platform.OS === 'ios' ? 150 : 50,
    width: '100%',
  },
  pickerItem: {
    fontSize: 16,
    height: 150,
  },
  button: {
    backgroundColor: 'rgba(0, 122, 255, 0.9)',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  resultValue: {
    fontSize: 24,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  inputError: {
    borderColor: '#ff0000',
    borderWidth: 1,
  },
  errorText: {
    color: '#ff0000',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
});
