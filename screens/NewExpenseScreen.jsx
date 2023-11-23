import React, {useState} from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {Card, Button, Input} from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useTransactions} from '../TransactionContext';

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
    <View style={styles.container}>
      <Card>
        <Card.Title>Add New Record</Card.Title>
        <Card.Divider />
        <Input placeholder="Title" value={title} onChangeText={setTitle} />
        <Input
          placeholder="Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        <View style={styles.radioContainer}>
          <View style={styles.radioButton}>
            <Button
              title="Income"
              type={transactionType === 'income' ? 'solid' : 'outline'}
              onPress={() => setTransactionType('income')}
            />
          </View>
          <View style={styles.radioButton}>
            <Button
              title="Expense"
              type={transactionType === 'expense' ? 'solid' : 'outline'}
              onPress={() => setTransactionType('expense')}
            />
          </View>
        </View>

        <Button
          title="Select Date"
          onPress={() => setShowDatePicker(true)}
          buttonStyle={styles.button}
        />
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(Platform.OS === 'ios');
              setDate(selectedDate || date);
            }}
            maximumDate={new Date()}
          />
        )}
        <Button
          title="Add Record"
          onPress={handleAddTransaction}
          buttonStyle={styles.button}
        />
      </Card>
    </View>
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
  // ... other styles if needed ...
});

export default NewExpenseScreen;
