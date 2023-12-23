import React, { useState, useEffect } from 'react'
import { Table, Form, Input, Button, DatePicker, Select } from 'antd';
import axios from "axios"
import moment from 'moment';


const SaleReport = () => {

    const [form] = Form.useForm();
    const [dataSource, setDataSource] = useState([])
    const [slaeFormData, setSaleFormData] = useState([])


    useEffect(() => {
        axios.get("http://files.covaiciviltechlab.com/sale_report/", {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then((res) => {
            setSaleFormData(res.data.reports)
        }).catch((error: any) => {
            console.log(error)
        })
    }, [])

    console.log("slaeFormData", slaeFormData)


    // Table Datas
    const columns = [
        {
            title: 'Customer Name',
            dataIndex: 'customer_name',
            key: 'customer_name',
        },
        {
            title: 'Project Name',
            dataIndex: 'project_name',
            key: 'project_name',
        },
        {
            title: 'Advance',
            dataIndex: 'advance',
            key: 'advance',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Balance',
            dataIndex: 'balance',
            key: 'balance',
        },

        {
            title: 'Cash',
            dataIndex: 'cash',
            key: 'cash',
        },
        {
            title: 'CGST Tax',
            dataIndex: 'cgst_tax',
            key: 'cgst_tax',
        },
        {
            title: 'Cheque Neft',
            dataIndex: 'cheque_neft',
            key: 'cheque_neft',
        },

        {
            title: 'Customer GST No',
            dataIndex: 'customer_gst_no',
            key: 'customer_gst_no',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Invoice No',
            dataIndex: 'invoice_no',
            key: 'invoice_no',
        },

        {
            title: 'SGST Tax',
            dataIndex: 'sgst_tax',
            key: 'sgst_tax',
        },
        {
            title: 'Tax Deduction',
            dataIndex: 'tax_deduction',
            key: 'tax_deduction',
        },
        {
            title: 'Total Amount',
            dataIndex: 'total_amount',
            key: 'total_amount',
        },
    ];



    // form submit
    const onFinish = (values: any,) => {

        const Token = localStorage.getItem("token")

        const body = {
            "project_name": values.project_name ? values.project_name : "",
            "from_date": values?.from_date ? moment(values?.from_date).format('YYYY-MM-DD') : "",
            "to_date": values?.to_date ? moment(values?.to_date).format('YYYY-MM-DD') : "",
            "customer": values.customer ? values.customer : "",
        };
        console.log('✌️body --->', body);

        axios.post("http://files.covaiciviltechlab.com/sale_report/", body, {
            headers: {
                "Authorization": `Token ${Token}`
            }
        }).then((res: any) => {
            setDataSource(res?.data?.reports);
        }).catch((error: any) => {
            console.log(error);
        });
        form.resetFields();
    }

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    type FieldType = {
        project_name?: string;
        from_date?: string;
        to_date?: string;
        customer?: string;
    };


    return (
        <>
            <div>
                <div>

                    <Form
                        name="basic"
                        layout="vertical"
                        form={form}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"

                    >
                        <div style={{ display: "flex", justifyContent: "space-between" }}>

                            <Form.Item<FieldType>
                                label="Project Name"
                                name="project_name"
                                style={{ width: "250px" }}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item label="From Date" name="from_date" style={{ width: "250px" }}>
                                <DatePicker style={{ width: "100%" }} />
                            </Form.Item>

                            <Form.Item label="To Date" name="to_date" style={{ width: "250px" }}>
                                <DatePicker style={{ width: "100%" }} />
                            </Form.Item>

                            <Form.Item
                                label="Customer"
                                name="customer"
                                style={{ width: "300px" }}
                            >
                                <Select >
                                    {slaeFormData?.map((value: any) => (
                                        <Select.Option key={value.id} value={value.id}>
                                            {value.customer_name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <div style={{ display: "flex", alignItems: "end" }}>
                                <Form.Item  >
                                    <Button type="primary" htmlType="submit" style={{ width: "200px" }}>
                                        Search
                                    </Button>
                                </Form.Item>
                            </div>
                        </div>

                    </Form>
                </div>
                <div className='tax-heading-main'>
                    <h1 className='tax-title'>Sales Report</h1>
                </div>
                <div>
                    <Table dataSource={dataSource} columns={columns} pagination={false} />
                </div>
            </div>
        </>
    )
}

export default SaleReport