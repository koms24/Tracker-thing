import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { UserFormData } from '../app/FormData';
import { submitToGoogleSheets } from '../services/googleSheets';

const CATEGORIES: Array<'business' | 'food' | 'base'> = ['business', 'food', 'base'];

export default function ExpenseForm() {
  const [formData, setFormData] = useState<UserFormData>({
    cost: 0,
    category: 'business',
    what: '',
    where: '',
    why: '',
    receipt: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // Validation
    if (!formData.cost || formData.cost <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid cost amount');
      return;
    }
    if (!formData.what.trim()) {
      Alert.alert('Validation Error', 'Please enter what was purchased');
      return;
    }
    if (!formData.where.trim()) {
      Alert.alert('Validation Error', 'Please enter where it was purchased');
      return;
    }
    if (!formData.why.trim()) {
      Alert.alert('Validation Error', 'Please enter why it was purchased');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitToGoogleSheets(formData);
      if (result.success) {
        Alert.alert('Success', 'Expense submitted successfully!', [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setFormData({
                cost: 0,
                category: 'business',
                what: '',
                where: '',
                why: '',
                receipt: '',
              });
            },
          },
        ]);
      } else {
        Alert.alert('Error', result.message || 'Failed to submit expense');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'business':
        return '#ff00ff'; // Pink
      case 'food':
        return '#ff9900'; // Orange
      case 'base':
        return '#FF0000'; // Red
      default:
        return '#FFFFFF';
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Add Expense</Text>

      {/* Cost Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Cost ($)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          placeholderTextColor="#999"
          keyboardType="decimal-pad"
          value={formData.cost > 0 ? formData.cost.toString() : ''}
          onChangeText={(text) => {
            const num = parseFloat(text) || 0;
            setFormData({ ...formData, cost: num });
          }}
        />
      </View>

      {/* Category Selection */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryContainer}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                formData.category === cat && {
                  backgroundColor: getCategoryColor(cat),
                  borderColor: getCategoryColor(cat),
                },
              ]}
              onPress={() => setFormData({ ...formData, category: cat })}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  formData.category === cat && styles.categoryButtonTextSelected,
                ]}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* What */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>WHAT</Text>
        <TextInput
          style={styles.input}
          placeholder="What was purchased?"
          placeholderTextColor="#999"
          value={formData.what}
          onChangeText={(text) => setFormData({ ...formData, what: text })}
        />
      </View>

      {/* Where */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>WHERE</Text>
        <TextInput
          style={styles.input}
          placeholder="Where was it purchased?"
          placeholderTextColor="#999"
          value={formData.where}
          onChangeText={(text) => setFormData({ ...formData, where: text })}
        />
      </View>

      {/* Why */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>WHY</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Why was it purchased?"
          placeholderTextColor="#999"
          multiline
          numberOfLines={3}
          value={formData.why}
          onChangeText={(text) => setFormData({ ...formData, why: text })}
        />
      </View>

      {/* Receipt (Optional) */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>RECEIPT (Optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Receipt information or URL"
          placeholderTextColor="#999"
          multiline
          numberOfLines={2}
          value={formData.receipt}
          onChangeText={(text) => setFormData({ ...formData, receipt: text })}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Submit Expense</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  categoryButtonTextSelected: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});


