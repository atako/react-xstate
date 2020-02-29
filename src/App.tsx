import React from 'react';
import logo from './logo.svg';
import "./App.css"
import { PageHeader, Button, Descriptions } from 'antd';

const App = () => <PageHeader
  ghost={false}
  title="Get data"
  extra={[
    <Button key="1" type="primary">
      Fetch
  </Button>,
  ]}
></PageHeader>

export default App;
