import { View, Text } from 'react-native'
import { Link, useLocalSearchParams } from 'expo-router'

const subscriptionDetails = () => {

  const  { id } = useLocalSearchParams<{id: string}>();
  
  return (
    <View>
      <Text>subscription Details: {id}</Text>
      <Link href="/">Go Back</Link>
    </View>
  )
}

export default subscriptionDetails