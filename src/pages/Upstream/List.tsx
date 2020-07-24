import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import { Popconfirm, Button, notification, Input } from 'antd';
import { history } from 'umi';
import { useIntl } from 'umi';
import moment from 'moment';

import { fetchList, remove } from './service';

const Page: React.FC = () => {
  const ref = useRef<ActionType>();

  const [search, setSearch] = useState('');
  const { formatMessage } = useIntl();

  const columns: ProColumns<UpstreamModule.ResEntity>[] = [
    {
      title: formatMessage({ id: 'upstream.list.name' }),
      dataIndex: 'name',
    },
    {
      title: formatMessage({ id: 'upstream.list.type' }),
      dataIndex: 'type',
    },
    {
      title: formatMessage({ id: 'upstream.list.description' }),
      dataIndex: 'description',
    },
    {
      title: formatMessage({ id: 'upstream.list.edit.time' }),
      dataIndex: 'update_time',
      render: (text) => `${moment.unix(Number(text)).format('YYYY-MM-DD HH:mm:ss')}`,
    },
    {
      title: formatMessage({ id: 'upstream.list.operation' }),
      valueType: 'option',
      render: (_, record) => (
        <>
          <Button
            type="primary"
            style={{ marginRight: 10 }}
            onClick={() => history.push(`/upstream/${record.id}/edit`)}
          >
            {formatMessage({ id: 'upstream.list.edit' })}
          </Button>
          <Popconfirm
            title={formatMessage({ id: 'upstream.list.confirm.delete' })}
            okText={formatMessage({ id: 'upstream.list.confirm' })}
            cancelText={formatMessage({ id: 'upstream.list.cancel' })}
            onConfirm={() => {
              remove(record.id!).then(() => {
                notification.success({
                  message: formatMessage({ id: 'upstream.list.delete.successfully' }),
                });
                /* eslint-disable no-unused-expressions */
                ref.current?.reload();
              });
            }}
          >
            <Button type="primary" danger>
              {formatMessage({ id: 'upstream.list.delete' })}
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <PageContainer title={formatMessage({ id: 'upstream.list' })}>
      <ProTable<UpstreamModule.ResEntity>
        actionRef={ref}
        columns={columns}
        rowKey="id"
        search={false}
        request={(params) => fetchList(params, search)}
        toolBarRender={(action) => [
          <Input.Search
            placeholder={formatMessage({ id: 'upstream.list.input' })}
            onSearch={(value) => {
              setSearch(value);
              action.setPageInfo({ page: 1 });
              action.reload();
            }}
          />,
          <Button type="primary" onClick={() => history.push('/upstream/create')}>
            <PlusOutlined />
            {formatMessage({ id: 'upstream.list.create' })}
          </Button>
        ]}
      />
    </PageContainer>
  );
};

export default Page;
