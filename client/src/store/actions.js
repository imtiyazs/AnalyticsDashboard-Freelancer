import * as types from './mutation-types'

export const increment = ({ commit }) => commit(types.STORE_INCREMENT)
export const decrement = ({ commit }) => commit(types.STORE_DECREMENT)
