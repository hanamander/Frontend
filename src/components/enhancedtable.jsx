import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import { visuallyHidden } from '@mui/utils';

function descendingComparator(a, b, orderBy)
{
    if (b[orderBy] < a[orderBy])
    {
        return -1;
    }
    if (b[orderBy] > a[orderBy])
    {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy)
{
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator)
{
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) =>
    {
        const order = comparator(a[0], b[0]);
        if (order !== 0)
        {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: "id",
        numeric: false,
        disablePadding: true,
        label: "Ref.ID",
    },
    {
        id: "sn",
        disablePadding: false,
        align: "center",
        label: 'SN',
    },
    {
        id: "timestamp",
        disablePadding: false,
        label: "Date Time",
        minWidth: 140, // "2023.07.17_15:45:01" '-', ' ' 등이 들어가면 줄바꿈이 나타남.
    },
    {
        id: "data_filename",
        disablePadding: false,
        label: "Data Filename",
    },
    {
        id: "tags",
        disablePadding: false,
        label: "Tags",
    },
    {
        id: "score",
        disablePadding: false,
        label: "Score",
    },
];

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

function EnhancedTableHead(props)
{
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property) => (event) =>
    {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sx={{ minWidth: headCell.minWidth }}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

function EnhancedTableToolbar(props)
{
    const { numSelected } = props;

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                </Typography>
            )}
        </Toolbar>
    );
}

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable(props)
{
    const { rows, selectedItems, handleSelectedItems } = props;

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(7);

    const handleRequestSort = (event, property) =>
    {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) =>
    {
        if (event.target.checked)
        {
            const newSelected = rows.map(e => e.id);
            setSelected(newSelected);

            let newSelectedItems = [...selectedItems];
            for (const row of rows)
            {
                const found = newSelectedItems.find(newSelectedItem => row.id === newSelectedItem.id);
                if (!found) // 없는 아이템만 추가
                {
                    newSelectedItems.push(row);
                }
            }

            if (handleSelectedItems)
            {
                handleSelectedItems(newSelectedItems);
            }
        }
        else
        {
            setSelected([]);
            if (handleSelectedItems)
            {
                handleSelectedItems([]);
            }
        }
    };

    const handleClick = (event, id) =>
    {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1)
        {
            newSelected = newSelected.concat(selected, id);
        }
        else if (selectedIndex === 0)
        {
            newSelected = newSelected.concat(selected.slice(1));
        }
        else if (selectedIndex === selected.length - 1)
        {
            newSelected = newSelected.concat(selected.slice(0, -1));
        }
        else if (selectedIndex > 0)
        {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }

        setSelected(newSelected);

        //
        let newSelectedItems = selectedItems.filter(e => e.id !== id); // 기존 선택된 아이템들 중 같은 아이디가 있으면 제거
        if (selectedItems.length === newSelectedItems.length) // 같으면 추가
        {
            const foundRow = rows.find(e => e.id === id);
            newSelectedItems.push(foundRow);
        }

        if(handleSelectedItems)
        {
            handleSelectedItems(newSelectedItems);
        }
    };

    const handleChangePage = (event, newPage) =>
    {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) =>
    {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const visibleRows = React.useMemo(() =>
    {
        return stableSort(rows, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [rows, order, orderBy, page, rowsPerPage]);

    // 검색 버튼을 누르면 rows 갱신
    React.useEffect(() =>
    {
        setPage(0);
    }, [rows]);

    // 이전 선택된 아이템들의 아이디를 선택 상태로 변경
    React.useEffect(() =>
    {
        const searchPrevSelectedId = selectedItems.map(e => e.id);
        setSelected(searchPrevSelectedId);
    }, [selectedItems]);

    return (
        <Box sx={{ width: '100%' }}>
            <Paper elevation={0} sx={{ width: '100%', mb: 2 }} >
                <EnhancedTableToolbar numSelected={selected.length} />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {visibleRows.map((row, index) =>
                            {
                                const isItemSelected = isSelected(row.id);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) => handleClick(event, row.id)}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.id}
                                        selected={isItemSelected}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                                inputProps={{
                                                    'aria-labelledby': labelId,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell component="th" id={labelId} scope="row" padding="none">{row.id}</TableCell>
                                        <TableCell align="left">{row.serialNumber}</TableCell>
                                        <TableCell align="left">{row.timestamp}</TableCell>
                                        <TableCell align="left">{row.dataFilename}</TableCell>
                                        <TableCell align="left">{row.tags}</TableCell>
                                        <TableCell align="left">{row.score}</TableCell>
                                    </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: 53 * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[7]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
}