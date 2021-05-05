import { render, screen, act } from '@testing-library/react';
import { useSortableData } from './App.js';

const sampleData = [
  {
      "orderNumber": 100000,
      "customerName": "John Doe",
      "customerAddress": "123 Main Street  , Boston MA ",
      "orderValue": 137.11,
      "orderDate": "2021-02-01T00:00:00.000Z",
      "shipDate": "2021-02-03T00:00:00.000Z",
      "status": "open"
  },
  {
      "orderNumber": 100005,
      "customerName": "Mary Smith",
      "customerAddress": "555 Broadway  , New York NY ",
      "orderValue": 157.12,
      "orderDate": "2021-03-01T00:00:00.000Z",
      "shipDate": "2021-03-03T00:00:00.000Z",
      "status": "shipped"
  },
  {
      "orderNumber": 1000101,
      "customerName": "Dakota Finley",
      "customerAddress": "999 South Bend Road  , Charleston MSC ",
      "orderValue": 98.99,
      "orderDate": "2021-01-10T00:00:00.000Z",
      "shipDate": "2021-01-13T00:00:00.000Z",
      "status": "cancelled"
  }
];

function setup(...args) {
  const returnVal = {}
  function TestComponent() {
    Object.assign(returnVal, useSortableData(...args))
    return null
  }
  render(<TestComponent />)
  return returnVal
}


test('test useSortableData custom hook', () => {
  const { items } = setup(sampleData, {key: 'orderNumber', direction: 'descending' });
  expect(items[0].orderNumber).toBe(1000101);
})