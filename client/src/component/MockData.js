import React, { useState, useEffect } from 'react';
import './mockData.css'

let totalData, limit = 5, totalPage;
const MockData = () => {
    // store api data
    const [data, setData] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [editedData, setEditedData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchData = async (page) => {
        try {
            const response = await fetch(`http://localhost:3005/api/items?page=${page}&limit=${limit}`);
            const responseData = await response.json();
            // console.log(responseData)
            setData(responseData.data);
            totalData = responseData.total;
            totalPage = responseData.totalPage;
            console.log(responseData.data.length);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage]);


    const handleNextPage = () => {
        if (currentPage < totalPage) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };


    const handleCheckboxChange = (itemId) => {
        setData((prevData) => {
            const updatedData = prevData.map((item) => {
                if (item.id === itemId) {
                    return { ...item, checked: !item.checked };
                }
                return item;
            });
            return updatedData;
        });
    };


    // const handleSelectAllChange = (event) => {
    //     const isChecked = event.target.checked;
    //     setSelectAll(isChecked);
    //     const newCheckedItems = {};
    //     data.forEach((item) => {
    //         newCheckedItems[item.id] = isChecked;
    //     });
    //     setCheckedItems(newCheckedItems);
    // };

    const handleAmountChange = (event, id, initialAmount) => {
        let newAmount = event.target.value;
        // check empty input - should be handled in a better way
        if (newAmount === "") newAmount = "0";
        if (newAmount < initialAmount) {
            setEditedData((prevEditedData) => {
                const newData = prevEditedData.find((item) => item.id === id);
                if (newData) {
                    newData.amount = newAmount;
                } else {
                    prevEditedData.push({ id, amount: newAmount });
                }
                return [...prevEditedData];
            });
        }
    };

    const handleFormSubmit = async () => {
        try {
            // Make API calls to update the data
            // for (const editedItem of editedData) {
            await fetch(`http://localhost:3005/api/items/edit`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ list: data }), // Include the 'id' to identify the resource
            });
            // }
            // Refresh the data after successful update
            window.location.reload();
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    console.log(data);
    return (
        <>
            <button onClick={handleFormSubmit}>Submit</button>
            <div className='container'>
                <table>
                    <thead>
                        <tr>
                            {/* <th><input type='checkbox' checked={selectAll} onChange={handleSelectAllChange} style={{ scale: "1.5" }} /></th> */}
                            <th>Id</th>
                            <th>Name</th>
                            <th>Amount</th>
                            <th>Initial</th>
                            <th>Purchase Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={item.checked}
                                            onChange={() => handleCheckboxChange(item.id)}
                                        />
                                    </td>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td><input type='text' value={editedData.find((editedItem) => editedItem.id === item.id)?.amount || item.amount}
                                        onChange={(event) => handleAmountChange(event, item.id, item.initialAmount)}
                                    /></td>
                                    <td>{item.initialAmount}</td>
                                    <td>{item.purchaseDate}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            <p>Total Items: {totalData} (showing:{data.length})</p>
            <button onClick={handlePreviousPage} disabled={currentPage === 1} className={`${currentPage === 1 ? 'disabled' : ''}`}>
                Previous
            </button>
            <span>Page {currentPage} of {totalPage}</span>
            <button onClick={handleNextPage} disabled={currentPage === totalPage} className={`${currentPage === totalPage ? 'disabled' : ''}`}>
                Next
            </button>
        </>

    )
}

export default MockData;