import React, {useState, useEffect} from 'react';
import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import fetch from './pointsData';
import moment from 'moment'
import {calculateResults} from './utils/calculate'
import {columns} from './utils/constants'
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputLabel from '@material-ui/core/InputLabel';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
  containerDate: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function RewardsTable() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [transactionData, setTransactionData] = useState(null);
  const [pointsList, setPointList] = useState([])
  const [state, setState] = React.useState({
    month: '',
    name: '1',
  });
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChange = (event) => {
    const name = event.target.name;
    setState({
      ...state,
      [name]: event.target.value,
    });
    filterData(pointsList, event.target.value)
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  
  useEffect(() => {
    fetch().then((data)=> {
        setPointList([...data])
        filterData(data, 1)
    });
  },[]);

  function filterData (data, month) {
    let today = moment();
    let yesterday = moment().subtract(month, 'months');
    let filteredDataList = [];
    data.map(item=> {
      if (moment(item.transactionDate).isAfter(yesterday) &&  moment(item.transactionDate).isBefore(moment(today))){
        filteredDataList.push(item);
      }
    })
    const results = calculateResults(filteredDataList);
    setTransactionData(results);
  }

  function subTotal (rows) {
    return rows.pointsPerTransaction.map(({ points }) => points).reduce((sum, i) => sum + i, 0);
  }

  return (
    <div className="App">
        <div className="app-width">
            <header className="App-header">
                <FormControl className={classes.formControl}>
                    <InputLabel shrink htmlFor="age-native-label-placeholder">
                        No. of Months
                    </InputLabel>
                    <NativeSelect
                    value={state.age}
                    onChange={handleChange}
                    inputProps={{
                        name: 'month',
                        id: 'age-native-label-placeholder',
                    }}
                    >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    </NativeSelect>
                    <FormHelperText>Label + placeholder</FormHelperText>
                </FormControl>
                <Paper className={classes.root}>
                    <TableContainer className={classes.container}>
                        <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                key={column.id}
                                align={column.align}
                                style={{ minWidth: column.minWidth }}
                                >
                                {column.label}
                                </TableCell>
                            ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactionData != null && transactionData.pointsPerTransaction.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                {columns.map((column) => {
                                    const value = row[column.id];
                                    return (
                                    <TableCell key={column.id} align={column.align}>
                                        {value}
                                    </TableCell>
                                    );
                                })}
                                </TableRow> 
                            );
                            })}
                            {transactionData != null && <TableRow>
                            <TableCell rowSpan={3} />
                            <TableCell colSpan={2}>Subtotal</TableCell>
                            <TableCell>{subTotal(transactionData)}</TableCell>
                            </TableRow>}
                        </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={transactionData != null && transactionData.pointsPerTransaction.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </Paper>
            </header>
        </div>
    </div>
  );
}

export default RewardsTable;
