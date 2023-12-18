import { size } from 'lodash'
import React, { useEffect, useState } from 'react'
import { Space, Table, Modal } from 'antd';
import { Button, Drawer } from 'antd';
import { Checkbox, Form, Input, InputNumber, Select } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import axios from "axios"

const Test = () => {

    const [open, setOpen] = useState(false);
    const { Search } = Input;
    const [form] = Form.useForm();
    const [editRecord, setEditRecord] = useState(null)
    const [drawertitle, setDrawerTitle] = useState("Create Test")
    const [viewRecord, setViewRecord] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataSource, setDataSource] = useState([])
    const [formFields, setFormFields] = useState([])

    // get test 
    useEffect(() => {
        getTest()
    }, [])

    const getTest = (() => {
        const Token = localStorage.getItem("token")

        axios.get("http://files.covaiciviltechlab.com/test_list/", {
            headers: {
                "Authorization": `Token ${Token}`
            }
        }).then((res: any) => {
            console.log(res.data)
            setDataSource(res.data)
        }).catch((error: any) => {
            console.log(error)
        })
    })
    console.log("dataSource", dataSource)


    useEffect(() => {
        const Token = localStorage.getItem("token")

        axios.get("http://files.covaiciviltechlab.com/create_test/", {
            headers: {
                "Authorization": `Token ${Token}`
            }
        }).then((res) => {
            setFormFields(res.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [])
    console.log("formFields", formFields)


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
            setDrawerTitle("Edit Test")
        } else {
            setDrawerTitle("Create Test")
        }
    })


    // drawer
    const showDrawer = (record: any) => {
        if (record) {
            setEditRecord(record)
            form.setFieldsValue(record)
        } else {
            setEditRecord(null)
            form.resetFields()
        }

        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
        form.resetFields()
    };


    const columns = [
        {
            title: 'Material Name',
            dataIndex: 'material_name',
            key: 'material_name',
        },
        {
            title: 'Test Name',
            dataIndex: 'test_name',
            key: 'test_name',
        },
        {
            title: 'Price',
            dataIndex: 'price_per_piece',
            key: 'price_per_piece',
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
            title: "Are you sure, you want to delete this TAX record?",
            okText: "Yes",
            okType: "danger",
            onOk: () => {
                console.log(record, "values")
                axios.delete(`http://files.covaiciviltechlab.com/delete_test/${record.id}/`,
                    {
                        headers: {
                            "Authorization": `Token ${Token}`
                        }
                    }).then((res) => {
                        console.log(res)
                        getTest()
                    }).catch((err) => {
                        console.log(err)
                    })

            },

        });
    };

    // input search
    const onSearch = (value: string, _e: any, info: any) => {
        const filteredData = dataSource.filter((item: any) =>
            item?.material_name?.toLowerCase()?.includes(value?.toLowerCase())
        );
        setDataSource(filteredData);
    };


    // form submit
    const onFinish = (values: any) => {

        const Token = localStorage.getItem("token")

        if (editRecord) {
            axios.put(`http://files.covaiciviltechlab.com/edit_test/${editRecord.id}/`, values, {
                headers: {
                    "Authorization": `Token ${Token}`
                }
            }).then((res: any) => {
                console.log(res)
                getTest()
                setOpen(false);
            }).catch((err: any) => {
                console.log(err)
            })
        } else {
            axios.post("http://files.covaiciviltechlab.com/create_test/", values, {
                headers: {
                    "Authorization": `Token ${localStorage.getItem("token")}`
                }
            }).then((res) => {
                console.log(res)
                getTest()
                setOpen(false);
                form.resetFields()
            }).catch((err) => {
                console.log(err)
            })
        }

        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    type FieldType = {
        material_name?: string;
        test_name?: string;
        price_per_piece?: Number;
    };


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
                label: "Test Name:",
                value: viewRecord?.test_name || "N/A",
            },
            {
                label: "Material Name:",
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
            {
                label: "price Per Piece:",
                value: viewRecord?.price_per_piece || "N/A",
            },
        ];

        return data;
    };


    return (
        <>
            <div>
                <div className='tax-heading-main'>
                    <div>
                        <h1 className='tax-title'>Manage Test</h1>
                    </div>
                    <div>
                        <Search placeholder="input search text" onSearch={onSearch} enterButton className='search-bar' />
                        <button type='button' onClick={() => showDrawer(null)} className='create-button'>+ Create Test</button>
                    </div>
                </div>
                <div>
                    <Table dataSource={dataSource} columns={columns} pagination={false} />
                </div>

                <Drawer title={drawertitle} placement="right" width={600} onClose={onClose} open={open}>
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
                            label="Material Name"
                            name="material_name"
                            required={false}
                            rules={[{ required: true, message: 'Please input your Tax Name!' }]}
                        >
                            <Select>
                                {formFields?.materials?.map((val: any) => (
                                    <Select.Option key={val.material_name} value={val.id} >
                                        {val.material_name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Test Name"
                            name="test_name"
                            required={false}
                            rules={[{ required: true, message: 'Please input your Tax Percentage!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Price"
                            name="price_per_piece"
                            required={false}
                            rules={[{ required: true, message: 'Please input your Tax Status!' }]}
                        >
                            <InputNumber style={{ width: "100%" }} />
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
                <Modal title="View Test" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={false}>
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

            </div>
        </>
    )
}

export default Test