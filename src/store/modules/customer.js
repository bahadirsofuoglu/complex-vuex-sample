import { createHelpers } from 'vuex-map-fields'

// The API util is used to send the
// data the user enters to our server.
import api from '../../utils/api'

// Models are used to prepare
// store data to be sent to an API.
import { createCustomer } from '../../models/Customer'
import { createRequest } from '../../models/Request'

import { SUBMIT } from '../action-types'
import { ERROR, SUCCESS } from '../mutation-types'

// We're using reusable form modules
// to store the data of our forms.
import address from './forms/address'
import contact from './forms/contact'
import name from './forms/name'

const actions = {
  async [SUBMIT]({ commit, state }) {
    try {
      const customerData = createCustomer({
        address: state.address.rows[0],

        contacts: state.contact.rows,
        name: state.name.rows[0]
      })
      const requestData = createRequest(customerData)

      await api(requestData)

      commit(SUCCESS)
    } catch (error) {
      commit(ERROR, error.message)
    }
  }
}

const mutations = {
  [ERROR](state, error) {
    state.error = error

    state.success = false
  },
  [SUCCESS](state) {
    state.error = false

    state.success = true
  }
}

const state = () => ({
  error: false,
  success: false
})

const modules = {
  address,
  contact,
  name
}

export const { mapFields: mapAddressFields } = createHelpers({
  getterType: `customer/address/getField`,
  mutationType: `customer/address/updateField`
})

export const { mapMultiRowFields: mapContactMultiRowFields } = createHelpers({
  getterType: `customer/contact/getField`,
  mutationType: `customer/contact/updateField`
})

export const { mapFields: mapNameFields } = createHelpers({
  getterType: `customer/name/getField`,
  mutationType: `customer/name/updateField`
})

export const customer = {
  namespaced: true,
  actions,
  mutations,
  state,
  modules
}
