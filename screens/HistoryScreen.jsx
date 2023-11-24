import React from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import {Card, ListItem, Text, Icon} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTransactions} from '../TransactionContext';
import {commonStyles} from '../styles/CommonStyles';

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
    <ScrollView style={commonStyles.container}>
      <Card containerStyle={commonStyles.card}>
        <Text style={commonStyles.title}>Transaction History</Text>
        <Card.Divider />
        {transactions.map((transaction, index) => (
          <ListItem key={index} bottomDivider>
            <ListItem.Content>
              <View style={commonStyles.listItem}>
                <ListItem.Title style={commonStyles.listItemTitle}>
                  {transaction.title}
                </ListItem.Title>
                <ListItem.Subtitle style={commonStyles.listItemSubtitle}>
                  {transaction.amount >= 0
                    ? `+${transaction.amount}`
                    : `${transaction.amount}`}
                </ListItem.Subtitle>
              </View>
              <Text style={commonStyles.transactionDate}>
                {transaction.date}
              </Text>
            </ListItem.Content>
            <Icon
              name="close"
              type="antdesign"
              onPress={() => handleDeleteTransaction(transaction.id)}
            />
          </ListItem>
        ))}
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
