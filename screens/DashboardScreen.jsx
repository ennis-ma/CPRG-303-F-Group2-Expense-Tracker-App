import React from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import {Card, ListItem} from 'react-native-elements';
import {LineChart} from 'react-native-chart-kit';
import {useTransactions} from '../TransactionContext';
import {useNavigation} from '@react-navigation/native';

const DashboardScreen = () => {
  const {transactions} = useTransactions();
  const navigation = useNavigation();

  // Sort and limit transactions to the most recent 10
  const recentTransactions = transactions.slice(0, 10);

  const aggregateTransactionsByDate = transactions => {
    if (transactions.length === 0) {
      return {
        labels: [],
        datasets: [{data: []}],
      };
    }

    const data = {};
    transactions.forEach(transaction => {
      const date = transaction.date; // format 'YYYY-MM-DD'
      if (data[date]) {
        data[date] += Math.abs(transaction.amount);
      } else {
        data[date] = Math.abs(transaction.amount);
      }
    });

    return {
      labels: Object.keys(data),
      datasets: [{data: Object.values(data)}],
    };
  };

  const chartData = aggregateTransactionsByDate(transactions);
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 30; // Adjust for padding

  // Check if there are valid data points for the chart
  const hasValidChartData =
    chartData.labels.length > 0 && chartData.datasets[0].data.length > 0;

  return (
    <ScrollView style={styles.container}>
      {hasValidChartData ? (
        <LineChart
          data={chartData}
          width={chartWidth}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chartStyle}
        />
      ) : (
        <Text style={styles.noDataText}>No transaction data available.</Text>
      )}

      <Card>
        <Card.Title>Recently Added Transactions</Card.Title>
        <Card.Divider />
        {recentTransactions.map((transaction, index) => (
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
          </ListItem>
        ))}
        {transactions.length > 10 && (
          <TouchableOpacity onPress={() => navigation.navigate('History')}>
            <Text style={styles.showMoreText}>Show more</Text>
          </TouchableOpacity>
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
  cardContainer: {
    paddingHorizontal: 0, // Ensure no extra padding
  },
  chartStyle: {
    borderRadius: 16,
    alignSelf: 'center',
    marginTop: 20,
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
});

const chartConfig = {
  backgroundColor: '#e26a00',
  backgroundGradientFrom: '#fb8c00',
  backgroundGradientTo: '#ffa726',
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
};

export default DashboardScreen;
