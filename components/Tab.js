import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from '../screens/HomeScreen'
import ActivityScreen from '../screens/ActivityScreen'
import Home from '../screens/Home'
import CreatePostScreen from '../screens/CreatePost'
import UserLogsScreen from "../screens/UserLogsScreen";
import { TouchableOpacity, View } from "react-native";
import {
  HomeIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  PlusCircleIcon,
  UserIcon

} from "react-native-heroicons/solid";

import HealthKit from "./HealthKit";


const Tab = createBottomTabNavigator()

const tabBarStyles = {
  position: 'absolute',
  bottom: '0',
  left: '0',
  right: '0',
  top: '0',
  elevation: '0',
  height: 10,
  backgroundColor: 'black'

}
function MyTabs({ navigation }) {

  return (
    <Tab.Navigator initialRouteName="Home" screenOptions={{
      tabBarShowLabel: false, headerShown: false, height: 60,
      tabBarStyle: {
        backgroundColor: '#FFF',
        height: 90,
        borderTopWidth: 0,
      }
    }}>

      {/* <Tab.Screen name="Post" component={CreatePostScreen} options={{
        headerShown: false, tabBarIcon: ({ focused }) => {
          return (
            <View>
              <PlusCircleIcon name="homeIcon" size={30} color={focused ? '#3d3dac' : '#e5e5e5'} />
            </View>
          )
        }
      }} /> */}

      <Tab.Screen name="UserLogs" component={UserLogsScreen} options={{
        headerShown: false, tabBarIcon: ({ focused }) => {
          return (
            <TouchableOpacity onPress={async () => { const { sleepData } = await HealthKit(); navigation.navigate('UserLogs', { userLogs: sleepData }) }}>
              <UserIcon name="UserIcon" size={30} color={focused ? '#3d3dac' : '#e5e5e5'} />
            </TouchableOpacity>
          )
        }
      }} />
      <Tab.Screen name="Home" style={{ justifyContent: 'center', alignItems: 'center' }} component={Home} options={{
        headerShown: false,
        tabBarIcon: ({ focused }) => {
          return (
            <View>
              <HomeIcon name="homeIcon" size={30} color={focused ? '#3d3dac' : '#e5e5e5'} />
            </View>
          )
        }
      }} />
      <Tab.Screen name="Messages" component={ActivityScreen} options={{
        headerShown: false,
        tabBarIcon: ({ focused }) => {
          return (
            <View>
              <ChatBubbleOvalLeftEllipsisIcon name="messageIcon" size={30} color={focused ? '#3d3dac' : '#e5e5e5'} />
            </View>
          )
        }
      }} />
    </Tab.Navigator>
  );
}

export default MyTabs


