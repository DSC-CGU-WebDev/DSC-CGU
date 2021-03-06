import React, { useState, useEffect } from 'react'
import Dashboard from './Dashboard'
import Header from './Header'
import NavBar from './NavBar'
import { firestore } from 'firebase/app'
import { TableContainer, TableBody, TableCell, TableHead, TableRow, Table } from '@material-ui/core'
import TablePagination from "@material-ui/core/TablePagination";
import { Button, Spinner } from 'react-bootstrap'

const Users = () => {
    useEffect(() => {
        document.title = "Admin | Users";
    }, []);

    const [userArr, setUserArr] = useState([]);
    const tempArr = [];
    let [loading, setLoading] = useState(false);

    const fetchData = () => {
        setLoading(true);
        firestore().collection('User Data').orderBy('timestamp', 'desc').get()
            .then((snapshot) => {
                snapshot.docs.forEach(doc => {
                    tempArr.push({
                        name: doc.data().Name,
                        email: doc.data().Email,
                        college: doc.data().CollegeName,
                        stream: doc.data().Stream
                    })
                });
                setUserArr(tempArr);
                setLoading(false);
            }).catch(err => {
                setLoading(false);
                console.log(err);
            });
    }

    //table pagination
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div>
            <NavBar />
            <Header name='Users' />
            <section id="breadcrumb">
                <div className="container">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/dashboard">Dashboard</a></li>
                        <li className="breadcrumb-item active">Users</li>
                    </ol>
                </div>
            </section>
            <section id="main">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3">
                            <Dashboard />
                        </div>
                        <div className="col-md-9">
                            {/* <!-- Website Overview --> */}
                            <div className="card-header main-color-bg">
                                <h5 className="card-title mb-0">Users</h5>
                            </div>
                            {
                                loading ?
                                    <Button className="btn main-color-bg btn-block my-2" disabled><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /><span className='ml-2'>Fetching...</span></Button> :
                                    <button className="btn main-color-bg btn-block my-2" type='button' onClick={fetchData}>Fetch Data</button>
                            }
                            <div className="card">
                                <div className="card-body">
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell className="font-weight-bold">Ṇame</TableCell>
                                                    <TableCell className="font-weight-bold">Email</TableCell>
                                                    <TableCell className="font-weight-bold">Stream</TableCell>
                                                    <TableCell className="font-weight-bold">College</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {userArr.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(user => {
                                                    return (
                                                        <TableRow key={user.email}>
                                                            <TableCell>{user.name}</TableCell>
                                                            <TableCell>{user.email}</TableCell>
                                                            <TableCell>{user.stream}</TableCell>
                                                            <TableCell>{user.college}</TableCell>
                                                        </TableRow>
                                                    )
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25, 100]}
                                        component="div"
                                        count={userArr.length}
                                        page={page}
                                        onChangePage={handleChangePage}
                                        rowsPerPage={rowsPerPage}
                                        onChangeRowsPerPage={handleChangeRowsPerPage}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer id="footer">
                <p>&copy; 2020 Developer Student Clubs CVRGU</p>
            </footer>
        </div>
    )
}

export default Users
