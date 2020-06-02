import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./api";
import jwtDecode from "jwt-decode";
import { useDispatch } from "react-redux";

const slice = createSlice({
  name: "techs",
  initialState: {
    list: [],
    currentTech: null,
    loading: false,
    error: null,
  },
  reducers: {
    techsRequested: (techs, action) => {
      techs.loading = true;
    },
    techRequestFailed: (techs, action) => {
      techs.loading = false;
      techs.error = action.payload;
    },
    techsReceived: (techs, action) => {
      techs.list = action.payload;
      techs.loading = false;
    },
    techAdded: (techs, action) => {
      techs.list.push(action.payload);
    },
    techDeleted: (techs, action) => {
      const index = techs.list.findIndex((tech) => tech._id === action.payload);
      techs.list.splice(index, 1);
    },
    techLoggedIn: (techs, action) => {
      localStorage.setItem("token", action.payload);
      const tech = jwtDecode(action.payload);
      techs.currentTech = tech;
    },
    currentTechAdded: (techs, action) => {
      techs.currentTech = action.payload;
    },
    techRegistered: (techs, action) => {
      techs.currentTech = action.payload;
    },
  },
});

export default slice.reducer;

export const {
  techsRequested,
  techsReceived,
  techRequestFailed,
  techAdded,
  techDeleted,
  techLoggedIn,
  techRegistered,
  currentTechAdded,
} = slice.actions;

const url = "http://localhost:8000/api/techs";

export const getTechs = () =>
  apiCallBegan({
    url,
    onStart: techsRequested.type,
    onSuccess: techsReceived.type,
    onError: techRequestFailed.type,
  });

export const addTech = (tech) =>
  apiCallBegan({
    url,
    method: "post",
    data: tech,
    onSuccess: techAdded.type,
  });

export const deleteTech = (id) =>
  apiCallBegan({
    url: `${url}/${id}`,
    method: "delete",
    onSuccess: techDeleted.type,
  });

export const loggingTech = (tech) =>
  apiCallBegan({
    url: "http://localhost:8000/api/auth",
    method: "post",
    data: tech,
    onSuccess: techLoggedIn.type,
    onError: techRequestFailed.type,
  });

export const getCurrentTech = () => {
  const jwt = localStorage.getItem("token");
  if (!jwt) return null;
  const decoded = jwtDecode(jwt);
  return decoded;
};
//   Selectors

export const selectTechs = (state) => state.entities.techs;

export const selectTechsList = (state) => state.entities.techs.list;

export const selectCurrentTech = (state) => state.entities.techs.currentTech;
