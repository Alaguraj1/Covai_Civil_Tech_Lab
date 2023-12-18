import { size } from 'lodash'
import React, { useState, useEffect } from 'react'
import { Space, Table, Modal } from 'antd';
import { Button, Drawer } from 'antd';
import { Checkbox, Form, Input, Radio, DatePicker, } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import axios from "axios"

const Customer = () => {

    const [open, setOpen] = useState(false);
    const { Search } = Input;
    const [form] = Form.useForm();
    const [editRecord, setEditRecord] = useState(null);
    const [drawerTitle, setDrawerTitle] = useState("Create Employee Details");
    const [viewRecord, setViewRecord] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataSource, setDataSource] = useState([])



    useEffect(() => {
        getCustomer()
    }, [])

    const getCustomer = (() => {
        axios.get("http://files.covaiciviltechlab.com/customer_list/", {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then((res) => {
            setDataSource(res.data)
        }).catch((error: any) => {
            console.log(error)
        })
    })
    console.log("dataSource", dataSource)

    const showModal = (record: any) => {
        setIsModalOpen(true);
        setViewRecord(record)
        modalData()
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (editRecord) {
            setDrawerTitle("Edit Employee Details");
        } else {
            setDrawerTitle("Create Employee Details");
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


    const columns = [
        {
            title: 'Customer Name',
            dataIndex: 'customer_name',
            key: 'customer_name',
        },
        {
            title: 'Phone Number',
            dataIndex: 'phone_no',
            key: 'phone_no',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: "Actions",
            key: "actions",
            render: (text: any, record: any) => (

                <Space size="middle">
                    <EyeOutlined style={{ cursor: "pointer" }}
                        onClick={() => showModal(record)} className='view-icon' rev={undefined} />
                    <EditOutlined
                        style={{ cursor: "pointer" }}
                        onClick={() => showDrawer(record)}
                        className='edit-icon' rev={undefined} />
                    <DeleteOutlined
                        style={{ color: "red", cursor: "pointer" }}
                        onClick={() => handleDelete(record)} className='delete-icon' rev={undefined} />
                </Space>
            ),
        }
    ];



    const handleDelete = (record: any) => {
        // Implement your delete logic here
        console.log(`Delete record with key ${record}`);

        Modal.confirm({
            title: "Are you sure, you want to delete this TAX record?",
            okText: "Yes",
            okType: "danger",
            onOk: () => {
                console.log(record, "values")
                axios.delete(`http://files.covaiciviltechlab.com/delete_customer/${record.id}`, {
                    headers: {
                        "Authorization": `Token ${localStorage.getItem("token")}`
                    }
                }).then((res) => {
                    console.log(res)
                    getCustomer()
                }).catch((err) => {
                    console.log(err)
                })

            },
        });
    };

    // input search
    const onSearch = ((value: any) => {

        const filterData = dataSource.filter((search: any) => {
            return (
                search?.customerName?.toLowerCase()?.includes(value.toLowerCase())
            )
        })
        setDataSource(filterData)
    })


    // form submit
    const onFinish = (values: any) => {
        console.log('Success:', values);

        // Check if editing or creating
        if (editRecord) {
          axios.put(`http://files.covaiciviltechlab.com/edit_customer/${editRecord.id}/`, values, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
          }).then((res) => {
            console.log(res)
            form.resetFields();
            getCustomer()
          }).catch((error) => {
            console.log(error)
          })
            // Clear editRecord state
            setEditRecord(null);
        } else {
            axios.post("http://files.covaiciviltechlab.com/create_customer/", values, {
                headers: {
                    "Authorization": `Token ${localStorage.getItem("token")}`
                }
            }).then((res) => {
                console.log(res)
                form.resetFields();
                getCustomer()
            }).catch((error: any) => {
                console.log(error)
            })
            // Clear form fields
        }
        // Close the drawer
        onClose();
    }
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    type FieldType = {
        customer_name?: string;
        phone_no?: string;
        gstin_no?: string;
        email?: string;
        address1?: string;
        city1?: string;
        state1?: string;
        country1?: string;
        pincode1?: string;
        contact_person1?: string;
        mobile_no1?: string;
        contact_person_email1?: string;
        code?: string;
        place_of_testing?: string;
        address2?: string;
        city2?: string;
        state2?: string;
        country2?: string;
        pincode2?: string;
        contact_person2?: string;
        mobile_no2?: string;
        contact_person_email2?: string;
    };

    const { TextArea } = Input;



    // modal data
    const modalData = () => {
        const formatDate = (dateString: any) => {
            if (!dateString) {
                return "N/A"; // or handle it according to your requirements
            }

            const date = new Date(dateString);

            if (isNaN(date.getTime())) {
                return "Invalid Date"; // or handle it according to your requirements
            }

            return new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }).format(date);
        };

        const data = [
            {
                label: "Tax Name:",
                value: viewRecord?.material_name || "N/A",
            },
            {
                label: "Created By:",
                value: viewRecord?.created_by || "N/A",
            },
            {
                label: "Created Date:",
                value: formatDate(viewRecord?.created_date),
            },
            {
                label: "Modified By:",
                value: viewRecord?.modified_by || "N/A",
            },
            {
                label: "Modified Date:",
                value: formatDate(viewRecord?.modified_date),
            },
        ];

        return data;
    };


    return (
        <>
            <div>
                <div className='tax-heading-main'>
                    <div>
                        <h1 className='tax-title'>Customer Details</h1>
                    </div>
                    <div>
                        <Search placeholder="input search text" onSearch={onSearch} enterButton className='search-bar' />
                        <button type='button' onClick={() => showDrawer(null)} className='create-button'>+ Create Customer Details</button>
                    </div>
                </div>
                <div>
                    <Table dataSource={dataSource} columns={columns} pagination={false} />
                </div>

                <Drawer title={drawerTitle} placement="right" width={600} onClose={onClose} open={open}>
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
                            label="Customer Name"
                            name="customer_name"
                            required={false}
                            rules={[{ required: true, message: 'Please input your Customer Name!' }]}
                        >
                            <Input />
                        </Form.Item>

                        {/* <Form.Item<FieldType>
                            label="Login Name"
                            name="loginName"
                            required={false}
                            rules={[{ required: true, message: 'Please input your GSTin!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Password"
                            name="password"
                            required={false}
                            rules={[{ required: true, message: 'Please input your GSTin!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Address"
                            name="address"
                            required={false}
                            rules={[{ required: true, message: 'Please input your Address1!' }]}
                        >
                            <TextArea rows={4} />
                        </Form.Item> */}



                        <Form.Item<FieldType>
                            label="Phone Number"
                            name="phone_no"
                            required={false}
                            rules={[{ required: true, message: 'Please input your Phone Number!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="GST in"
                            name="gstin_no"
                            required={false}
                            rules={[{ required: true, message: 'Please input your City1!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Email"
                            name="email"
                            required={false}
                            rules={[{ required: true, message: 'Please input your EMail!' }]}
                        >
                            <Input />
                        </Form.Item>

                        {/* <Form.Item label="DatePicker" name="dob">
                            <DatePicker style={{ width: "100%" }} />
                        </Form.Item>

                        <Form.Item label="Gender" name="gender">
                            <Radio.Group>
                                <Radio value="male"> Male </Radio>
                                <Radio value="female"> Female </Radio>
                            </Radio.Group>
                        </Form.Item> */}

                        <Form.Item<FieldType>
                            label="Address 1"
                            name="address1"
                            required={false}
                            rules={[{ required: true, message: 'Please input your Address1!' }]}
                        >
                            <TextArea rows={4} />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="City 1"
                            name="city1"
                            required={false}
                            rules={[{ required: true, message: 'Please input your State1!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="State 1"
                            name="state1"
                            required={false}
                            rules={[{ required: true, message: 'Please input your State1!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Country 1"
                            name="country1"
                            required={false}
                            rules={[{ required: true, message: 'Please input your State1!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Pincode 1"
                            name="pincode1"
                            required={false}
                            rules={[{ required: true, message: 'Please input your State1!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Contact Person 1"
                            name="contact_person1"
                            required={false}
                            rules={[{ required: true, message: 'Please input your State1!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Mobile Number 1"
                            name="mobile_no1"
                            required={false}
                            rules={[{ required: true, message: 'Please input your Phone Number!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Contact Person Email1"
                            name="contact_person_email1"
                            required={false}
                            rules={[{ required: true, message: 'Please input your EMail!' }]}
                        >
                            <Input />
                        </Form.Item>


                        <Form.Item<FieldType>
                            label="Address 2"
                            name="address2"
                            required={false}
                            rules={[{ required: true, message: 'Please input your Address1!' }]}
                        >
                            <TextArea rows={4} />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="City 2"
                            name="city2"
                            required={false}
                            rules={[{ required: true, message: 'Please input your State1!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="State 2"
                            name="state2"
                            required={false}
                            rules={[{ required: true, message: 'Please input your State1!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Country 2"
                            name="country2"
                            required={false}
                            rules={[{ required: true, message: 'Please input your State1!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Pincode 2"
                            name="pincode2"
                            required={false}
                            rules={[{ required: true, message: 'Please input your State1!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Contact Person 2"
                            name="contact_person2"
                            required={false}
                            rules={[{ required: true, message: 'Please input your State1!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Mobile Number 2"
                            name="mobile_no2"
                            required={false}
                            rules={[{ required: true, message: 'Please input your Phone Number!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Contact Person Email2"
                            name="contact_person_email2"
                            required={false}
                            rules={[{ required: true, message: 'Please input your EMail!' }]}
                        >
                            <Input />
                        </Form.Item>


                        <Form.Item<FieldType>
                            label="Place Of Testing"
                            name="place_of_testing"
                            required={false}
                            rules={[{ required: true, message: 'Please input your State1!' }]}
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


                {/* modal */}
                <Modal title="View Employee" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={false}>
                    {
                        modalData()?.map((value: any) => {
                            return (
                                <>
                                    <div className='content-main' >
                                        <p className='content-1'>{value?.label}</p>
                                        <p className='content-2'>{value?.value}</p>
                                    </div>
                                </>
                            )
                        })
                    }
                </Modal>

            </div >
        </>
    )
}

export default Customer