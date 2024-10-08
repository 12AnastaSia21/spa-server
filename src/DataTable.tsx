import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";
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
import { randomId } from "@mui/x-data-grid-generator";
import { useAuth } from "./TokenContext";
import "./DataTable.css";

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => any;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => any;
  authToken: string;
}

//Добавление новой записи в таблицу
function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel, authToken } = props;

  const handleClick = () => {
    const tempId = randomId();
    const newRow = {
      id: tempId,
      companySigDate: new Date().toISOString(),
      companySignatureName: "Название компании",
      documentName: "Название документа",
      documentStatus: "Статус",
      documentType: "Тип документа",
      employeeNumber: "Номер сотрудника",
      employeeSigDate: new Date().toISOString(),
      employeeSignatureName: "Подпись",
    };

    setRows((oldRows) => [...oldRows, newRow]);

    axios
      .post(
        "https://test.v5.pryaniky.com/ru/data/v3/testmethods/docs/userdocs/create",
        newRow,
        {
          headers: {
            "x-auth": authToken,
          },
        }
      )
      .then((response) => {
        const realId = response.data.data.id;
        console.log("Запись успешно создана:", response.data);

        setRows((oldRows) =>
          oldRows.map((row) =>
            row.id === tempId ? { ...row, id: realId, isNew: false } : row
          )
        );

        setRowModesModel((oldModel) => ({
          ...oldModel,
          [realId]: {
            mode: GridRowModes.Edit,
            fieldToFocus: "companySigDate",
          },
        }));
      })
      .catch((error) => {
        console.error("Ошибка при создании записи:", error);

        // В случае ошибки удаляем временную строку
        setRows((oldRows) => oldRows.filter((row) => row.id !== tempId));
      });
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Добавить запись
      </Button>
    </GridToolbarContainer>
  );
}

export default function DataTable() {
  const [rows, setRows] = React.useState<GridRowsProp>([]);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const { authToken } = useAuth();

  useEffect(() => {
    if (!authToken) {
      console.error("No auth token found!");
      return;
    }

    setLoading(true);
    axios
      .get(
        "https://test.v5.pryaniky.com/ru/data/v3/testmethods/docs/userdocs/get",
        {
          headers: {
            "x-auth": authToken,
          },
        }
      )
      .then((response) => {
        setRows(response.data.data);
        console.log("Data fetched:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [authToken]);

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

  //Сохранение измененных данных
  const handleSaveClick = (id: GridRowId) => () => {
    const rowToUpdate = rows.find((row) => row.id === id);
    if (!rowToUpdate) return;

    processRowUpdate(rowToUpdate)
      .then((updatedRow) => {
        setRowModesModel({
          ...rowModesModel,
          [id]: { mode: GridRowModes.View },
        });
        setRows((oldRows) =>
          oldRows.map((row) => (row.id === id ? updatedRow : row))
        );
      })
      .catch((error) => {
        console.error("Error updating record:", error);
      });
  };

  //Запрос на удаление данных из таблицы
  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id));
    axios
      .post(
        `https://test.v5.pryaniky.com/ru/data/v3/testmethods/docs/userdocs/delete/${id}`,
        undefined,
        {
          headers: {
            "x-auth": authToken,
          },
        }
      )
      .then((response) => {
        console.log("Record deleted:", response.status);
        setRows((oldRows) => oldRows.filter((row) => row.id !== id));
      })
      .catch((error) => {
        console.log("Error deleting record:", error);
      });
  };

  //Отмена изменения данных
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

  //Запрос на изменение данных
  const processRowUpdate = async (newRow: GridRowModel) => {
    try {
      const response = await axios.post(
        `https://test.v5.pryaniky.com/ru/data/v3/testmethods/docs/userdocs/set/${newRow.id}`,
        { ...newRow, isNew: false },
        {
          headers: {
            "x-auth": authToken,
          },
        }
      );

      console.log("Record updated:", response.status);
      return { ...newRow, isNew: false };
    } catch (error: any) {
      console.error(
        "Error updating record:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    {
      field: "companySigDate",
      headerName: "Дата создания компании",
      flex: 12,
      valueGetter: (params) => new Date(params).toISOString(),
      type: "string",
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "companySignatureName",
      headerName: "Название компании",
      flex: 12,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "documentName",
      headerName: "Название документа",
      flex: 12,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "documentStatus",
      headerName: "Статус документа",
      flex: 12,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "documentType",
      headerName: "Тип документа",
      flex: 12,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "employeeNumber",
      headerName: "Номер сотрудника",
      flex: 12,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "employeeSigDate",
      headerName: "Дата регистрации сотрудника",
      valueGetter: (params) => new Date(params).toISOString(),
      type: "string",
      flex: 12,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "employeeSignatureName",
      headerName: "Подпись сотрудника",
      flex: 12,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Действие",
      flex: 4,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{ color: "primary.main" }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
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
      className="table"
      sx={{
        "& .actions": { color: "text.secondary" },
        "& .textPrimary": { color: "text.primary" },
      }}
    >
      {loading && (
        <Box
          sx={{
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <CircularProgress size={120} />
        </Box>
      )}
      {!loading && (
        <DataGrid
          rows={rows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          slots={{ toolbar: EditToolbar as GridSlots["toolbar"] }}
          slotProps={{ toolbar: { setRows, setRowModesModel, authToken } }}
        />
      )}
    </Box>
  );
}
