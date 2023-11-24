import React, {useState} from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Button,
} from 'react-native';
import {Card} from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useTransactions} from '../TransactionContext';
import {commonStyles} from '../styles/CommonStyles';

const NewExpenseScreen = ({navigation}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [transactionType, setTransactionType] = useState('expense');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const {addTransaction} = useTransactions();

  const handleAddTransaction = () => {
    if (!title || !amount) {
      alert('Please fill all fields');
      return;
    }

    const newTransaction = {
      id: Date.now(),
      title,
      amount:
        transactionType === 'expense'
          ? -Math.abs(parseFloat(amount))
          : Math.abs(parseFloat(amount)),
      date: date.toISOString().split('T')[0],
      type: transactionType,
    };

    addTransaction(newTransaction);
    navigation.navigate('Dashboard');
  };

  return (
    <ScrollView style={commonStyles.container}>
      <Card containerStyle={commonStyles.card}>
        <Text style={commonStyles.title}>Add New Record</Text>
        <TextInput
          style={commonStyles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={commonStyles.input}
          placeholder="Amount"
          value={amount}
          keyboardType="numeric"
          onChangeText={setAmount}
        />
        <TouchableOpacity
          style={commonStyles.button}
          onPress={() => setShowDatePicker(true)}>
          <Text style={commonStyles.buttonText}>Select Date</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              setDate(selectedDate || date);
            }}
            maximumDate={new Date()}
          />
        )}
        <TouchableOpacity
          style={commonStyles.button}
          onPress={handleAddTransaction}>
          <Text style={commonStyles.buttonText}>Add Record</Text>
        </TouchableOpacity>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  button: {
    marginTop: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  radioButton: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default NewExpenseScreen;
