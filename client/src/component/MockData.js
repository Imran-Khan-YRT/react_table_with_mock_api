import React, { useState, useEffect } from 'react';
import './mockData.css'

const MockData = () => {
    // store api data
    const [data, setData] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [checkedItems, setCheckedItems] = useState([]);
    const [editedData, setEditedData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://my.api.mockaroo.com/table_data.json?key=d0de7900")
                const responseData = await response.json();
                console.log(responseData)
                setData(responseData);
                const initialCheckedItems = {};
                responseData.forEach((item) => {
                    initialCheckedItems[item.id] = item.checked;
                });
                setCheckedItems(initialCheckedItems);
                console.log(initialCheckedItems)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, []);

    const handleCheckboxChange = (event, id) => {
        const isChecked = event.target.checked;
        setCheckedItems((prevCheckedItems) => ({
            ...prevCheckedItems,
            [id]: isChecked,
        }));
    };

    const handleSelectAllChange = (event) => {
        const isChecked = event.target.checked;
        setSelectAll(isChecked);
        const newCheckedItems = {};
        data.forEach((item) => {
            newCheckedItems[item.id] = isChecked;
        });
        setCheckedItems(newCheckedItems);
    };

    const handleAmountChange = (event, id) => {
        const newAmount = event.target.value;
        setEditedData((prevEditedData) => {
            const newData = prevEditedData.find((item) => item.id === id);
            if (newData) {
                newData.amount = newAmount;
            } else {
                prevEditedData.push({ id, amount: newAmount });
            }
            return [...prevEditedData];
        });
    };

    const handleFormSubmit = async () => {
        try {
            // Make API calls to update the data
            for (const editedItem of editedData) {
                await fetch(`https://my.api.mockaroo.com/table_data?key=d0de7900`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: editedItem.id, amount: editedItem.amount }), // Include the 'id' to identify the resource
                });
            }
            // Refresh the data after successful update
            window.location.reload();
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };


    return (
        <>
            <button onClick={handleFormSubmit}>Submit</button>
            <table>
                <thead>
                    <tr>
                        <th><input type='checkbox' checked={selectAll} onChange={handleSelectAllChange} /></th>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Purchase Date</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((item) => (
                            <tr key={item.id}>
                                <td><input type="checkbox" checked={checkedItems[item.id] || false} onChange={(event) => handleCheckboxChange(event, item.id)} /></td>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td><input type='text' value={editedData.find((editedItem) => editedItem.id === item.id)?.amount || item.amount}
                                    onChange={(event) => handleAmountChange(event, item.id)}
                                /></td>
                                <td>{item.purchaseDate}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

        </>

    )
}

export default MockData;