import React from 'react';
import axios from 'axios';
import moment from 'moment';
import { keysToCamel, buildName, buildAddress, currency  } from './utils';
import './App.css';


export const useSortableData = (items, config = null) => {
  const [sortConfig, setSortConfig] = React.useState(config);

  const sortedItems = React.useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};

const OrderTable = (props) => {
  const { items, requestSort, sortConfig } = useSortableData(props.orders, {key: 'orderValue', direction: 'descending'});
  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };
  return (
    <table>
      <caption>Orders</caption>
      <thead>
        <tr>
          <th>
            <button
              type="button"
              onClick={() => requestSort('orderNumber')}
              className={getClassNamesFor('orderNumber')}
            >
              Order Number
            </button>
          </th>
          <th>
            <button
              type="button"
              onClick={() => requestSort('customerName')}
              className={getClassNamesFor('customerName')}
            >
              Customer Name
            </button>
          </th>
          <th>
            <button
              type="button"
              onClick={() => requestSort('customerAddress')}
              className={getClassNamesFor('customerAddress')}
            >
              Customer Address
            </button>
          </th>
          <th>
            <button
              type="button"
              onClick={() => requestSort('orderValue')}
              className={getClassNamesFor('orderValue')}
            >
              Order Value
            </button>
          </th>
          <th>
            <button
              type="button"
              onClick={() => requestSort('orderDate')}
              className={getClassNamesFor('orderDate')}
            >
              Order Date
            </button>
          </th>
          <th>
            <button
              type="button"
              onClick={() => requestSort('shipDate')}
              className={getClassNamesFor('shipDate')}
            >
              Ship Date
            </button>
          </th>
          <th>
            <button
              type="button"
              onClick={() => requestSort('status')}
              className={getClassNamesFor('status')}
            >
              Status
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.orderNumber}>
            <td>{item.orderNumber}</td>
            <td>{item.customerName}</td>
            <td>{item.customerAddress}</td>
            <td>{currency(item.orderValue)}</td>
            <td>{moment(item.orderDate).format('YYYY-MM-DD')}</td>
            <td>{moment(item.shipDate).format('YYYY-MM-DD')}</td>
            <td>{item.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const normalizeOrders = (orders) => {
  return orders.map(order => ({
    orderNumber: order.orderNumber,
    customerName: buildName(order.customer),
    customerAddress: buildAddress(order.customer.address),
    orderValue: order.orderDetails.value,
    orderDate: new Date(order.orderDetails.date),
    shipDate: new Date(order.shippingDetails.date),
    status: order.status
  }))
}

export default function App() {
  const [orders, setOrders] = React.useState([]);

  React.useEffect(() => {
    axios
      .get('https://gist.githubusercontent.com/ryanjn/07512cb1c008a5ec754aea6cbbf4afab/raw/eabb4d324270cf0d3d17a79ffb00ff3cfaf9acc3/orders.json')
      .then(response => {
        const orders = keysToCamel(response.data);
        setOrders(normalizeOrders(orders));
      }).catch(err => {
        console.error(err);
      })
  }, []);

  return (
    <div className="App">
      <OrderTable
        orders={orders}
      />
    </div>
  );
}
