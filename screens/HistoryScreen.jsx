import React from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import {Card, ListItem, Text, Icon} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTransactions} from '../TransactionContext';

const HistoryScreen = () => {
  const {transactions, setTransactions} = useTransactions();

  const handleDeleteTransaction = id => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {text: 'OK', onPress: () => deleteTransaction(id)},
      ],
    );
  };

  const deleteTransaction = async id => {
    const updatedTransactions = transactions.filter(t => t.id !== id);
    setTransactions(updatedTransactions);
    await AsyncStorage.setItem(
      'transactions',
      JSON.stringify(updatedTransactions),
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card>
        <Card.Title>Transaction History</Card.Title>
        <Card.Divider />
        {transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <ListItem key={index} bottomDivider>
              <ListItem.Content style={styles.listItemContent}>
                <View>
                  <ListItem.Title>{transaction.title}</ListItem.Title>
                  <ListItem.Subtitle>
                    {transaction.amount >= 0
                      ? `+$${transaction.amount}`
                      : transaction.amount}
                  </ListItem.Subtitle>
                </View>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </ListItem.Content>
              <Icon
                name="close"
                type="antdesign"
                onPress={() => handleDeleteTransaction(transaction.id)}
              />
            </ListItem>
          ))
        ) : (
          <Text style={styles.noTransactionsText}>No transactions found.</Text>
        )}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  noTransactionsText: {
    textAlign: 'center',
    marginVertical: 20,
  },
  // ... add any additional styles you need here
});

export default HistoryScreen;
