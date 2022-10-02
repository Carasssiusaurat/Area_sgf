/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import { View, Text, Button, Image, StyleSheet, TextInput} from "react-native";
import React from 'react';
import BouncyCheckbox from "react-native-bouncy-checkbox";


export default class Login extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      email : "",
      password : "",
    };
    this.Inputs = this.Inputs.bind(this);
  }
  
  Inputs = (props) => {
    return(
      <View>
        <Text style = {{marginLeft : 40, color : "white"}}>{props.name}</Text>
        <TextInput style={styles.input_style} onChangeText = {(text) =>
        props.name = "Email" ?  this.setState({email : text}) : this.setState({password : text})}></TextInput>
      </View>
    );
  }

  render(){
    return(
      <View style = {{backgroundColor : 'rgba(125, 19, 191, 1)', height : '100%'}}>
          <Image style={[styles.center_image, {marginTop : 60}]} source={require('./assets/Logo.png')}></Image>
          <this.Inputs name="Email"/>
          <this.Inputs name="Password"/>
          <View style = {{ flexDirection : "row"}}>
          <BouncyCheckbox style = {{marginLeft : 30}} iconStyle = {styles.Check_box_style} fillColor = 'rgba(0, 0, 0, 0)' onPress={() => {}} />
          <Text style = {{color : "white"}}>Remember me ?</Text>
          </View>
          {/* EN CHANTIER */}
      </View>
      
      
      
      );
  }
}

const styles = StyleSheet.create({

  center_image : {
    marginLeft : "auto", 
    marginRight : "auto"
  },
  input_style : {
    height: 50, 
    margin: 12, 
    borderWidth: 1, 
    padding: 10, 
    backgroundColor : 'rgba(180, 179, 179, 1)', 
    borderRadius : 15, 
    width : "80%",
    marginLeft : "auto",
    marginRight : "auto"
  },
  Check_box_style : {
    backgroundColor : "black", 
    borderRadius : 0, 
    borderColor : "black", 
    width : 20, 
    height : 20
  }



});
