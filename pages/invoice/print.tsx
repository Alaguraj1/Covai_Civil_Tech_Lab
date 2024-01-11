import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router';

const Print = () => {
    const router = useRouter();
    const { id } = router.query;

    const [invoiceReport, setInvoiceReport] = useState<any>([])


    const getTestReport = () => {
        if (id) {
            const Token = localStorage.getItem("token")

            axios.get(`http://files.covaiciviltechlab.com/edit_invoice_test_template/${id}/`, {
                headers: {
                    "Authorization": `Token ${Token}`
                }
            }).then((res) => {
                setInvoiceReport(res.data);
            }).catch((error) => {
                console.log(error);
            });
        }
    };

    useEffect(() => {
        getTestReport();
    }, [id]);


    return (
        <>
            <div style={{padding:"50px 100px"}}>
                <div dangerouslySetInnerHTML={{__html : invoiceReport?.invoice_test?.report_template}}></div>
            </div>
        </>
    )
}

export default Print