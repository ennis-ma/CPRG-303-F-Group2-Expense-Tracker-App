import React, {useState} from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Dimensions,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
} from 'react-native';
import {Card, ListItem} from 'react-native-elements';
import {LineChart} from 'react-native-chart-kit';
import {useTransactions} from '../TransactionContext';
import {useNavigation} from '@react-navigation/native';
import {commonStyles} from '../styles/CommonStyles';

const DashboardScreen = () => {
  const {transactions, savingGoal, saveSavingGoal} = useTransactions();
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const navigation = useNavigation();
  const [tempGoal, setTempGoal] = useState(savingGoal || '');

  // Sort and limit transactions to the most recent 10
  const recentTransactions = transactions.slice(0, 5);

  const getLast7DaysDates = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setUTCDate(date.getUTCDate() - i); // Use UTC date to avoid time zone issues
      const day = date.getUTCDate(); // Get the day as a number
      dates.push(day.toString()); // Convert to string and add to array
    }
    return dates;
  };

  const aggregateTransactionsByDate = transactions => {
    const last7Days = getLast7DaysDates(); // Array of day numbers as strings
    const data = {
      income: {},
      expense: {},
    };

    // Initialize income and expense data for each of the last 7 days
    last7Days.forEach(day => {
      data.income[day] = 0;
      data.expense[day] = 0;
    });

    // Aggregate transactions
    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      const transactionDay = transactionDate.getUTCDate().toString(); // Use UTC date
      if (last7Days.includes(transactionDay)) {
        const amount = transaction.amount;
        const category = amount >= 0 ? 'income' : 'expense';
        data[category][transactionDay] += Math.abs(amount);
      }
    });

    return {
      labels: last7Days,
      datasets: [
        {
          data: last7Days.map(day => data.income[day]),
          color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`, // Green for income
          strokeWidth: 2,
          propsForDots: {
            r: '6',
            fill: '#AED581', // Pastel green for income dots
            strokeWidth: '2',
            stroke: '#AED581',
          },
        },
        {
          data: last7Days.map(day => data.expense[day]),
          color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Red for expense
          strokeWidth: 2,
          propsForDots: {
            r: '6',
            fill: '#E57373', // Pastel red for expense dots
            strokeWidth: '2',
            stroke: '#E57373',
          },
        },
      ],
    };
  };

  const handleSaveGoal = () => {
    saveSavingGoal(tempGoal);
    setIsEditingGoal(false);
  };

  const getCurrentMonthAndYear = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      '0',
    )}`;
  };

  const calculateCurrentMonthBalance = transactions => {
    const currentMonthAndYear = getCurrentMonthAndYear();
    return transactions
      .filter(transaction => {
        const transactionMonthAndYear = transaction.date.substring(0, 7);
        return transactionMonthAndYear === currentMonthAndYear;
      })
      .reduce((acc, transaction) => acc + transaction.amount, 0);
  };

  const chartConfig = {
    backgroundColor: '#FFB6C1',
    backgroundGradientFrom: '#FFB6C1',
    backgroundGradientTo: '#FFB6C1',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#FFFFFF',
    },
  };
  const chartData = aggregateTransactionsByDate(transactions);
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth; // Adjust for padding
  const currentMonthTransactionBalance =
    calculateCurrentMonthBalance(transactions); // Implement this function
  const isGoalAchieved = currentMonthTransactionBalance >= savingGoal;

  // Check if there are valid data points for the chart
  const hasValidChartData =
    chartData.labels.length > 0 && chartData.datasets[0].data.length > 0;

  return (
    <ScrollView style={commonStyles.container}>
      <Text
        style={[
          styles.goalAchievementMessage,
          isGoalAchieved ? styles.goalAchieved : styles.goalNotAchieved,
        ]}>
        {isGoalAchieved
          ? `Congratulations 🎉, you are ${
              currentMonthTransactionBalance - savingGoal
            } ahead of your saving goal. Keep up!`
          : `You are ${
              savingGoal - currentMonthTransactionBalance
            } below your saving goal. Work harder 💪!`}
      </Text>

      {hasValidChartData ? (
        <LineChart
          data={chartData}
          width={chartWidth}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={commonStyles.chartStyle}
        />
      ) : (
        <Text style={commonStyles.noDataText}>
          No transaction data available.
        </Text>
      )}

      <Card containerStyle={commonStyles.card}>
        <Text style={commonStyles.title}>Recently Added Transactions</Text>
        <Card.Divider />
        {recentTransactions.map((transaction, index) => (
          <ListItem key={index} bottomDivider>
            <ListItem.Content style={commonStyles.listItem}>
              <View>
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
          </ListItem>
        ))}
        {transactions.length > 5 && (
          <TouchableOpacity onPress={() => navigation.navigate('History')}>
            <Text style={commonStyles.showMoreText}>Show more</Text>
          </TouchableOpacity>
        )}
      </Card>

      {isEditingGoal ? (
        <View style={commonStyles.card}>
          <TextInput
            value={tempGoal}
            onChangeText={setTempGoal}
            keyboardType="numeric"
            style={commonStyles.input}
          />
          <Button title="Save Goal" onPress={handleSaveGoal} />
        </View>
      ) : (
        <View style={styles.goalContainer}>
          <Text style={styles.goalText}>
            Monthly Saving Goal:
            <Text style={commonStyles.goalAmount}>${savingGoal}</Text>
            <Text
              style={styles.editGoalSetting}
              onPress={() => setIsEditingGoal(true)}>
              edit
            </Text>
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  cardContainer: {
    paddingHorizontal: 0, // Ensure no extra padding
  },
  chartStyle: {
    borderRadius: 16,
    alignSelf: 'center',
  },
  noDataText: {
    textAlign: 'center',
    marginVertical: 20,
  },
  listItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionDate: {
    fontSize: 12,
    color: 'gray',
  },
  showMoreText: {
    color: 'blue',
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
  goalAchievementMessage: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    padding: 10,
  },
  goalAchieved: {
    color: '#4CAF50', // Green for success
    backgroundColor: '#E8F5E9', // Light green background
  },
  goalNotAchieved: {
    color: '#F44336', // Red for attention
    backgroundColor: '#FFEBEE', // Light red background
  },
  editGoalSetting: {
    color: '#2196F3', // Blue for interactivity
    textDecorationLine: 'underline',
    padding: 5,
    marginTop: 10,
  },
  goalContainer: {
    backgroundColor: '#FFFDE7', // A light background color
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  goalText: {
    fontSize: 16,
    color: '#333333', // Dark color for contrast
    textAlign: 'center',
    marginBottom: 5,
  },
  goalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50', // A color that stands out
    textAlign: 'center',
    marginTop: 5,
  },
});

export default DashboardScreen;
