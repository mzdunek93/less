import React, { useEffect, useState } from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { SvgXml } from 'react-native-svg'

interface ChartProps {
  id: string
  time: string
}

const Chart = ({ id, time }: ChartProps) => {
  const [xml, setXml] = useState<string | null>(null)

  useEffect(() => {
    const fetchXml = async () => {
      if (id) {
        setXml(null)
        const uri = `https://graphs2.coinpaprika.com/currency/chart/${id}/${time}/chart.svg`
        const response = await fetch(uri).then((res) => res.text())
        setXml(response.replace('#0074d9', '#edb211').replace('#5085ec', '#ffce47'))
      }
    }
    fetchXml()
  }, [id, time])

  return (
    <View style={styles.container}>
      {xml ? <SvgXml xml={xml} /> : <ActivityIndicator size="small" />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 25
  }
})

export default Chart
