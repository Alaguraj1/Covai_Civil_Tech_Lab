import React, { useState, useEffect } from 'react'
import { Table, Form, Input, Button, DatePicker, Select, Tooltip } from 'antd';
import axios from "axios"
import moment from 'moment';
import ExcelJS from "exceljs";
import * as FileSaver from "file-saver";
import dayjs from 'dayjs';

const SaleReport = () => {

    const [form] = Form.useForm();
    const [dataSource, setDataSource] = useState([])
    const [saleFormData, setSaleFormData] = useState([])
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



    // Table Datas
    const columns = [
        {
            title: 'Date',
            dataIndex: 'export_date',
            key: 'export_date',
            className: 'singleLineCell',
            // render: (text: any) => {
            //     const formattedDate = moment(text, 'YYYY-MM-DD').isValid()
            //         ? moment(text).format('DD-MM-YYYY')
            //         : ''; // Empty string for invalid dates
            //     return formattedDate;
            // },
        },
        {
            title: 'Invoice No',
            dataIndex: 'invoice_no',
            key: 'invoice_no',
            className: 'singleLineCell',
            width: 100
        },
        {
            title: 'Customer Name',
            dataIndex: 'customer_name',
            key: 'customer_name',
            className: 'singleLineCell'
        },
        {
            title: 'Customer GST No',
            dataIndex: 'customer_gst_no',
            key: 'customer_gst_no',
            className: 'singleLineCell'
        },
        {
            title: 'Project Name',
            dataIndex: 'project_name',
            key: 'project_name',
            className: 'singleLineCell'
        },

        {
            title: 'Advance',
            dataIndex: 'advance',
            key: 'advance',
            className: 'singleLineCell',
        },
        // {
        // //     title: (
        // //         <Tooltip title="amount">
        // //           <span>Amount</span>
        // //         </Tooltip>
        // //       ),
        //     title: 'Amount',
        //     dataIndex: 'amount',
        //     key: 'amount',
        //      className: 'singleLineCell'
        // },
        {
            title: 'Balance',
            dataIndex: 'balance',
            key: 'balance',
            className: 'singleLineCell'
        },


        {
            title: 'Cheque No',
            dataIndex: 'cheque_neft',
            key: 'cheque_neft',
            className: 'singleLineCell',
            width: 120
        },
        {
            title: 'UPI',
            dataIndex: 'upi',
            key: 'upi',
            className: 'singleLineCell'
        },
        {
            title: 'CGST Tax',
            dataIndex: 'cgst_tax',
            key: 'cgst_tax',
            className: 'singleLineCell',
            width: 100
        },
        {
            title: 'SGST Tax',
            dataIndex: 'sgst_tax',
            key: 'sgst_tax',
            className: 'singleLineCell',
            width: 100
        },
        // {
        //     title: 'Tax Deduction',
        //     dataIndex: 'tax_deduction',
        //     key: 'tax_deduction',
        // },
        {
            title: 'Total Amount',
            dataIndex: 'total_amount',
            key: 'total_amount',
            className: 'singleLineCell'
        },
    ];

    useEffect(() => {
        const Token = localStorage.getItem("token")

        const body = {
            "project_name": "",
            "from_date": "",
            "to_date": "",
            "customer": "",
        };

        axios.post("http://files.covaiciviltechlab.com/sale_report/", body, {
            headers: {
                "Authorization": `Token ${Token}`
            }
        }).then((res: any) => {
            setDataSource(res?.data?.reports);
        }).catch((error: any) => {
            console.log(error);
        });
    }, [])


    // form submit
    const onFinish = (values: any,) => {

        const Token = localStorage.getItem("token")

        const body = {
            "project_name": values.project_name ? values.project_name : "",
            "from_date": values?.from_date ? dayjs(values?.from_date).format('YYYY-MM-DD') : "",
            "to_date": values?.to_date ? dayjs(values?.to_date).format('YYYY-MM-DD') : "",
            "customer": values.customer ? values.customer : "",
        };

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


    // export to excel format
    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sheet1");


        // Add header row
        worksheet.addRow(columns.map((column) => column.title));

        // Add data rows
        dataSource.forEach((row: any) => {
            worksheet.addRow(columns.map((column: any) => row[column.dataIndex]));
        });

        // Generate a Blob containing the Excel file
        const blob = await workbook.xlsx.writeBuffer();

        // Use file-saver to save the Blob as a file
        FileSaver.saveAs(
            new Blob([blob], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            }),
            "Sales-Report.xlsx"
        );
    };


    const scrollConfig: any = {
        x: true,
        y: 300,
    };

    return (
        <>
            <div className='panel'>
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
                        <div className='sale_report_inputs'>

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
                                    {saleFormData?.map((value: any) => (
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
                    <div>
                        <h1 className='text-lg font-semibold dark:text-white-light'>Sales Report</h1>
                    </div>
                    <div>
                        <button type='button' onClick={exportToExcel} className='create-button'>Export to Excel </button>
                    </div>
                </div>

                <div className='table-responsive'>
                    <Table dataSource={dataSource} columns={columns} scroll={scrollConfig} />
                </div>
            </div>
        </>
    )
}

export default SaleReport