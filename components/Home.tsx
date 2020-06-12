import React, { useEffect, useState, useMemo, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableNativeFeedback,
  TouchableHighlight,
  Platform
} from 'react-native'
import { Picker } from '@react-native-community/picker'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import CoinpaprikaAPI from '@coinpaprika/api-nodejs-client'

import Chart from './Chart'

type Currency = 'USD' | 'EUR' | 'GBP' | 'PLN' | 'BTC'

interface Quote {
  price: number
}

interface CoinData {
  id: string
  name: string
  symbol: string
  rank: number
  quotes: {
    [x in Currency]: Quote
  }
}

type SortKey = Exclude<keyof CoinData, 'quotes' | 'symbol' | 'id'> | 'price'

function compare<T>(a: T, b: T) {
  return a > b ? 1 : a === b ? 0 : -1
}

const coinpaprika = new CoinpaprikaAPI()

const black = '#000000'

const Touchable = (Platform.OS === 'ios'
  ? TouchableHighlight
  : TouchableNativeFeedback) as typeof TouchableHighlight & typeof TouchableNativeFeedback

const Home = () => {
  const [data, setData] = useState<[CoinData] | null>(null)
  const [loading, setLoading] = useState(false)
  const [currency, setCurrency] = useState<Currency>('USD')
  const [sort, setSort] = useState<SortKey>('rank')
  const [sortAsc, setSortAsc] = useState(true)
  const [time, setTime] = useState('7d')

  const getData = useCallback(async () => {
    setLoading(true)
    const response = await coinpaprika.getAllTickers({
      quotes: ['USD', 'EUR', 'GBP', 'PLN', 'BTC']
    })
    setData(response)
    setLoading(false)
  }, [])

  useEffect(() => {
    getData()
  }, [getData])

  const sortedData = useMemo(
    () =>
      data
        ?.map(({ quotes, ...coin }) => ({ price: quotes[currency].price, ...coin }))
        .sort((a, b) => compare((sortAsc ? a : b)[sort], (sortAsc ? b : a)[sort])),
    [currency, data, sort, sortAsc]
  )

  const changeSort = useCallback(
    (clickedSort: SortKey) => () => {
      if (sort === clickedSort) {
        setSortAsc(!sortAsc)
      } else {
        setSort(clickedSort)
      }
    },
    [sort, sortAsc]
  )

  return (
    <FlatList
      data={sortedData}
      refreshing={loading}
      onRefresh={getData}
      style={styles.container}
      ListHeaderComponent={() => (
        <>
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, styles.largeCell]}>
              <Text>Currency</Text>
              <Picker
                selectedValue={currency}
                style={styles.picker}
                onValueChange={(itemValue) => setCurrency(itemValue as Currency)}
              >
                <Picker.Item label="USD" value="USD" />
                <Picker.Item label="EUR" value="EUR" />
                <Picker.Item label="GBP" value="GBP" />
                <Picker.Item label="PLN" value="PLN" />
                <Picker.Item label="BTC" value="BTC" />
              </Picker>
            </View>
            <View style={[styles.tableCell, styles.largeCell]}>
              <Text>Chart period</Text>
              <Picker
                selectedValue={time}
                style={styles.picker}
                onValueChange={(itemValue) => setTime(String(itemValue))}
              >
                <Picker.Item label="24h" value="24h" />
                <Picker.Item label="7d" value="7d" />
                <Picker.Item label="30d" value="30d" />
              </Picker>
            </View>
          </View>
          <View style={styles.tableRow}>
            <Touchable onPress={changeSort('rank')}>
              <View style={[styles.tableCell, styles.smallCell]}>
                <Text>#</Text>
                {sort === 'rank' && (
                  <MaterialIcons
                    size={20}
                    name={sortAsc ? 'keyboard-arrow-down' : 'keyboard-arrow-up'}
                  />
                )}
              </View>
            </Touchable>
            <Touchable onPress={changeSort('name')}>
              <View style={[styles.tableCell, styles.largeCell]}>
                <Text>Name</Text>
                {sort === 'name' && (
                  <MaterialIcons
                    size={20}
                    name={sortAsc ? 'keyboard-arrow-down' : 'keyboard-arrow-up'}
                  />
                )}
              </View>
            </Touchable>
            <Touchable onPress={changeSort('price')}>
              <View style={[styles.tableCell, styles.largeCell]}>
                <Text>Price</Text>
                {sort === 'price' && (
                  <MaterialIcons
                    size={20}
                    name={sortAsc ? 'keyboard-arrow-down' : 'keyboard-arrow-up'}
                  />
                )}
              </View>
            </Touchable>
            <View style={[styles.tableCell, styles.largeCell]}>
              <Text>Chart</Text>
            </View>
          </View>
        </>
      )}
      renderItem={({ item: { id, name, rank, price } }) => (
        <View style={styles.tableRow}>
          <View style={[styles.tableCell, styles.smallCell]}>
            <Text>{rank}</Text>
          </View>
          <View style={[styles.tableCell, styles.largeCell]}>
            <Text>{name}</Text>
          </View>
          <View style={[styles.tableCell, styles.largeCell]}>
            <Text>{price}</Text>
          </View>
          <View style={[styles.tableCell, styles.largeCell]}>
            <Chart id={id} time={time} />
          </View>
        </View>
      )}
      extraData={{ time }}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  largeCell: {
    flexBasis: 2,
    flexGrow: 2
  },
  picker: {
    width: 100
  },
  smallCell: {
    flexBasis: 1,
    flexGrow: 1
  },
  tableCell: {
    alignItems: 'center',
    flexBasis: 1,
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  tableRow: {
    borderColor: black,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row'
  }
})

export default Home
