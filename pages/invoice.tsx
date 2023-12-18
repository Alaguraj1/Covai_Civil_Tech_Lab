import { size } from 'lodash'
import React, { useState, useEffect } from 'react'
import { Space, Table, Modal, Flex } from 'antd';
import { Button, Drawer } from 'antd';
import { Checkbox, Form, Input, Select } from 'antd';
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
const Invoice = () => {

    const [open, setOpen] = useState(false);
    const { Search } = Input;
    const [form] = Form.useForm();
    const [editRecord, setEditRecord] = useState(null);
    const { TextArea } = Input;


    const [drawerTitle, setDrawerTitle] = useState("Create Tax");
    console.log("drawerTitle", drawerTitle)
    useEffect(() => {
        if (editRecord) {
            setDrawerTitle("Edit Tax");
        } else {
            setDrawerTitle("Create Tax");
        }
    }, [editRecord, open]);



    // drawer
    const showDrawer = (record: any) => {
        if (record) {
            setEditRecord(record);
            form.setFieldsValue(record); // Set form values for editing
        } else {
            setEditRecord(null); // Clear editRecord for create operation
            form.resetFields(); // Clear form fields for create operation
        }

        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
        form.resetFields()
    };


    // table
    const [dataSource, setDataSource] = useState(
        [
            {
                key: '1',
                invoiceId: 2322,
                customerName: "Nabl",
                projectName: 'Audit Widness Test 1',
                amount: 600
            },
            {
                key: '2',
                invoiceId: 2321,
                customerName: "Vsk",
                projectName: 'Audit Widness Test 2',
                amount: 1200
            },
            {
                key: '3',
                invoiceId: "Iffco",
                customerName: 15,
                projectName: 'Audit Widness Test 3',
                amount: 800
            },
            {
                key: '4',
                invoiceId: 2319,
                customerName: "Plumeria ",
                projectName: 'Audit Widness Test 4',
                amount: 1000
            },
            {
                key: '5',
                invoiceId: 2318,
                customerName: "Sri Eshwar",
                projectName: 'Audit Widness Test 5',
                amount: 600
            },
        ]
    )

    const columns = [
        {
            title: 'Invoice Id',
            dataIndex: 'invoiceId',
            key: 'invoiceId',
        },
        {
            title: 'Customer Name',
            dataIndex: 'customerName',
            key: 'customerName',
        },
        {
            title: 'Project Name',
            dataIndex: 'projectName',
            key: 'projectName',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: "Actions",
            key: "actions",
            render: (text: any, record: any) => (

                <Space size="middle">
                    <EditOutlined
                        style={{ cursor: "pointer" }}
                        onClick={() => showDrawer(record)}
                        className='edit-icon' rev={undefined} />
                    <DeleteOutlined
                        style={{ color: "red", cursor: "pointer" }}
                        onClick={() => handleDelete(record.key)} className='delete-icon' rev={undefined} />
                </Space>
            ),
        }
    ];




    // invoice drawer table data
    const dataSource2 = [
        {
            key: '1',
            name: 'Mike',
            age: 32,
            address: '10 Downing Street',
        },
        {
            key: '2',
            name: 'John',
            age: 42,
            address: '10 Downing Street',
        },
    ];

    const columns2 = [
        {
            title: 'Material Name',
            dataIndex: 'materialName',
            key: 'materialName',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Rate Per Sample',
            dataIndex: 'ratePerSample',
            key: 'address',
        },
        {
            title: "Action",
            key: "action",
            render: (records: any) => {
                return (
                    <>
                        <Space size="middle">
                            <EditOutlined
                                style={{ cursor: "pointer" }}
                                className='edit-icon' rev={undefined} />
                            <DeleteOutlined
                                style={{ color: "red", cursor: "pointer" }}
                               className='delete-icon' rev={undefined} />
                        </Space>
                    </>
                )
            }
        }
    ];

    const handleDelete = (record: any) => {
        // Implement your delete logic here
        console.log(`Delete record with key ${record}`);

        Modal.confirm({
            title: "Are you sure, you want to delete this TAX record?",
            okText: "Yes",
            okType: "danger",
            // onOk: () => {
            //   console.log(values, "values")
            //   axios.delete(`http://localhost:3000/api/employee/delete/${values._id}`).then((res) => {
            //     console.log(res)
            //     test()
            //   }).catch((err) => {
            //     console.log(err)
            //   })

            // },

            onOk: () => {
                dataSource.filter((value: any) => {
                    return (
                        record != value.id
                    )
                })
            }
        });
    };

    // input search
    const onSearch = (value: string, _e: any, info: any) => {
        const filteredData = dataSource.filter((item: any) =>
            item.taxName.toLowerCase().includes(value.toLowerCase())
        );

        setDataSource(filteredData);
    };


    // form submit
    const onFinish = (values: any) => {
        console.log('Success:', values);

        // Check if editing or creating
        if (editRecord) {
            // Implement your update logic here
            // ...

            // Clear editRecord state
            setEditRecord(null);
        } else {
            // Implement your create logic here
            // ...

            // Clear form fields
            form.resetFields();
        }
        // Close the drawer
        onClose();
    }
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    type FieldType = {
        discount?: string;
        advance?: string;
        balance?: string;
        customer?: string;
        beforeTax?: string;
        afterTax?: string;
    };

    return (
        <>
            <div>
                <div className='tax-heading-main'>
                    <div>
                        <h1 className='tax-title'>Manage Invoices</h1>
                    </div>
                    <div>
                        <Search placeholder="input search text" onSearch={onSearch} enterButton className='search-bar' />
                        <button type='button' onClick={() => showDrawer(null)} className='create-button'>+ Create Tax</button>
                    </div>
                </div>
                <div>
                    <Table dataSource={dataSource} columns={columns} pagination={false} />
                </div>

                <Drawer title={drawerTitle} placement="right" width={1200} onClose={onClose} open={open}>




                    <Form
                        name="basic-form"
                        layout="vertical"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <div style={{ border: "1px solid gray", padding: "20px" }}>
                            <p style={{ textAlign: "center", color: "blue", fontSize: "22px", fontWeight: "600", paddingBottom: "30px" }}>Invoice Number :<span style={{ color: "red" }}> 02322</span></p>
                            <div style={{ display: "Flex", justifyContent: "space-around" }}>
                                <div style={{ width: "500px" }}>
                                    <Form.Item<FieldType>
                                        label="Customer"
                                        name="customer"
                                        required={false}
                                        rules={[{ required: true, message: 'Please input your Tax Name!' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item<FieldType>
                                        label="Customer"
                                        name="customer"
                                        required={false}
                                        rules={[{ required: true, message: 'Please input your Tax Name!' }]}
                                    >
                                        <TextArea rows={4} />
                                    </Form.Item>
                                </div>
                                <div style={{ width: "500px" }}>

                                    <Form.Item label="Material ID" name='materialId'>
                                        <Select>
                                            <Select.Option value="id 1">ID 1</Select.Option>
                                            <Select.Option value="id 2">ID 2</Select.Option>
                                        </Select>
                                    </Form.Item>

                                    <Form.Item label="Material ID" name='materialId'>
                                        <Select>
                                            <Select.Option value="id 1">ID 1</Select.Option>
                                            <Select.Option value="id 2">ID 2</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </div>
                            </div>
                            <Form.Item >
                                <div style={{ textAlign: "center" }}>
                                    <Space>
                                        <Button type="primary" htmlType="submit">
                                            Save
                                        </Button>
                                        <Button htmlType="submit" style={{ borderColor: "blue", color: "blue" }}>
                                            Add Invoice Test
                                        </Button>
                                    </Space>
                                </div>
                            </Form.Item>
                        </div>
                    </Form>

                    <div style={{ paddingTop: "50px" }}>
                        <Table dataSource={dataSource2} columns={columns2} />
                    </div>

                    <Form
                        name="basic"
                        layout="vertical"
                        form={form}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item<FieldType>
                            label="Discount( % )"
                            name="discount"
                            required={false}
                            rules={[{ required: true, message: 'Please input your Tax Name!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Amount Before Tax"
                            name="beforeTax"
                            required={false}
                            rules={[{ required: true, message: 'Please input your Tax Percentage!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Amount After Tax"
                            name="afterTax"
                            required={false}
                            rules={[{ required: true, message: 'Please input your Tax Status!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Advance"
                            name="advance"
                            required={false}
                            rules={[{ required: true, message: 'Please input your Tax Status!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Balance"
                            name="balance"
                            required={false}
                            rules={[{ required: true, message: 'Please input your Tax Status!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item >
                            <div className='form-btn-main'>
                                <Space>
                                    <Button danger htmlType="submit" onClick={() => onClose()}>
                                        cancel
                                    </Button>
                                    <Button type="primary" htmlType="submit">
                                        Submit
                                    </Button>
                                </Space>

                            </div>

                        </Form.Item>
                    </Form>
                </Drawer>

            </div>
        </>
    )
}

export default Invoice