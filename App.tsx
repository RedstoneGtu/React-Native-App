import React, {useState , useEffect} from 'react';
import axios from 'axios';
import {
  TouchableOpacity,
  Button,
  PermissionsAndroid,
  View,
  Text,
  TextInput,
  Image,
} from 'react-native';

import base64 from 'react-native-base64';

import CheckBox from '@react-native-community/checkbox';

import {BleManager, Device} from 'react-native-ble-plx';
import {styles} from './Styles/styles';
import {LogBox} from 'react-native';

var Sound = require('react-native-sound');

Sound.setCategory('Playback');


var ding = new Sound('test.mp3', Sound.MAIN_BUNDLE, (error) => {
if (error) {
    console.log('failed to load the sound', error);
    return;
  }

  // if loaded successfully
  console.log('duration in seconds: ' + ding.getDuration() + 'number of channels: ' + ding.getNumberOfChannels());

});

LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

const BLTManager = new BleManager();
var RNFS = require('react-native-fs');

var path = RNFS.DocumentDirectoryPath + '/test.txt';

const SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';

const MESSAGE_UUID = '89659080-bfcf-11ec-9d64-0242ac120002';
const MESSAGE_UUID1 = '8965938c-bfcf-11ec-9d64-0242ac120002';
const MESSAGE_UUID2 = '89659508-bfcf-11ec-9d64-0242ac120002';
const MESSAGE_UUID3 = '89659652-bfcf-11ec-9d64-0242ac120002';
function StringToBool(input: String) {
  if (input == '1') {
    return true;
  } else {
    return false;
  }
}

function BoolToString(input: boolean) {
  if (input == true) {
    return '1';
  } else {
    return '0';
  }
}

