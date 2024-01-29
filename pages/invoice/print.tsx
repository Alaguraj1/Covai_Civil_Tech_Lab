import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router';

const Print = () => {
    const router = useRouter();
    const { id } = router.query;

    const [invoiceReport, setInvoiceReport] = useState<any>([])
const [finalHtml, setFinalHtml] = useState<any>()

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

    console.log("invoiceReport", invoiceReport?.invoice_test?.report_template)

    useEffect(() => {
        getTestReport();
    }, [id]);

    useEffect(() => {
        const table = invoiceReport?.invoice_test?.report_template;
    
        // Check if table is defined before further processing
        if (table) {
            let tempDiv = document.createElement('div');
            tempDiv.innerHTML = table;
    
            // Find all table elements
            let tableElements = tempDiv.querySelectorAll('table, tr, td, th');
    
            let TableElement2 = tempDiv.querySelectorAll('table')
            // Get the last table element
            let lastTable = TableElement2[TableElement2.length - 1];
    
            // Loop through all table elements and update the styles
            tableElements.forEach((tableElement:any) => {
                // Check if the current table is not the last one
                if (tableElement !== lastTable) {
                    tableElement.style.border = "1px solid black";
                } else {
                    // If it's the last table, set border to red
                    tableElement.style.border = "1px solid red";
                }
            });
    
            let figureElements = tempDiv.querySelectorAll('figure');
            figureElements.forEach((figureElement:any) => {
                figureElement.style.width = "100%"; // Set the width to 100%
                figureElement.style.marginBottom = "20px";
            });

            let headingElements = tempDiv.querySelectorAll('h1, h2, h3, h4');
            headingElements.forEach((headingElement:any) => {
                headingElement.style.textAlign = "center"; // Set the width to 100%
                // headingElement.style.marginBottom = "20px";
            });
    
            // Now, you can use tempDiv.innerHTML to get the updated HTML content
            const updatedHTML = tempDiv.innerHTML;
            console.log('✌️updatedHTML --->', updatedHTML);
            setFinalHtml(updatedHTML);
        }
    }, [invoiceReport?.invoice_test?.report_template]);
    
    


return (
    <>
        <div style={{ padding: "50px 100px" }}>
            <div dangerouslySetInnerHTML={{ __html: finalHtml }}></div>
        </div>
    </>
)
}

export default Print