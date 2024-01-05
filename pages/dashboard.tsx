import React, { useEffect, useState } from 'react'
import axios from "axios"
import { Button, Card, Col, Row } from 'antd';
import Link from 'next/link';
const Dashboard = () => {

    const [dashboard, setDashboard] = useState<any>([])
    useEffect(() => {
        getDashboard()
    }, [])

    const getDashboard = (() => {

        const Token = localStorage.getItem('token')

        axios.get("http://files.covaiciviltechlab.com/dashboard/", {
            headers: {
                "Authorization": `Token ${Token}`
            }
        }).then((res) => {
            setDashboard(res.data)
        }).catch((error: any) => {
            console.log(error)
        })
    })

    console.log("dashboard", dashboard)
    return (
        <>
            <div style={{ padding: "50px" }}>
                <Row gutter={24}>
                    <Col span={12}>
                        <Card bordered={false} >
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <h2 style={{ fontSize: "24px", fontWeight: "600" }}>customer_count : {dashboard?.customer_count}</h2>
                                <Button type="primary" size='large'><Link href='/people/customer'>View</Link></Button>
                            </div>

                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card bordered={false} >
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <h2 style={{ fontSize: "24px", fontWeight: "600" }}>pending_payment_count : {dashboard?.pending_payment_count}</h2>
                                <Button type="primary" size='large'><Link href='/invoice/pendingPayment'>View</Link></Button>
                            </div>

                        </Card>
                    </Col>
                </Row>

                <Row gutter={24} style={{ padding: "50px 0px" }}>
                    <Col span={12}>
                        <Card bordered={false} >
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <div>
                                    <h2 style={{ fontSize: "24px", fontWeight: "600" }}>this_month_expense_entry_count : {dashboard?.this_month_expense_entry_count}</h2>
                                    <h2 style={{ fontSize: "24px", fontWeight: "600" }}>this_month_expense_total : {dashboard?.this_month_expense_total}</h2>
                                </div>

                                <Button type="primary" size='large'><Link href='/report/expenseReport'>View</Link></Button>
                            </div>

                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card bordered={false} >
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <div>
                                    <h2 style={{ fontSize: "24px", fontWeight: "600" }}>this_month_generated_invoice : {dashboard?.this_month_generated_invoice}</h2>
                                    <h2 style={{ fontSize: "24px", fontWeight: "600" }}>this_month_pending_payment_count : {dashboard?.this_month_pending_payment_count}</h2>
                                </div>
                                <Button type="primary" size='large'><Link href='/invoice/pendingPayment'>View</Link></Button>
                            </div>

                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default Dashboard