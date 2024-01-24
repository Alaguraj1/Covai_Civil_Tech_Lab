import { size } from 'lodash'
import React, { useState, useEffect } from 'react'
import { Space, Table, Modal, Flex } from 'antd';
import { Button, Drawer } from 'antd';
import { Form, Input, Select } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import axios from "axios"
import Link from 'next/link';

const Invoice = () => {

    const [open, setOpen] = useState(false);
    const { Search } = Input;
    const [form] = Form.useForm();
    const [dataSource, setDataSource] = useState([])
    const [formFields, setFormFields] = useState<any>([])
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const [customerAddress, setCustomerAddress] = useState('');


    useEffect(() => {
        getInvoice()
    }, [])

    const getInvoice = (() => {
        axios.get("http://files.covaiciviltechlab.com/invoice_list/", {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then((res) => {
            setDataSource(res?.data)
            setFilterData(res.data)
        }).catch((error: any) => {
            console.log(error)
        })
    })


    useEffect(() => {
        axios.get("http://files.covaiciviltechlab.com/create_invoice/", {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then((res) => {
            setFormFields(res.data)
        }).catch((error: any) => {
            console.log(error)
        })
    }, [])




    // drawer
    const showDrawer = () => {
        setOpen(true);

    };

    const onClose = () => {
        setOpen(false);
        form.resetFields()
        setCustomerAddress('')
    };



    const columns = [
        {
            title: 'Invoice N0',
            dataIndex: 'invoice_no',
            key: 'invoice_no',
            className: 'singleLineCell',
            width:100
        },
        {
            title: 'Customer Name',
            dataIndex: 'customer',
            key: 'customer',
            className: 'singleLineCell',
        },
        {
            title: 'Project Name',
            dataIndex: 'project_name',
            key: 'project_name',
            className: 'singleLineCell',
        },
        {
            title: 'Total Amount',
            dataIndex: 'total_amount',
            key: 'total_amount',
            className: 'singleLineCell',
        },
        {
            title: 'Balance',
            dataIndex: 'balance',
            key: 'balance',
            className: 'singleLineCell',
        },
        {
            title: 'Incompleted Test',
            dataIndex: 'incompleted_test',
            key: 'incompleted_test',
            className: 'singleLineCell',
            width:150
        },
        {
            title: "Actions",
            key: "actions",
            className: 'singleLineCell',
            render: (text: any, record: any) => (

                <Space size="middle">
                    {/* <Link href='/invoice/preview/'>
                        <EyeOutlined style={{ cursor: "pointer" }}
                            className='view-icon' rev={undefined} />
                    </Link> */}



                    {
                        localStorage.getItem('admin') === 'true' ? (
                            <span
                                onClick={() => handleEditClick(record)}
                                style={{ cursor: "pointer" }}
                                className='edit-icon'
                            >
                                <EditOutlined rev={undefined} />
                            </span>
                        ) : (
                            <span
                                onClick={() => handleEditClick(record)}
                                style={{ cursor: "pointer", display:"none" }}
                                className='edit-icon'
                            >
                                <EditOutlined rev={undefined} />
                            </span>
                        )
                    }

                    {/* <span
                        onClick={() => handleEditClick(record)}
                        style={{ cursor: "pointer" }}
                        className='edit-icon'
                    >
                        <EditOutlined rev={undefined} />
                    </span> */}
                    {/* <DeleteOutlined
                        style={{ color: "red", cursor: "pointer" }}
                        onClick={() => handleDelete(record)} className='delete-icon' rev={undefined} /> */}
                </Space>
            ),
        }
    ];


    const handleEditClick = (record: any) => {
        // Navigate to the /invoice/edit page with the record data as a query parameter
        window.location.href = `/invoice/edit?id=${record.id}`;
    };

    // const handleDelete = (record: any) => {
    //     // Implement your delete logic here

    //     Modal.confirm({
    //         title: "Are you sure, you want to delete this TAX record?",
    //         okText: "Yes",
    //         okType: "danger",
    //         onOk: () => {
    //             console.log(record, "values")
    //             axios.delete(`http://files.covaiciviltechlab.com/delete_invoice/${record.id}`, {
    //                 headers: {
    //                     "Authorization": `Token ${localStorage.getItem("token")}`
    //                 }
    //             }).then((res) => {
    //                 console.log(res)
    //                 getInvoice()
    //             }).catch((err: any) => {
    //                 console.log(err)
    //             })

    //         },

    //     });
    // };

    // input search
    const [filterData, setFilterData] = useState(dataSource)

    const inputChange = ((e: any) => {
        const SearchValue = e.target.value

        const filteredData = dataSource.filter((item: any) => {
            return (
                item.invoice_no.includes(SearchValue) || item.customer.toLowerCase().includes(SearchValue.toLowerCase()) || item.project_name.toLowerCase().includes(SearchValue.toLowerCase()) || item.total_amount.includes(SearchValue) || item.balance.includes(SearchValue) ||  item.incompleted_test.includes(SearchValue)
            )
        })
        setFilterData(filteredData)
    })

    // form submit
    const onFinish = (values: any) => {
        const Token = localStorage.getItem("token");

        const body = {
            customer: values.customer,
            project_name: values.project_name,
            advance: values.advance,
            balance: values.balance,
            discount: values.discount,
            sales_mode: values.sales_mode,
            tax: values.tax,
            id: values.id
        };

        axios.post("http://files.covaiciviltechlab.com/create_invoice/", body, {
            headers: {
                "Authorization": `Token ${Token}`
            }
        }).then((res) => {
            getInvoice();
            console.log("response", res?.data);
            window.location.href = `/invoice/edit?id=${res?.data?.id}`;
            setOpen(false);
        }).catch((error) => {
            console.log(error);
        });

        form.resetFields();
        onClose();
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };



    const handleSelectChange = (customerId: any) => {
        // Find the selected customer in the data array
        const selectedCustomer = formFields?.customer?.find((customer: any) => customer.id === customerId);

        // Update the state with the selected customer's address
        setSelectedCustomerId(customerId);
        setCustomerAddress(selectedCustomer?.address1 || '');
    };


    
    const scrollConfig:any = {
        x:true,
        y: 300,  
      };

    return (
        <>
            <div className='panel'>
                <div className='tax-heading-main'>
                    <div>
                        <h1 className='text-lg font-semibold dark:text-white-light'>Manage Invoices</h1>
                    </div>
                    <div>
                        <Search placeholder="input search text" onChange={inputChange} enterButton className='search-bar' />
                        <button type='button' className='create-button' onClick={() => showDrawer()}>+ Create Invoice</button>
                    </div>
                </div>
                <div className='table-responsive'>
                    <Table dataSource={filterData} columns={columns} pagination={false} scroll={scrollConfig} />
                </div>

                <Drawer title="Create Invoice" placement="right" width={600} onClose={onClose} open={open}>
                    <Form
                        name="basic-form"
                        layout="vertical"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        form={form}
                    >

                        <Form.Item
                            label="Customer Name"
                            name="customer"
                            required={false}
                            rules={[{ required: true, message: 'Please select Material Name!' }]}
                        >
                            <Select onChange={handleSelectChange}
                                placeholder="Select a customer"
                                value={selectedCustomerId}>
                                {formFields?.customer?.map((val: any) => (
                                    <Select.Option key={val.id} value={val.id}>
                                        {val.customer_name} - {val.phone_no}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item>
                            <Input.TextArea rows={4} value={customerAddress} />
                        </Form.Item>

                        <Form.Item
                            label="Project Name"
                            name="project_name"
                            required={false}
                            rules={[{ required: true, message: 'Please input your Project Name!' }]}
                        >
                            <Input />
                        </Form.Item>


                        {/* <Form.Item label="Sales Mode" name='sales_mode'>
                            <Select>
                                {formFields?.sales_mode?.map((val: any) => (
                                    <Select.Option key={val.id} value={val.id}>
                                        {val.sales_mode}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item> */}

                        {/* <Form.Item label="Material ID" name='materialId'>
                                <Select>
                                    {formFields?.taxs?.map((val: any) => (
                                        <Select.Option key={val.id} value={val.id}>
                                            {val.tax_name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item> */}

                        <Form.Item >
                            {/* <Space> */}
                            <div className='form-btn-main'>
                                <Space>
                                    <Button danger htmlType="submit" onClick={() => onClose()}>
                                        Cancel
                                    </Button>
                                    <Button type="primary" htmlType="submit">
                                        Submit
                                    </Button>
                                </Space>

                            </div>
                            {/* <Button htmlType="submit" style={{ borderColor: "blue", color: "blue" }}>
                                        Add Invoice Test
                                    </Button> */}
                            {/* </Space> */}
                        </Form.Item>
                        {/* </div> */}
                    </Form>

                </Drawer>

            </div>
        </>
    )
}

export default Invoice