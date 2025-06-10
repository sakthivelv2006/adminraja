import { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './App.css';

function App() {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);

  // Fetch Bookings
  useEffect(() => {
    axios.get('https://aluminium-ulwg.onrender.com/api/bookings')
      .then(response => setBookings(response.data))
      .catch(error => console.error('Error fetching bookings:', error));
  }, []);

  // Fetch Users
  useEffect(() => {
    axios.get('https://aluminium-ulwg.onrender.com/api/users/getall')
      .then(response => {
        const data = response.data;
        setUsers(data.users || []); // ✅ Safe extraction
      })
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  // Handle Delete All Bookings
const handleDeleteAllBookings = () => {
  const confirmDelete = window.confirm('Are you sure you want to delete ALL bookings?');
  if (confirmDelete) {
    axios.delete('https://aluminium-ulwg.onrender.com/api/deleteall/bookings')
      .then(() => {
        alert('All bookings deleted successfully');
        setBookings([]); // clear bookings list from state
      })
      .catch(error => {
        console.error('Error deleting all bookings:', error);
        alert('Error deleting all bookings');
      });
  }
};

  // PDF: Bookings
  const downloadBookingsPDF = () => {
    const doc = new jsPDF();
    doc.text('Booking Details Report', 14, 15);

    const tableColumn = [
      'Name', 'Email', 'Phone', 'Address',
      'Type', 'Size', 'Material', 'Color', 'Install Date'
    ];

    const tableRows = bookings.map(b => ([
      b.name,
      b.email,
      b.phoneNumber,
      b.address || '-',
      b.doorOrWindow,
      b.size || '-',
      b.material,
      b.color,
      new Date(b.installationDate).toLocaleDateString(),
    ]));

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save('booking-details.pdf');
  };

  // PDF: Users
  const downloadUsersPDF = () => {
    const doc = new jsPDF();
    doc.text('All Users Report', 14, 15);

    const tableColumn = ['Name', 'Email', 'Password'];
    const tableRows = users.map(u => ([
      u.name,
      u.email,
      u.password
    ]));

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save('user-details.pdf');
  };

  // Handle Delete (frontend only)
  const handleDelete = (index) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (confirmDelete) {
      const updatedUsers = [...users];
      updatedUsers.splice(index, 1);
      setUsers(updatedUsers);
    }
  };

  // Handle Update (simplified example)
  const handleUpdate = (index) => {
    const updatedName = prompt('Enter new name:', users[index].name);
    const updatedEmail = prompt('Enter new email:', users[index].email);
    const updatedPassword = prompt('Enter new password:', users[index].password);

    if (updatedName && updatedEmail && updatedPassword) {
      const updatedUsers = [...users];
      updatedUsers[index] = {
        ...updatedUsers[index],
        name: updatedName,
        email: updatedEmail,
        password: updatedPassword
      };
      setUsers(updatedUsers);
    }
  };

  


  return (
    <div className="App" style={{ padding: '20px' }}>
      <h1>All Bookings</h1>

      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', marginBottom: '20px' }}>
        <thead style={{ backgroundColor: '#f0f0f0' }}>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Type</th>
            <th>Size</th>
            <th>Material</th>
            <th>Color</th>
            <th>Install Date</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b, index) => (
            <tr key={index}>
              <td>{b.name}</td>
              <td>{b.email}</td>
              <td>{b.phoneNumber}</td>
              <td>{b.address || '-'}</td>
              <td>{b.doorOrWindow}</td>
              <td>{b.size || '-'}</td>
              <td>{b.material}</td>
              <td>{b.color}</td>
              <td>{new Date(b.installationDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={downloadBookingsPDF} style={buttonStyle}>
        Download All Booking Details (PDF)
      </button>
<br></br>
<br></br>
      <button onClick={handleDeleteAllBookings} style={{ ...buttonStyle, backgroundColor: '#dc3545', marginLeft: '10px' }}>
  Delete All Bookings be careful we cant replace the data and we dont have any copy
</button>

      <hr style={{ margin: '40px 0' }} />

      <h1>All Users</h1>

      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', marginBottom: '20px' }}>
        <thead style={{ backgroundColor: '#f0f0f0' }}>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Password</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, index) => (
            <tr key={index}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.password}</td>
              <td>
                <button onClick={() => handleUpdate(index)} style={smallButtonStyle}>Update</button>
              </td>
              <td>
                <button onClick={() => handleDelete(index)} style={{ ...smallButtonStyle, backgroundColor: '#dc3545' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={downloadUsersPDF} style={buttonStyle}>
        Download All User Details (PDF)
      </button>

      
    </div>
  );
}

const buttonStyle = {
  padding: '10px 20px',
  fontSize: '16px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const smallButtonStyle = {
  padding: '6px 12px',
  fontSize: '14px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default App;
