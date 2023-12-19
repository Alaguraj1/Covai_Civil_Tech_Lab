import { size } from 'lodash'
import React, { useState, useEffect } from 'react'
import { Space, Table, Modal } from 'antd';
import { Button, Drawer } from 'antd';
import { Checkbox, Form, Input, Radio, DatePicker, } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import axios from "axios"

const Employee = () => {

    const [open, setOpen] = useState(false);
    const { Search } = Input;
    const [form] = Form.useForm();
    const [editRecord, setEditRecord] = useState(null);
    const [drawerTitle, setDrawerTitle] = useState("Create Employee Details");
    const [viewRecord, setViewRecord] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataSource, setDataSource] = useState([])


    useEffect(() => {
        getEmployee()
    }, [])

    const getEmployee = (() => {
        const Token = localStorage.getItem("token")

        axios.get("http://files.covaiciviltechlab.com/employee_list/", {
            headers: {
                "Authorization": `Token ${Token}`
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
            form.setFieldsValue(record);
        } else {
            setEditRecord(null); 
            form.resetFields(); 
        }

        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
        form.resetFields()
    };


    // table

    const columns = [
        {
            title: 'Employee Name',
            dataIndex: 'employee_name',
            key: 'employee_name',
        },
        {
            title: 'Login Name',
            dataIndex: 'login_name',
            key: 'login_name',
        },

        {
            title: 'Mobile Number',
            dataIndex: 'mobile_number',
            key: 'mobile_number',
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
        const Token = localStorage.getItem("token")


        Modal.confirm({
            title: "Are you sure, you want to delete this EMPLOYEE record?",
            okText: "Yes",
            okType: "danger",
            onOk: () => {
              console.log(record, "values")
              axios.delete(`http://files.covaiciviltechlab.com/delete_employee/${record.id}/`, {
                headers :
                {
                    "Authorization" : `Token ${Token}`
                }
              }).then((res) => {
                console.log(res)
                getEmployee()
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

        const Token = localStorage.getItem("token")


        // Check if editing or creating
        if (editRecord) {
            axios.put(`http://files.covaiciviltechlab.com/edit_customer/${editRecord.id}/`, values, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
          }).then((res) => {
            console.log(res)
            form.resetFields();
            getEmployee()
          }).catch((error) => {
            console.log(error)
          })
            // Clear editRecord state
            setEditRecord(null);
        } else {

            axios.post("http://files.covaiciviltechlab.com/create_employee/", values, {
                headers: {
                    "Authorization": `Token ${Token}`
                }
            }).then((res) => {
                console.log(res.data)
                getEmployee()
            }).catch((error:any) => {
                console.log(error)
            })

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
        employeeName?: string;
        loginName?: string;
        password?: string;
        address?: string;
        mobileNumber?: string;
        phoneNumber?: string;
        email?: string;
        dob?: string;
        gender?: string;
        qualification?: string;
        joiningDate?: string;
        salary?: string;
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
                        <h1 className='tax-title'>Employee Details</h1>
                    </div>
                    <div>
                        <Search placeholder="input search text" onSearch={onSearch} enterButton className='search-bar' />
                        <button type='button' onClick={() => showDrawer(null)} className='create-button'>+ Create Employee Details</button>
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
                            label="Employee Name"
                            name="employee_name"
                            required={false}
                            rules={[{ required: true, message: 'Please input your Customer Name!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Login Name"
                            name="login_name"
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
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Mobile Number"
                            name="mobile_number"
                            required={false}
                            rules={[{ required: true, message: 'Please input your City1!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Phone Number"
                            name="phone_number"
                            required={false}
                            rules={[{ required: true, message: 'Please input your Phone Number!' }]}
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

                        <Form.Item label="DatePicker" name="dob">
                            <DatePicker style={{ width: "100%" }} />
                        </Form.Item>

                        <Form.Item label="Gender" name="gender">
                            <Radio.Group>
                                <Radio value="male"> Male </Radio>
                                <Radio value="female"> Female </Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Qualification"
                            name="qualification"
                            required={false}
                            rules={[{ required: true, message: 'Please input your Address 2!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item label="DatePicker" name="joining_date">
                            <DatePicker style={{ width: "100%" }} />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Salary"
                            name="salary"
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

export default Employee