import React, { useState } from 'react';
import { SafeAreaView, TextInput, Button, FlatList, Text, View } from 'react-native';
import axios from 'axios';
import { format } from 'date-fns';

const App = () => {
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');
  const [hotels, setHotels] = useState([]);

  const fetchHotels = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/hotels`, {
        params: {
          checkin: format(new Date(checkin), 'yyyy-MM-dd'),
          checkout: format(new Date(checkout), 'yyyy-MM-dd'),
        }
      });
      setHotels(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <TextInput
        placeholder="Check-in date (YYYY-MM-DD)"
        value={checkin}
        onChangeText={setCheckin}
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />
      <TextInput
        placeholder="Check-out date (YYYY-MM-DD)"
        value={checkout}
        onChangeText={setCheckout}
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />
      <Button title="Search Hotels" onPress={fetchHotels} />
      <FlatList
        data={hotels}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text>{item.name}</Text>
            <Text>{item.location}</Text>
            <Text>{item.price}</Text>
          </View>
        )}
        style={{ marginTop: 20 }}
      />
    </SafeAreaView>
  );
};

export default App;
