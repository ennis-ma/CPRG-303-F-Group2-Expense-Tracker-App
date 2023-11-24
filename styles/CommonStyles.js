import {StyleSheet} from 'react-native';

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  card: {
    borderRadius: 8,
    margin: 10,
    padding: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  subtitle: {
    fontSize: 14,
    color: '#555555',
  },
  button: {
    backgroundColor: '#FFB6C1', // Light pink
    padding: 10,
    margin: 10,
    borderRadius: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  chartStyle: {
    borderRadius: 8,
    margin: 10,
  },
  listItem: {
    backgroundColor: '#ffffff',
  },
  listItemTitle: {
    fontSize: 16,
    color: '#333333',
  },
  listItemSubtitle: {
    fontSize: 14,
    color: '#555555',
  },
  alertText: {
    fontSize: 14,
    color: '#FF6347', // Tomato color for alerts
    textAlign: 'center',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
  },
});
