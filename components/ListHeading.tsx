import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

// const ListHeading = ({ title }: { title: string}) => { // already provided types of all in ListHeading Props
const ListHeading = ({ title }: ListHeadingProps) => {
  return (
    <View className='list-head'>
      <Text className='list-title'>{title}</Text>

        {/* button */}
      <TouchableOpacity className='list-action' >
        <Text className='list-action-text'>View all</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ListHeading