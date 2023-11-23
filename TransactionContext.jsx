import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TransactionContext = createContext();

export const useTransactions = () => useContext(TransactionContext);

export const TransactionProvider = ({children}) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const loadTransactions = async () => {
      const storedTransactions = await AsyncStorage.getItem('transactions');
      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      }
    };

    loadTransactions();
  }, []);

  const addTransaction = async transaction => {
    const updatedTransactions = [transaction, ...transactions];
    setTransactions(updatedTransactions);
    await AsyncStorage.setItem(
      'transactions',
      JSON.stringify(updatedTransactions),
    );
  };

  return (
    <TransactionContext.Provider
      value={{transactions, setTransactions, addTransaction}}>
      {children}
    </TransactionContext.Provider>
  );
};

export default TransactionProvider;
