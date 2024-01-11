import React, { useState, useEffect } from 'react'
import { Table, Button, Space } from 'antd';
import { Input } from 'antd';
import axios from "axios"
import ExcelJS from "exceljs";
import * as FileSaver from "file-saver";


const ExpenseReport = () => {

  const { Search } = Input;
  const [dataSource, setDataSource] = useState([])
  const [filterData, setFilterData] = useState(dataSource)


  // get GetExpenseReport datas

  useEffect(() => {
    GetExpenseReport()
  }, [])

  const GetExpenseReport = (() => {
    const Token = localStorage.getItem("token")

    axios.get("http://files.covaiciviltechlab.com/expense_report/", {
      headers: {
        "Authorization": `Token ${Token}`
      }
    }).then((res) => {
      setDataSource(res.data.reports)
      setFilterData(res.data.reports)
    }).catch((error: any) => {
      console.log(error)
    })
  })


  // Table Headers
  const columns = [
    {
      title: 'Expense User',
      dataIndex: 'expense_user',
      key: 'expense_user',
    },
    {
      title: 'Expense Category',
      dataIndex: 'expense_category',
      key: 'expense_category',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Narration',
      dataIndex: 'narration',
      key: 'narration',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
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
  ]

  // input search
  const inputChange = ((e: any) => {
    const SearchValue = e.target.value

    const filteredData = dataSource.filter((item: any) => {
      return (
        item?.narration?.toLowerCase().includes(SearchValue.toLowerCase())
      )
    })
    setFilterData(filteredData)
  })



  // export to excel format
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");


    // Add header row
    worksheet.addRow(columns.map((column) => column.title));

    // Add data rows
    filterData.forEach((row: any) => {
      worksheet.addRow(columns.map((column: any) => row[column.dataIndex]));
    });

    // Generate a Blob containing the Excel file
    const blob = await workbook.xlsx.writeBuffer();

    // Use file-saver to save the Blob as a file
    FileSaver.saveAs(
      new Blob([blob], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "Expense-Report.xlsx"
    );
  };


  return (
    <>
      <div  className='panel'>
        <div className='tax-heading-main'>
          <div>
            <h1 className='text-lg font-semibold dark:text-white-light'>Expense Report</h1>
          </div>
          <div>
            <Space>
              <Button type="primary" onClick={exportToExcel}>Export to Excel</Button>
              <Search placeholder="input search text" onChange={inputChange} enterButton className='search-bar' />
            </Space>
          </div>
        </div>
        <div  className='table-responsive'>
          <Table dataSource={filterData} columns={columns} pagination={false} />
        </div>
      </div>
    </>
  )
}

export default ExpenseReport