import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TransactionContext = createContext();

export const useTransactions = () => useContext(TransactionContext);

export const TransactionProvider = ({children}) => {
  const [transactions, setTransactions] = useState([]);
  const [savingGoal, setSavingGoal] = useState(null);

  useEffect(() => {
    const loadTransactions = async () => {
      const storedTransactions = await AsyncStorage.getItem('transactions');
      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      }
    };

    // Load saving goal
    const loadSavingGoal = async () => {
      const storedGoal = await AsyncStorage.getItem('savingGoal');
      if (storedGoal) {
        setSavingGoal(JSON.parse(storedGoal));
      }
    };

    loadTransactions();
    loadSavingGoal();
  }, []);

  const addTransaction = async transaction => {
    const updatedTransactions = [transaction, ...transactions];
    setTransactions(updatedTransactions);
    await AsyncStorage.setItem(
      'transactions',
      JSON.stringify(updatedTransactions),
    );
  };

  const saveSavingGoal = async goal => {
    setSavingGoal(goal);
    await AsyncStorage.setItem('savingGoal', JSON.stringify(goal));
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        setTransactions,
        addTransaction,
        savingGoal,
        saveSavingGoal,
      }}>
      {children}
    </TransactionContext.Provider>
  );
};

export default TransactionProvider;