export default function App() {
  //Is a device connected?
  const [isConnected, setIsConnected] = useState(false);
  const [connectText, setConnect] = useState("SELAMUN ALEYKUM");
  const [con , setCon] = useState(false);
  //What device is connected?
  const [connectedDevice, setConnectedDevice] = useState<Device>();
  let stringOFText = "";
  let arr1 = [];
  let min1 = 66666;
  let max1 = 0;
  let arr2 = [];
  let min2 = 66666;
  let max2 = 0;
  let arr3 = [];
  let min3 = 66666;
  let max3 = 0;
  let arr4 = [];
  let min4 = 66666;
  let max4 = 0;
  let norm1 = [];
  let norm2 = [];
  let norm3 = [];
  let norm4 = [];

  const [message, setMessage] = useState('Nothing Yet');
  const [search, setSearch] = useState('0');
  const [message1, setMessage1] = useState('Nothing Yet');
  const [message2, setMessage2] = useState('Nothing Yet');
  const [message3, setMessage3] = useState('Nothing Yet');
  const [boxvalue, setBoxValue] = useState(false);
  const [messageTest, setmessageTest] = useState('Nothing Yettt');

  const [ch0, setch0] = useState(true);
  const [ch1, setch1] = useState(false);
  const [ch2, setch2] = useState(false);
  const [ch3, setch3] = useState(false);
  const [ch4, setch4] = useState(false);
  const [ch5, setch5] = useState(false);
  const [ch6, setch6] = useState(false);

  useEffect(() => {
    ding.setVolume(1);
    return () => {
      ding.release();
    };
  }, []);

  const playPause = () => {
    ding.play(success => {
      if (success) {
        alert('successfully finished playing');

        if(ch0){
          axios.post('https://redstone-gtu.herokuapp.com/sendvalue', {
            base64: arr1,
            result:[ch1,ch2,ch3,ch4,ch5,ch6]
          })
          .then(function (response) {
            alert(response);
          })
          .catch(function (error) {
            alert(error);
          });
        }
        else{
          axios.post('https://redstone-gtu.herokuapp.com/sendvalue', {
            base64: arr1
          })
          .then(function (response) {
            alert(response);
          })
          .catch(function (error) {
            alert(error);
          });
        }



      } else {
        alert('playback failed due to audio decoding errors');
      }
    });
  };

  // Scans availbale BLT Devices and then call connectDevice
  async function scanDevices() {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Permission Localisation Bluetooth',
        message: 'Requirement for Bluetooth',
        buttonNeutral: 'Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    ).then(answere => {
      console.log('scanning');
      setConnect("scanning");
      // display the Activityindicator

      BLTManager.startDeviceScan(null, null, (error, scannedDevice) => {
        if (error) {
          console.warn(error);
          setConnect(error.message);
        }

        if (scannedDevice && scannedDevice.name == 'Group 2 RedStone') {
          BLTManager.stopDeviceScan();
          setConnect("YEHOOOOOOOOOOO");
          setCon(setCon);
            connectDevice(scannedDevice);


        }
      });

      // stop scanning devices after 5 seconds
      setTimeout(() => {
        BLTManager.stopDeviceScan();
        setConnect("Could not find");
      }, 5000);
    });
  }

  // handle the device disconnection (poorly)
  async function disconnectDevice() {
    console.log('Disconnecting start');
    setConnect("Disconnecting Start");
    if (connectedDevice != null) {
      const isDeviceConnected = await connectedDevice.isConnected();
      if (isDeviceConnected) {
        BLTManager.cancelTransaction('messagetransaction');
        BLTManager.cancelTransaction('nightmodetransaction');

        BLTManager.cancelDeviceConnection(connectedDevice.id).then(() =>

          setConnect("DC Completed"),
        );
      }

      const connectionStatus = await connectedDevice.isConnected();
      if (!connectionStatus) {
        setIsConnected(false);
      }
    }
  }




  async function connectDevice(device: Device) {
    console.log('connecting to Device:', device.name);
      device
        .connect()
        .then(device => {
          setConnectedDevice(device);
          setIsConnected(true);
          return device.discoverAllServicesAndCharacteristics();
        })
        .then(device => {
          //  Set what to do when DC is detected
          BLTManager.onDeviceDisconnected(device.id, (error, device) => {
            console.log('Device DC');
            // write the file
            RNFS.writeFile(path, stringOFText, 'utf8')
              .then((success) => {
                console.log('FILE WRITTEN!');
                setmessageTest(path);
              })
              .catch((err) => {
                console.log(err.message);
                setmessageTest(err.message);
              });




              if(ch0){
                axios.post('https://redstone-gtu.herokuapp.com/sendvalue', {
                  base64: arr1,
                  result:[ch1,ch2,ch3,ch4,ch5,ch6]
                })
                .then(function (response) {
                  alert(response);
                })
                .catch(function (error) {
                  alert(error);
                });
              }
              else{
                axios.post('https://redstone-gtu.herokuapp.com/sendvalue', {
                  base64: arr1
                })
                .then(function (response) {
                  alert(response);
                })
                .catch(function (error) {
                  alert(error);
                });
              }


            setConnect("Device DC");
            setIsConnected(false);
          });

          let sess = 0;
          playPause();
          setInterval(function () {
            //Read inital values
              device
                .readCharacteristicForService(SERVICE_UUID, MESSAGE_UUID)
                .then(valenc => {
                  let number = valenc?.value;
                  let num = number;

                  arr1.push(num);
                  setMessage(num);

                  setConnect(valenc?.value);
                });

        }, 5);




            //Message
            device.monitorCharacteristicForService(
              SERVICE_UUID,
              MESSAGE_UUID,
              (error, characteristic) => {
                setConnect("Message Update receiveddasdsadsadas");
                if (characteristic?.value != null) {
                  setMessage(base64.decode(characteristic?.value));
                  console.log(
                    'Message update received: ',
                    base64.decode(characteristic?.value),
                  );
                  setConnect("Message Update received",base64.decode(characteristic?.value));
                }
              },
              'messagetransaction',
            );



          console.log('Connection established');
          setConnect("Connection established");
        });

  }

  return (
    <View>

    <Image source={{uri: 'https://kocaeliuod.org.tr/dosya/sponsor/370x370/gebze-teknik-universitesi.png'}}
     style={{width: 300, height: 300}} />

      <View style={{paddingBottom: 10}}></View>

      {/* Title */}
      <View style={styles.rowView}>
        <Text style={styles.titleText}>BLE Example</Text>
      </View>

      <View style={{paddingBottom: 20}}></View>

      {/* Connect Button */}
      <View style={styles.rowView}>
        <TouchableOpacity style={{width: 120}}>
          {!isConnected ? (
            <Button
              title="Connect"
              onPress={() => {
                scanDevices();
              }}
              disabled={false}
            />
          ) : (
            <Button
              title="Disonnect"
              onPress={() => {
                disconnectDevice();
              }}
              disabled={false}
            />
          )}
        </TouchableOpacity>
      </View>


      <Text style={styles.baseText}>{connectText}</Text>

      <View style={{paddingBottom: 20}}></View>

      {/* Monitored Value */}

      <View style={styles.rowView}>
        <Text style={styles.baseText}>{message}</Text>

      </View>

      <View style={{paddingBottom: 20}}></View>

      <View style={styles.checkboxContainer}>
       <CheckBox
         value={ch0}
         onValueChange={setch0}
         style={styles.checkbox}
       />
       <Text style={styles.label}>is it test?</Text>
     </View>

     {
       ch0 ?

       <View>
         <View style={styles.checkboxContainer}>
          <CheckBox
            value={ch1}
            onValueChange={setch1}
            style={styles.checkbox}
          />
          <Text style={styles.label}>Classic</Text>
         </View>

         <View style={styles.checkboxContainer}>
          <CheckBox
            value={ch2}
            onValueChange={setch2}
            style={styles.checkbox}
          />
          <Text style={styles.label}>Electro</Text>
        </View>

        <View style={styles.checkboxContainer}>
           <CheckBox
             value={ch3}
             onValueChange={setch3}
             style={styles.checkbox}
           />
           <Text style={styles.label}>Jazz</Text>
         </View>

         <View style={styles.checkboxContainer}>
          <CheckBox
            value={ch4}
            onValueChange={setch4}
            style={styles.checkbox}
          />
          <Text style={styles.label}>Rock</Text>
        </View>

        <View style={styles.checkboxContainer}>
         <CheckBox
           value={ch5}
           onValueChange={setch5}
           style={styles.checkbox}
         />
         <Text style={styles.label}>Pop</Text>
       </View>

       <View style={styles.checkboxContainer}>
          <CheckBox
            value={ch6}
            onValueChange={setch6}
            style={styles.checkbox}
          />
          <Text style={styles.label}>Hiphop</Text>
        </View>



       </View>
       :
       <View>

       </View>
     }




    </View>
  );
}



/*

<View style={styles.rowView}>
  <TouchableOpacity style={{width: 120}}>
      <Button
        title="search"
        onPress={() => {
          readDatas(connectedDevice,MESSAGE_UUID1);
        }}
        disabled={false}
      />
  </TouchableOpacity>
</View>

*/
