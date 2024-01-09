import { size } from 'lodash'
import React, { useEffect, useState } from 'react'
import { Space, Table, Modal } from 'antd';
import { Button, Drawer } from 'antd';
import { Checkbox, Form, Input } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import axios from "axios"
import Dropdown from 'components/Dropdown';
import { useDispatch, useSelector } from 'react-redux';
import IconHorizontalDots from '@/components/Icon/IconHorizontalDots';
import IconEye from '@/components/Icon/IconEye';
import IconBitcoin from '@/components/Icon/IconBitcoin';
import IconEthereum from '@/components/Icon/IconEthereum';
import IconLitecoin from '@/components/Icon/IconLitecoin';
import IconBinance from '@/components/Icon/IconBinance';
import IconTether from '@/components/Icon/IconTether';
import IconSolana from '@/components/Icon/IconSolana';
import IconCircleCheck from '@/components/Icon/IconCircleCheck';
import IconInfoCircle from '@/components/Icon/IconInfoCircle';
import Link from 'next/link';
import IconMultipleForwardRight from '@/components/Icon/IconMultipleForwardRight';
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});


const Expense = () => {

    const [open, setOpen] = useState(false);
    const { Search } = Input;
    const [form] = Form.useForm();
    const [editRecord, setEditRecord] = useState(null)
    const [drawerTitle, setDrawerTitle] = useState("Create Expense")
    const [viewRecord, setViewRecord] = useState<any>(null)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataSource, setDataSource] = useState([])
    const [customerCount, setCustomerCount] = useState('')
    const [thisMonthcustomerCount, setthisMonthcustomerCount] = useState('')

    const [invoiceTotal, setInvoiceTotal] = useState('')
    const [invoiceThisMonthTotal, setInvoiceThisMonthTotal] = useState('')

    const [expenseTotal, setExpenseTotal] = useState('')
    const [expenseThisMonthTotal, setExpenseThisMonthTotal] = useState('')
    const [thisMonthName, setthisMonthName] = useState('This')

    const [paymentsData, setPayments] = useState([])
    const [invoiceMonthData, setInvoiceMonthData] = useState([])
    console.log(invoiceMonthData,"---------------------mDDDDDDDDDDDD----------------")
    const [invoices, setinvoices] = useState([])
    const [expenses, setexpenses] = useState([])

    const [expense_amount_sum,setexpense_amount_sum]  = useState(0)



    const [monthName, setMonthName] = useState(["January", "December", "November", "October", "September", "August", "July", "June", "May", "April", "March", "February"])
    const [total, setTotal] = useState([13080.0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0])
    const [paid, setPaid] = useState([1710.0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0])
    const [unpaid, setUnPaid] = useState([18269.7,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0])

        const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);

        const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    
    
    const [initialSeriesData] = [
            {
                name: 'Total',
                data: total,
            },
            {
                name: 'Paid Amount',
                data: paid,
            },
            {
                name: 'Unpaid Amount',
                data: unpaid,
            },
        ]

        const [initialOptions] = [{
            chart: {
                height: 325,
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },

            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                curve: 'smooth',
                width: 2,
                lineCap: 'square',
            },
            dropShadow: {
                enabled: true,
                opacity: 0.2,
                blur: 10,
                left: -7,
                top: 22,
            },
            colors: isDark ? ['#2196F3', '#E7515A', '#e670f8'] : ['#1B55E2', '#E7515A', '#e670f8'],
            markers: {
                discrete: [
                    {
                        seriesIndex: 0,
                        dataPointIndex: 6,
                        fillColor: '#1B55E2',
                        strokeColor: 'transparent',
                        size: 7,
                    },
                    {
                        seriesIndex: 1,
                        dataPointIndex: 5,
                        fillColor: '#E7515A',
                        strokeColor: 'transparent',
                        size: 7,
                    },
                    {
                        seriesIndex: 2,
                        dataPointIndex: 5,
                        fillColor: '#e670f8',
                        strokeColor: 'transparent',
                        size: 7,
                    },
                ],
            },
            labels: monthName,
            xaxis: {
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                crosshairs: {
                    show: true,
                },
                labels: {
                    offsetX: isRtl ? 2 : 0,
                    offsetY: 5,
                    style: {
                        fontSize: '12px',
                        cssClass: 'apexcharts-xaxis-title',
                    },
                },
            },
            yaxis: {
                tickAmount: 7,
                labels: {
                    formatter: (value: number) => {
                        return value;
                    },
                    offsetX: isRtl ? -30 : -10,
                    offsetY: 0,
                    style: {
                        fontSize: '12px',
                        cssClass: 'apexcharts-yaxis-title',
                    },
                },
                opposite: isRtl ? true : false,
            },
            grid: {
                borderColor: isDark ? '#191E3A' : '#E0E6ED',
                strokeDashArray: 5,
                xaxis: {
                    lines: {
                        show: false,
                    },
                },
                yaxis: {
                    lines: {
                        show: true,
                    },
                },
                padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                fontSize: '16px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                itemMargin: {
                    horizontal: 10,
                    vertical: 5,
                },
            },
            tooltip: {
                marker: {
                    show: true,
                },
                x: {
                    show: false,
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    inverseColors: !1,
                    opacityFrom: isDark ? 0.19 : 0.28,
                    opacityTo: 0.05,
                    stops: isDark ? [100, 100] : [45, 100],
                },
            },
        }]


        
  
    const [revenueChart, setRevenueChart] = useState({
        series: initialSeriesData,
        options: initialOptions,
      });

      const [salesinitdata] = [
        {
            chart: {
                type: 'donut',
                height: 460,
                fontFamily: 'Nunito, sans-serif',
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 25,
                colors: isDark ? '#0e1726' : '#fff',
            },
            colors: isDark ? ['#5c1ac3', '#e2a03f', '#e7515a', '#e2a03f'] : ['#e2a03f', '#5c1ac3', '#e7515a'],
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                height: 50,
                offsetY: 20,
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '65%',
                        background: 'transparent',
                        labels: {
                            show: true,
                            name: {
                                show: true,
                                fontSize: '29px',
                                offsetY: -10,
                            },
                            value: {
                                show: true,
                                fontSize: '26px',
                                color: isDark ? '#bfc9d4' : undefined,
                                offsetY: 16,
                                formatter: (val: any) => {
                                    return val;
                                },
                            },
                            total: {
                                show: true,
                                label: 'Total Amount',
                                color: '#888ea8',
                                fontSize: '29px',
                                formatter: (w: any) => {
                                    return pa
                                },
                            },
                        },
                    },
                },
            },
            labels: ['Total Amount', 'Paid Amount', 'Unpaid Amount'],
            states: {
                hover: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
                active: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
            },
        }
      ]

      const [salesByCategory, setsalesByCategory] = useState({
        series: [],
        options: salesinitdata,
      });
      
    const [expenseChart, setExpenseChart] = useState<any>(null)
    const [pending_payment, setpending_payment] = useState('')
    const [pending_payment_this_month, setpending_payment_this_month] = useState('')
    const [expenseMonthWise, setexpenseMonthWise] = useState([])

    const[payments_sum,setpayments_sum] = useState(0)

    const [isMounted, setIsMounted] = useState(false);
    // useEffect(() => {
    //     setIsMounted(true);
        
    // });

    // useEffect(() => {
    //     getExpense()
       
      
    // }, [])
    useEffect(()=>{
        setIsMounted(true);
        getExpense()
      

    },[])

    useEffect(()=>{
       
        updateChart()

    },[expenseMonthWise,invoiceMonthData])

    const headers = {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Referrer-Policy': 'same-origin',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        // Adjust the content type based on your API's requirements
        // Add any additional headers here
        // 'Authorization': 'Bearer YourAccessToken',
        // ...
    };


    const getExpense = (() => {
        const Token = localStorage.getItem("token")

        axios.get("http://files.covaiciviltechlab.com/dashboard/", {
            headers: {
                "Authorization": `Token ${Token}`
            }
        }).then((res) => {
            console.log(res.data)
            setDataSource(res.data)
            setFilterData(res.data)
            setCustomerCount(res.data.customer_count)
            setthisMonthcustomerCount(res.data.this_month_customer_count)
            setInvoiceTotal(res.data.this_month_generated_invoice)
            setInvoiceThisMonthTotal(res.data.all_invoice)
            setExpenseTotal(res.data.total_expense_count)
            setExpenseThisMonthTotal(res.data.this_month_expense_count)
            setpending_payment(res.data.pending_payment)
            setpending_payment_this_month(res.data.pending_payment_this_month)
            setMonthName(res.data.months_name)
            setTotal(res.data.total_amount)
            setPaid(res.data.paid_amount)
            setUnPaid(res.data.banlance_amount)
            setPayments(res.data.paymments)
            setInvoiceMonthData(res.data.payments)
            setthisMonthName(res.data.this_month_name)
            setinvoices(res.data.invoices)
            setexpenses(res.data.expenses)
            setexpenseMonthWise(res.data.expense_amount_list)
            setexpense_amount_sum(res.data.expense_amount_sum)
            setpayments_sum(res.data.payments_sum)


            console.log(res.data.expense_amount_list)
            console.log(expenseMonthWise,'check by raj')

         
          
   
   
   
          


        }).catch((error: any) => {
            console.log(error)
        })

         console.log(expenseMonthWise,'expensemonthwise')
        updateChart()


        
    })


    const updateChart = (() => {
        
        setRevenueChart((prevData:any) => ({
            ...prevData,
            series: [
                {
                    name: 'Total',
                    data: total,
                },
                {
                    name: 'Paid Amount',
                    data: paid,
                },
                {
                    name: 'Unpaid Amount',
                    data: unpaid,
                },
            ],
          }));

 

        console.log(expenseMonthWise)

        setExpenseChart({
            series: [
                {
                    name: 'Amount',
                    data: expenseMonthWise,
                }          
            ],
            options: {
                chart: {
                    height: 325,
                    type: 'area',
                    fontFamily: 'Nunito, sans-serif',
                    zoom: {
                        enabled: false,
                    },
                    toolbar: {
                        show: false,
                    },
                },

                dataLabels: {
                    enabled: false,
                },
                stroke: {
                    show: true,
                    curve: 'smooth',
                    width: 2,
                    lineCap: 'square',
                },
                dropShadow: {
                    enabled: true,
                    opacity: 0.2,
                    blur: 10,
                    left: -7,
                    top: 22,
                },
                colors: isDark ? ['#2196F3', '#E7515A', '#e670f8'] : ['#1B55E2', '#E7515A', '#e670f8'],
                markers: {
                    discrete: [
                        {
                            seriesIndex: 0,
                            dataPointIndex: 6,
                            fillColor: '#1B55E2',
                            strokeColor: 'transparent',
                            size: 7,
                        }
                    ],
                },
                labels: monthName,
                xaxis: {
                    axisBorder: {
                        show: false,
                    },
                    axisTicks: {
                        show: false,
                    },
                    crosshairs: {
                        show: true,
                    },
                    labels: {
                        offsetX: isRtl ? 2 : 0,
                        offsetY: 5,
                        style: {
                            fontSize: '12px',
                            cssClass: 'apexcharts-xaxis-title',
                        },
                    },
                },
                yaxis: {
                    tickAmount: 7,
                    labels: {
                        formatter: (value: number) => {
                            return value;
                        },
                        offsetX: isRtl ? -30 : -10,
                        offsetY: 0,
                        style: {
                            fontSize: '12px',
                            cssClass: 'apexcharts-yaxis-title',
                        },
                    },
                    opposite: isRtl ? true : false,
                },
                grid: {
                    borderColor: isDark ? '#191E3A' : '#E0E6ED',
                    strokeDashArray: 5,
                    xaxis: {
                        lines: {
                            show: false,
                        },
                    },
                    yaxis: {
                        lines: {
                            show: true,
                        },
                    },
                    padding: {
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                    },
                },
                legend: {
                    position: 'top',
                    horizontalAlign: 'right',
                    fontSize: '16px',
                    markers: {
                        width: 10,
                        height: 10,
                        offsetX: -2,
                    },
                    itemMargin: {
                        horizontal: 10,
                        vertical: 5,
                    },
                },
                tooltip: {
                    marker: {
                        show: true,
                    },
                    x: {
                        show: false,
                    },
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shadeIntensity: 1,
                        inverseColors: !1,
                        opacityFrom: isDark ? 0.19 : 0.28,
                        opacityTo: 0.05,
                        stops: isDark ? [100, 100] : [45, 100],
                    },
                },
            },
        });
        console.log(payments_sum,"---------------------mk----------------")

        setsalesByCategory((prevData) => ({
            ...prevData,
            series: invoiceMonthData,
            options:{
                chart: {
                    type: 'donut',
                    height: 460,
                    fontFamily: 'Nunito, sans-serif',
                },
                dataLabels: {
                    enabled: false,
                },
                stroke: {
                    show: true,
                    width: 25,
                    colors: isDark ? '#0e1726' : '#fff',
                },
                colors: isDark ? ['#5c1ac3', '#e2a03f', '#e7515a', '#e2a03f'] : ['#e2a03f', '#5c1ac3', '#e7515a'],
                legend: {
                    position: 'bottom',
                    horizontalAlign: 'center',
                    fontSize: '14px',
                    markers: {
                        width: 10,
                        height: 10,
                        offsetX: -2,
                    },
                    height: 50,
                    offsetY: 20,
                },
                plotOptions: {
                    pie: {
                        donut: {
                            size: '65%',
                            background: 'transparent',
                            labels: {
                                show: true,
                                name: {
                                    show: true,
                                    fontSize: '29px',
                                    offsetY: -10,
                                },
                                value: {
                                    show: true,
                                    fontSize: '26px',
                                    color: isDark ? '#bfc9d4' : undefined,
                                    offsetY: 16,
                                    formatter: (val: any) => {
                                        return val;
                                    },
                                },
                                total: {
                                    show: true,
                                    label: 'Total Amount',
                                    color: '#888ea8',
                                    fontSize: '29px',
                                    formatter: (w: any) => {
                                        return payments_sum
                                    },
                                },
                            },
                        },
                    },
                },
                labels: ['Total Amount', 'Paid Amount', 'Unpaid Amount'],
                states: {
                    hover: {
                        filter: {
                            type: 'none',
                            value: 0.15,
                        },
                    },
                    active: {
                        filter: {
                            type: 'none',
                            value: 0.15,
                        },
                    },
                },
            }
            
          }));

 

    })


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



    //Revenue Chart





    // useEffect(() => {
    //   if (editRecord) {
    //     setDrawerTitle("Edit Expense")
    //   } else {
    //     setDrawerTitle("Create Expense")
    //   }
    // }, [])

    // drawer
    const showDrawer = (record: any) => {
        if (record) {
            setEditRecord(record)
            form.setFieldsValue(record)
            setDrawerTitle("Edit Expense")
        } else {
            setEditRecord(null)
            form.resetFields()
            setDrawerTitle("Create Expense")
        }
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
        form.resetFields()
    };

    const columns = [
        {
            title: 'Expense Name',
            dataIndex: 'expense_name',
            key: 'expense_name',
        },
        {
            title: 'CreatedAt',
            dataIndex: 'created_date',
            key: 'created_date',
            render: (text: any, record: any) => {
                // Assuming created_date is in the format: 2023-12-12T08:41:09.567980Z
                const date = new Date(text);
                const formattedDate = new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                }).format(date);

                return <span>{formattedDate}</span>;
            },
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
                    {
                        localStorage.getItem('admin') === 'true' ? (
                            <DeleteOutlined
                                style={{ color: "red", cursor: "pointer" }}
                                onClick={() => handleDelete(record)}
                                className='delete-icon'
                                rev={undefined}
                            />
                        ) : (
                            <DeleteOutlined
                                style={{ display: "none" }}
                                onClick={() => handleDelete(record)}
                                className='delete-icon'
                                rev={undefined}
                            />
                        )
                    }



                </Space>
            ),
        }
    ];




    const [filterData, setFilterData] = useState(dataSource)


    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    type FieldType = {
        expense_name?: string;
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
                label: "Expense Name:",
                value: viewRecord?.expense_name || "N/A",
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
                <ul className="flex space-x-2 rtl:space-x-reverse font-bold">
                    <li>
                        <span className="text-lg">Dashboard</span>
                    </li>

                </ul>
                <div className="pt-5">
                    <div className="mb-6 grid grid-cols-1 gap-6 text-white sm:grid-cols-2 xl:grid-cols-4">
                        <div className="panel bg-gradient-to-r from-cyan-500 to-cyan-400">
                            <div className="flex justify-between">
                                <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Customer</div>

                            </div>
                            <div className="mt-5 flex items-center">
                                <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">Total : {customerCount} </div>

                            </div>
                            <div className="mt-5 flex items-center font-semibold">
                                <IconEye className="ltr:mr-2 rtl:ml-2 shrink-0" />
                                This month added : {thisMonthcustomerCount}
                            </div>
                        </div>

                        {/* Sessions */}
                        <div className="panel bg-gradient-to-r from-violet-500 to-violet-400">
                            <div className="flex justify-between">
                                <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Invoices</div>
                                <div className="dropdown">

                                </div>
                            </div>
                            <div className="mt-5 flex items-center">
                                <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">Total : {invoiceTotal} </div>

                            </div>
                            <div className="mt-5 flex items-center font-semibold">
                                <IconEye className="ltr:mr-2 rtl:ml-2 shrink-0" />
                                This Month Created : {invoiceThisMonthTotal}
                            </div>
                        </div>

                        {/*  Time On-Site */}
                        <div className="panel bg-gradient-to-r from-blue-500 to-blue-400">
                            <div className="flex justify-between">
                                <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Expense</div>
                            </div>
                            <div className="mt-5 flex items-center">
                                <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> Total : {expenseTotal} </div>

                            </div>
                            <div className="mt-5 flex items-center font-semibold">
                                <IconEye className="ltr:mr-2 rtl:ml-2 shrink-0" />
                                This Month added :  {expenseThisMonthTotal}
                            </div>
                        </div>

                        {/* Bounce Rate */}
                        <div className="panel bg-gradient-to-r from-fuchsia-500 to-fuchsia-400">
                            <div className="flex justify-between">
                                <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Pending Payment</div>
                                <div className="dropdown">

                                </div>
                            </div>
                            <div className="mt-5 flex items-center">
                                <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">Amount : {pending_payment} </div>

                            </div>
                            <div className="mt-5 flex items-center font-semibold">
                                <IconEye className="ltr:mr-2 rtl:ml-2 shrink-0" />
                                This Month : {pending_payment_this_month}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                        {/*  Favorites  */}
                        <div>
                            <div className="mb-5 flex items-center font-bold">
                                <span className="text-lg">Payment</span>
                            </div>
                            <div className="panel h-full xl:col-span-2">

                                <div className="relative">
                                    <div className="rounded-lg bg-white dark:bg-black">
                                        {isMounted ? (
                                            <ReactApexChart  series={revenueChart.series} options={revenueChart.options} type="area" height={325} width={'100%'} />
                                        ) : (
                                            <div className="grid min-h-[325px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                                <span className="inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white"></span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*  Prices  */}
                        <div>

                            <div className="panel h-full">
                                <div className="mb-5 flex items-center">
                                    <h5 className="text-lg font-semibold dark:text-white-light">{thisMonthName} Payment</h5>
                                </div>
                                <div>
                                    <div className="rounded-lg bg-white dark:bg-black">
                                        {isMounted ? (
                                            <ReactApexChart series={salesByCategory.series} options={salesByCategory.options} type="donut" height={460} width={'100%'} />
                                        ) : (
                                            <div className="grid min-h-[325px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                                <span className="inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white"></span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-12">
                        <div className="panel h-full w-full">
                            <div className="mb-5 flex items-center justify-between">
                                <h5 className="text-lg font-semibold dark:text-white-light">Recent Invoices</h5>
                            </div>
                            <div className="table-responsive">
                                <table>
                                    <thead>
                                        <tr>
                                        <th className="ltr:rounded-l-md rtl:rounded-r-md">Customer</th>
                                            <th>Invoice No</th>
                                            <th>Amount</th>
                                            <th>Balance</th>
                                            <th className="ltr:rounded-r-md rtl:rounded-l-md">Project Name</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoices.map((item, rowIndex) => (
                                            <tr key={rowIndex} className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                                <td>{item.customer}</td>
                                                <td>{item.invoice_no}</td>
                                                <td>{item.total_amount}</td>
                                                <td>{item.balance}</td>
                                                <td>{item.project_name}</td>
                                            </tr>
                                        ))}                                        
                                    </tbody>
                                </table>
                            </div>
                        </div>  
                    </div>


                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                        {/*  Favorites  */}
                        <div>
                            <div className="mb-5 flex items-center font-bold">
                                <span className="text-lg">Expense - ({expense_amount_sum})</span>
                            </div>
                            <div className="panel h-full xl:col-span-2">

                                <div className="relative">
                                    <div className="rounded-lg bg-white dark:bg-black">
                                        {isMounted ? (
                                            <ReactApexChart series={expenseChart.series} options={expenseChart.options} type="area" height={325} width={'100%'} />
                                        ) : (
                                            <div className="grid min-h-[325px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                                <span className="inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white"></span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*  Prices  */}
                        <div>

                            <div className="panel h-full">

                            <div className="panel h-full w-full">
                            <div className="mb-5 flex items-center justify-between">
                                <h5 className="text-lg font-semibold dark:text-white-light">Recent Expenses</h5>
                            </div>
                            <div className="table-responsive">
                                <table>
                                    <thead>
                                        <tr>
                                        <th className="ltr:rounded-l-md rtl:rounded-r-md">Expense User</th>
                                            <th>Date</th>
                                            <th>Category</th>
                                            <th>Amount</th>
                                            
                                         
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {expenses.map((item, rowIndex) => (
                                            <tr key={rowIndex} className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                                <td>{item.expense_user}</td>
                                                <td>{item.date}</td>
                                                <td>{item.expense_category_name}</td>
                                              
                                                <td>{item.amount}</td>
                                            </tr>
                                        ))}                                        
                                    </tbody>
                                </table>
                            </div>
                        </div>  
                            {/*
                                <div className="mb-5 flex items-center">
                                    <h5 className="text-lg font-semibold dark:text-white-light">{thisMonthName} Expense</h5>
                                </div>
                                <div>
                                    <div className="rounded-lg bg-white dark:bg-black">
                                        {isMounted ? (
                                            <ReactApexChart series={salesByCategory.series} options={salesByCategory.options} type="donut" height={460} width={'100%'} />
                                        ) : (
                                            <div className="grid min-h-[325px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                                <span className="inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white"></span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                */} 

                             
                            </div>

                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-12">
                       
                    </div>
                </div>
            </div>
        </>
    )
}

export default Expense