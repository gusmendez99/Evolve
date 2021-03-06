import omit from 'lodash/omit';
import forEach from 'lodash/forEach';
import toArray from 'lodash/toArray';
import sum from 'lodash/sum';


import { combineReducers } from 'redux';

import * as types from './cart.types';


const byId = (state = {}, action) => {
    switch(action.type) {
      case types.TRACK_ADDED_TO_CART: {
        return {...state, [action.payload.trackid]: {...action.payload}};
      }
      case types.TRACK_REMOVED_FROM_CART: {
        return omit(state, action.payload.trackid);
      }
      case types.TRACK_QUANTITY_MODIFIED: {
				return {
					...state, [action.payload.trackid]: {...state[action.payload.trackid], ['quantity']: action.payload.quantity}
				};
      }
      case types.CHECKOUT_COMPLETED: {
				return {};
      }
      case types.CHECKOUT_SIMULATION_COMPLETED: {
        return {};
      }
      default: {
        return state;
      }
    }
};

const isExecuting = (state = false, action) => {
    switch(action.type) {
      case types.CHECKOUT_STARTED: {
        return true;
      }
      case types.CHECKOUT_FAILED: {
        return false;
      }
      case types.CHECKOUT_COMPLETED: {
        return false;
      }
      case types.CHECKOUT_SIMULATION_COMPLETED: {
        return false;
      }
      default: {
        return state;
      }
    }
};
const error = (state = null, action) => {
    switch(action.type) {
      case types.CHECKOUT_FAILED: {
        return action.payload.error;
      }
      case types.CHECKOUT_STARTED: {
        return null;
      }
      case types.CHECKOUT_COMPLETED: {
        return null;
      }
      default: {
        return state;
      }
    }
};

const invoiceLinesStatusCode = (state = null, action) => {
  switch(action.type) {
    case types.UPLOAD_INVOICELINE_STARTED: {
      return null;
    }
    case types.UPLOAD_INVOICELINE_COMPLETED: {
      return action.payload;
    }
    case types.UPLOAD_INVOICELINE_FAILED: {
      return null;
    }
    case types.UPLOAD_SIMULATED_INVOICE_LINE_STARTED: {
      return null;
    }
    case types.UPLOAD_SIMULATED_INVOICE_LINE_COMPLETED: {
      return action.payload
    }
    case types.UPLOAD_SIMULATED_INVOICE_LINE_FAILED: {
      return null
    }
    default: {
      return state;
    }
  }
};


export default combineReducers({
  byId,
  isExecuting,
  error,
  invoiceLinesStatusCode
})

export const getCartTrack = (state, id) => state.byId[id];
export const getCartTracks = (state) =>  Object.values((state.byId));
export const isExecutingCheckout = (state) => state.isExecuting;
export const getCheckoutError = (state) => state.error;
export const getInvoiceLinesStatusCode = (state) => state.invoiceLinesStatusCode;
export function getTotalPriceInvoice(state){
  let x = 0;
  const subTotal = forEach(state.byId, (value) =>
    x += parseFloat(value.unitprice) * value.quantity 
  );
  return x;
}

