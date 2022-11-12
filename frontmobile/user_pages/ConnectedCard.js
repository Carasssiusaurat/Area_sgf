import React, { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { View, Text, Button, Image, StyleSheet, TextInput,
  TouchableOpacity, SafeAreaView, ScrollView} from "react-native";
const ConnectedCard = ({ name, img_url, id }) => {
  const DisableService = async () => {
    const res = await fetch(
      "http://localhost:8080/user/" +
        await AsyncStorage.getItem("id") +
        "/service/" +
        id,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + await AsyncStorage.getItem("token"),
        },
      }
    );
  };
  return (
     <View style = {{width : '80%', height : 200, borderRadius : 30, backgroundColor : 'rgba(0, 0, 0, 0.74)', marginTop : 50, marginLeft: 'auto', marginRight : 'auto'}}>  
       <View style = {{width : '100%', marginLeft : 'auto', marginRight : 'auto', backgroundColor : 'grey', height : 50, borderRadius : 10, flexDirection : 'row', justifyContent : 'space-between' }}>
       <Text style = {{color : 'white', fontWeight : 'bold', marginLeft : 10, fontSize : 30, marginTop : 2}}>{name}</Text>
       <Image source={{uri : img_url}} style = {{width : 30, height : 30, marginRight : 20, marginTop : 2}}></Image>
       </View>
       <TouchableOpacity style = {{width : '50%', height : '30%', backgroundColor : 'grey', borderRadius : 10, marginLeft : 150, marginTop : 20}} onPress={DisableService}>
       <Text style = {{fontSize : 30, fontWeight : "bold", textAlign : 'center', marginTop:'auto', marginBottom : 'auto'}}>Disable</Text>
       </TouchableOpacity>
     </View>
    
  );
};

export default ConnectedCard;
