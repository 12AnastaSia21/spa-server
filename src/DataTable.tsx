import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
  GridSlots,
} from "@mui/x-data-grid";
import {
  randomId,
} from "@mui/x-data-grid-generator";

//const roles = ['Market', 'Finance', 'Development'];
//const randomRole = () => {
//    return randomArrayItem(roles);
//};

const initialRows: GridRowsProp = [
  {
    id: randomId(),
    companySigDate: 676,
    companySignatureName: "ffj",
    documentName: "randomCreatedDate",
    documentStatus: "ddddd",
    documentType: "sss",
    employeeNumber: 11,
    employeeSigDate: 99,
    employeeSignatureName: "jk",
  },
  {
    id: randomId(),
    companySigDate: 8865,
    companySignatureName: "ffj",
    documentName: "randomCreatedDate",
    documentStatus: "ddddd",
    documentType: "sss",
    employeeNumber: 11,
    employeeSigDate: 99,
    employeeSignatureName: "jk",
  },
  {
    id: randomId(),
    companySigDate: 3563,
    companySignatureName: "ffj",
    documentName: "randomCreatedDate",
    documentStatus: "ddddd",
    documentType: "sss",
    employeeNumber: 11,
    employeeSigDate: 99,
    employeeSignatureName: "jk",
  },
  {
    id: randomId(),
    companySigDate: 635,
    companySignatureName: "ffj",
    documentName: "randomCreatedDate",
    documentStatus: "ddddd",
    documentType: "sss",
    employeeNumber: 11,
    employeeSigDate: 99,
    employeeSignatureName: "jk",
  },
  {
    id: randomId(),
    companySigDate: 326,
    companySignatureName: "ffj",
    documentName: "randomCreatedDate",
    documentStatus: "ddddd",
    documentType: "sss",
    employeeNumber: 11,
    employeeSigDate: 99,
    employeeSignatureName: "jk",
  },
  {
    id: randomId(),
    companySigDate: 2562,
    companySignatureName: "ffj",
    documentName: "randomCreatedDate",
    documentStatus: "ddddd",
    documentType: "sss",
    employeeNumber: 11,
    employeeSigDate: 99,
    employeeSignatureName: "jk",
  },
  {
    id: randomId(),
    companySigDate: 2626,
    companySignatureName: "ffj",
    documentName: "randomCreatedDate",
    documentStatus: "ddddd",
    documentType: "sss",
    employeeNumber: 11,
    employeeSigDate: 99,
    employeeSignatureName: "jk",
  },
];

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => any;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => any;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [...oldRows, { id, name: "", age: "", isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

export default function FullFeaturedCrudGrid() {
  const [rows, setRows] = React.useState(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

   const handleDeleteClick = (id: GridRowId) => () => {
        setRows(rows.filter((row) => row.id !== id));
    };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

     const editedRow = rows.find((row) => row.id === id);
            if (editedRow!.isNew) {
                setRows(rows.filter((row) => row.id !== id));
            }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
            const updatedRow = { ...newRow, isNew: false };
            setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
            return updatedRow;
        };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    {
      field: "companySigDate",
      headerName: "Дата создания компании",
      type: "number",
      flex: 11.1,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "companySignatureName",
      headerName: "Название компании",
      type: "string",
      flex: 11.1,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "documentName",
      headerName: "Название документа",
      type: "string",
      flex: 11.1,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "documentStatus",
      headerName: "Статус документа",
      type: "string",
      flex: 11.1,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "documentType",
      headerName: "Тип документа",
      type: "string",
      flex: 11.1,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "employeeNumber",
      headerName: "Номер сотрудника",
      type: "number",
      flex: 11.1,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "employeeSigDate",
      headerName: "Дата регистрации сотрудника",
      type: "number",
      flex: 11.1,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "employeeSignatureName",
      headerName: "Подпись сотрудника",
      type: "string",
      flex: 11.1,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Действие",
      flex: 11.1,
      align: "left",
      headerAlign: "left",
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        height: 500,
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar as GridSlots["toolbar"],
        }}
        slotProps={{
              toolbar: { setRows, setRowModesModel },
        }}
      />
    </Box>
  );
}
